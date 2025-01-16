/*
 *    Copyright (C) 2019  Consiglio Nazionale delle Ricerche
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as
 *     published by the Free Software Foundation, either version 3 of the
 *     License, or (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

package it.cnr.si.cool.jconon.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParseException;
import com.google.gson.JsonParser;
import com.hazelcast.core.HazelcastInstance;
import com.hazelcast.map.IMap;
import com.hazelcast.map.listener.EntryEvictedListener;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.si.cool.jconon.dto.SiperSede;
import it.cnr.si.cool.jconon.exception.SiperException;
import org.apache.chemistry.opencmis.client.api.Document;
import org.apache.chemistry.opencmis.commons.data.ContentStream;
import org.apache.chemistry.opencmis.commons.exceptions.CmisObjectNotFoundException;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.httpclient.*;
import org.apache.commons.httpclient.auth.AuthScope;
import org.apache.commons.httpclient.auth.CredentialsProvider;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.io.IOUtils;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.impl.client.HttpClientBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.client.support.BasicAuthenticationInterceptor;
import org.springframework.http.client.support.BasicAuthorizationInterceptor;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@ConditionalOnProperty("siper.url")
public class SiperService implements InitializingBean {

	private static final Logger LOGGER = LoggerFactory
			.getLogger(SiperService.class);
	public static final String SEDI_JSON = "/Data Dictionary/Web Applications/jconon/WEB-INF/classes/sedi.json";

	@Value("${siper.anadip.url}")
	private String urlAnadip;
    
    @Value("${siper.sedi.url}")    
	private String urlSedi;

    @Value("${siper.username}")
    private String userName;

    @Value("${siper.password}")
    private String password;

	@Value("${siper.cache.timeToLiveSeconds}")
	private Integer siperSediTimeToLiveSeconds;

    public static final String SIPER_MAP_NAME = "sedi-siper";

    @Autowired
    private HazelcastInstance hazelcastInstance;

    @Autowired
	private CMISService cmisService;

    public JsonObject getAnagraficaDipendente(String username) {
		// Create an instance of HttpClient.
		JsonElement json = null;

		if (username == null || urlAnadip == null) {
			LOGGER.error("Parameter Url and Matricola are required.");
		} else {

            String uri = urlAnadip + '/' + username;

            try {
				HttpGet request = new HttpGet(uri);
				String auth = userName + ":" + password;
				byte[] encodedAuth = Base64.encodeBase64(
						auth.getBytes(StandardCharsets.UTF_8));
				String authHeader = "Basic " + new String(encodedAuth);
				request.setHeader(HttpHeaders.AUTHORIZATION, authHeader);

				org.apache.http.client.HttpClient client = HttpClientBuilder.create().build();
				HttpResponse response = client.execute(request);

                int statusCode = response.getStatusLine().getStatusCode();

				if (statusCode != HttpStatus.SC_OK) {
					LOGGER.error("Recupero dati da Siper fallito per la matricola "
							+ username
							+ "."
							+ " dalla URL:"
							+ urlAnadip
							+ " [" + statusCode + "]");
					return null;
				} else {
					json = new JsonParser().parse(IOUtils.toString(response.getEntity().getContent(), StandardCharsets.UTF_8));
				}
			} catch (JsonParseException e) {
				LOGGER.error("Errore in fase di recupero dati da Siper fallito per la matricola "
                        + username
                        + " - "
                        + e.getMessage()
                        + " dalla URL:"
                        + urlAnadip, e);
			} catch (IOException e) {
                LOGGER.error("error in HTTP request " + uri, e);
            }
        }
		return (JsonObject) json;
	}


	@Override
	public void afterPropertiesSet() throws Exception {

    	LOGGER.info("cache {} timeToLive: {}", SIPER_MAP_NAME, siperSediTimeToLiveSeconds);

        hazelcastInstance
                .getConfig()
                .getMapConfig(SIPER_MAP_NAME)
                .setTimeToLiveSeconds(siperSediTimeToLiveSeconds);

		IMap<Object, Object> m = hazelcastInstance.getMap(SIPER_MAP_NAME);

		m.addEntryListener((EntryEvictedListener) event -> {
			LOGGER.warn("clearing siper cache");
			m.clear();
		}, false);

	}

    public Collection<SiperSede> cacheableSiperSedi() {
		return sediSiper()
				.entrySet()
				.stream()
				.sorted((e1, e2) -> e1.getKey().compareTo(e2.getKey()))
    			.map(stringSiperSedeEntry -> stringSiperSedeEntry.getValue())
				.collect(Collectors.toList());
    }



    private Map<String, SiperSede> sediSiper() {

		IMap<String, SiperSede> cache = hazelcastInstance.getMap(SIPER_MAP_NAME);

		if (cache.isEmpty()) {
			LOGGER.info("siper cache is empty");

			Map<String, SiperSede> map = sediSiper(Optional.empty())
					.stream()
					.distinct()
					.filter(siperSede -> Optional.ofNullable(siperSede.getIndirizzo())
							.filter(s -> !s.equals("SEDE DA UTILIZZARE"))
							.isPresent())
					.collect(Collectors.toMap(SiperSede::getSedeId, Function.identity()));


			cache.putAll(map);

			LOGGER.info("siper map contains {} sedi", map.size());

			return map;

		} else {
			LOGGER.info("siper cache contains {} items", cache.size());
			return cache;
		}

	}

	@Cacheable(SIPER_MAP_NAME)
    public Optional<SiperSede> cacheableSiperSede(String key) {
        LOGGER.info("evaluating key {}", key);
		Map<String, SiperSede> sediSiper = sediSiper();
		if (sediSiper.containsKey(key))
			return Optional.ofNullable(sediSiper.get(key));
		return Optional.empty();
    }


	private List<SiperSede> sediSiper(Optional<String> sede) {

		RestTemplate rt = new RestTemplate();
		rt.getInterceptors().add(
				new BasicAuthenticationInterceptor(userName, password));
		Charset charset = Charset.forName("UTF-8");
		StringHttpMessageConverter stringHttpMessageConverter = new StringHttpMessageConverter(charset);
		rt.getMessageConverters().add(0, stringHttpMessageConverter);

		MultiValueMap<String, String> urlVariables = new LinkedMultiValueMap<>();
		sede.ifPresent(value -> urlVariables.put("sedeId", Arrays.asList(value)));
		if (!Optional.ofNullable(urlSedi).filter(s -> !s.isEmpty()).isPresent()) {
			return Collections.emptyList();
		}

		URI uri = UriComponentsBuilder
				.fromUriString(urlSedi)
				.queryParams(urlVariables)
				.build()
				.toUri();

		LOGGER.info("siper uri: {}", uri);

		try {
			String json = rt.getForObject(uri, String.class);
			LOGGER.debug("siper data: {}", json);
			ObjectMapper objectMapper = new ObjectMapper();
			SiperSede[] sedi = objectMapper.readValue(json, SiperSede[].class);
			List<SiperSede> siperSedes = new ArrayList<SiperSede>(); 
			siperSedes.addAll(Arrays.asList(sedi));
			/**
			 * Leggo le sedi non ancora inserite
			 */
			try {
				Optional.ofNullable(cmisService
						.createAdminSession()
						.getObjectByPath(SEDI_JSON))
						.filter(Document.class::isInstance)
						.map(Document.class::cast)
						.map(Document::getContentStream)
						.map(ContentStream::getStream)
						.ifPresent(inputStream1 -> {
							try {
								siperSedes.addAll(Arrays.asList(objectMapper.readValue(inputStream1, SiperSede[].class)));
							} catch (IOException e) {
								LOGGER.error("Cannot read document of sedi.json",e);
							}
						});
			} catch (CmisObjectNotFoundException _ex) {
				LOGGER.warn("sedi.json not found");
			}
			return siperSedes;
		} catch (IOException e) {
			throw new SiperException("unable to get sedi siper", e);
		} catch (HttpClientErrorException _ex) {
			if (!_ex.getStatusCode().equals(HttpStatus.SC_NOT_FOUND))
				LOGGER.error("Cannot find sedi {}", _ex.getMessage());
			return Collections.emptyList();
		}
	}
}
