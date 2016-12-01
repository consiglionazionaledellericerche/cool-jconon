package it.cnr.cool.service.search;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.*;
import com.hazelcast.core.HazelcastInstance;
import com.hazelcast.core.IMap;
import com.hazelcast.map.listener.EntryEvictedListener;
import org.apache.commons.httpclient.*;
import org.apache.commons.httpclient.auth.AuthScope;
import org.apache.commons.httpclient.methods.GetMethod;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URI;
import java.nio.charset.Charset;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class SiperService implements InitializingBean {

	private static final Logger LOGGER = LoggerFactory
			.getLogger(SiperService.class);

    @Value("${siper.anadip.url}")	
	private String urlAnadip;
    
    @Value("${siper.sedi.url}")    
	private String urlSedi;

    @Value("${siper.username}")
    private String userName;

    @Value("${siper.password}")
    private String pentagono;

    public static final String SIPER_MAP_NAME = "sedi-siper";

    @Autowired
    private HazelcastInstance hazelcastInstance;

    public JsonObject getAnagraficaDipendente(String username) {
		// Create an instance of HttpClient.
		JsonElement json = null;

		if (username == null || urlAnadip == null) {
			LOGGER.error("Parameter Url and Matricola are required.");
		} else {

            String uri = urlAnadip + '/' + username;

            try {

                HttpMethod method = new GetMethod(uri);

				HttpClient httpClient = new HttpClient();
				Credentials credentials = new UsernamePasswordCredentials(userName, pentagono);
				httpClient.getState().setCredentials(AuthScope.ANY, credentials);
                httpClient.executeMethod(method);

                int statusCode = httpClient.executeMethod(method);

				if (statusCode != HttpStatus.SC_OK) {
					LOGGER.error("Recupero dati da Siper fallito per la matricola "
							+ username
							+ "."
							+ " dalla URL:"
							+ urlAnadip
							+ " [" + statusCode + "]");
					return null;
				} else {
					// Read the response body.

                    String jsonString = method.getResponseBodyAsString();

					json = new JsonParser().parse(jsonString);
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

        hazelcastInstance
                .getConfig()
                .getMapConfig(SIPER_MAP_NAME)
				.setMaxIdleSeconds(6)
                .setTimeToLiveSeconds(3600);


		IMap<Object, Object> m = hazelcastInstance.getMap(SIPER_MAP_NAME);

		// TODO: evitare soluzioni estreme!
		m.addEntryListener((EntryEvictedListener) event -> m.clear(), false);

	}

    public Collection<SiperSede> cacheableSediSiper() {
		return sediSiper().values();
    }



    private Map<String, SiperSede> sediSiper() {

		IMap<String, SiperSede> cache = hazelcastInstance.getMap(SIPER_MAP_NAME);

		if (cache.isEmpty()) {
			LOGGER.info("cache is empty");

			Map<String, SiperSede> map = sediSiper(Optional.empty())
					.stream()
					.collect(Collectors.toMap(SiperSede::getSedeId, Function.identity()));

			cache.putAll(map);

			return map;

		} else {
			LOGGER.info("cache is not empty");
			return cache;
		}

	}

	@Cacheable(SIPER_MAP_NAME)
    public Optional<SiperSede> cacheableSiperSede(String key) {
        LOGGER.info("evaluating key {}", key);
		Map<String, SiperSede> sediSiper = sediSiper();
		return Optional.of(sediSiper.get(key));
    }


	private List<SiperSede> sediSiper(Optional<String> sede) {

		RestTemplate rt = new RestTemplate();

		Charset charset = Charset.forName("UTF-8");
		StringHttpMessageConverter stringHttpMessageConverter = new StringHttpMessageConverter(charset);
		rt.getMessageConverters().add(0, stringHttpMessageConverter);

		MultiValueMap<String, String> urlVariables = new LinkedMultiValueMap<>();
		urlVariables.put("attive", Arrays.asList(Boolean.TRUE.toString()));
		sede.ifPresent(value -> urlVariables.put("sedeId", Arrays.asList(value)));

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

			SiperSede s1 = new SiperSede();
			s1.setDescrizione("AMMINISTRAZIONE CENTRALE");
			s1.setCitta("ROMA");
			s1.setSedeId("-1");
			SiperSede s2 = new SiperSede();
			s2.setSedeId("-2");
			s2.setDescrizione("STRUTTURE/ ISTITUTI DEL CONSIGLIO NAZIONALE DELLE RICERCHE");
			s2.setCitta("ITALIA");

			siperSedes.add(s1);
			siperSedes.add(s2);

			return siperSedes;

		} catch (IOException e) {
			throw new RuntimeException("unable to get sedi siper", e);
		}
	}
}
