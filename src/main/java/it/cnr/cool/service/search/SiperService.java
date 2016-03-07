package it.cnr.cool.service.search;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import com.google.common.collect.ImmutableMap;
import com.google.gson.*;
import org.apache.chemistry.opencmis.commons.impl.UrlBuilder;
import org.apache.commons.httpclient.*;
import org.apache.commons.httpclient.auth.AuthScope;
import org.apache.commons.httpclient.methods.GetMethod;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

public class SiperService implements InitializingBean {

	private static final Logger LOGGER = LoggerFactory
			.getLogger(SiperService.class);
	
	private String urlAnadip;
	private String urlSedi;
	LoadingCache<String, JsonElement> sediCache;

    @Value("${siper.username}")
    private String userName;

    @Value("${siper.password}")
    private String pentagono;

    public JsonObject getAnagraficaDipendente(String username) {
		// Create an instance of HttpClient.
		JsonElement json = null;

		if (username == null || urlAnadip == null) {
			LOGGER.error("Parameter Url and Matricola are required.");
		} else {

            String uri = urlAnadip + '/' + username;

            try {

                HttpMethod method = new GetMethod(uri);
                HttpClient httpClient = getHttpClient();
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
                        + urlAnadip);
			} catch (IOException e) {
                LOGGER.error("error in HTTP request " + uri, e);
            }
        }
		return (JsonObject) json;
	}

    private HttpClient getHttpClient() {
        HttpClient httpClient = new HttpClient();
        Credentials credentials = new UsernamePasswordCredentials(userName, pentagono);
        httpClient.getState().setCredentials(AuthScope.ANY, credentials);
        return httpClient;
    }

	private JsonElement retreiveSedi() {
		// Create an instance of HttpClient.
		JsonObject json = null;

		UrlBuilder url = new UrlBuilder(urlSedi);
		url.addParameter("attive", Boolean.TRUE);

		try {
			// Execute the method.

            HttpMethod method = new GetMethod(url.toString());
            HttpClient httpClient = getHttpClient();
            int statusCode = httpClient.executeMethod(method);

            if (statusCode != HttpStatus.SC_OK) {
				LOGGER.error("Recupero dati da Siper fallito per le Sedi "
						+ "." + " dalla URL:" + urlSedi + " [" + statusCode
						+ "]");
				return null;
			} else {
				// Read the response body.
				String jsonString = method.getResponseBodyAsString();
				json = new JsonObject();
				JsonArray results = new JsonArray();
				JsonArray sedi = (JsonArray) new JsonParser().parse(jsonString);
				for (JsonElement sede : sedi) {
					String sedeId = sede.getAsJsonObject().get("sedeId").getAsString();
					JsonObject obj = new JsonObject();
					String UO = "";
					String titCa = getAttribute(sede.getAsJsonObject(), "titCa");					
					if (titCa.length() > 0) {
						UO = titCa.substring(0, 3).concat(".").concat(titCa.substring(3));
					}
					obj.addProperty("key", sedeId);
					obj.addProperty("descrizione", getAttribute(sede.getAsJsonObject(), "descrizione"));
					obj.addProperty("citta", getAttribute(sede.getAsJsonObject(), "citta"));
					obj.addProperty("label", 							
							getAttribute(sede.getAsJsonObject(), "descrizione").concat(" ").
							concat(getAttribute(sede.getAsJsonObject(), "indirizzo").concat(" ")).
							concat(getAttribute(sede.getAsJsonObject(), "cap").concat(" ")).
							concat(getAttribute(sede.getAsJsonObject(), "citta").concat(" ")).
							concat("(").concat(getAttribute(sede.getAsJsonObject(), "prov").concat(")")).
							concat(" UO: ").concat(UO)
							);
					
					results.add(obj);
					sediCache.put(sedeId, obj);
				}
				//Aggiungo un oggetto per l'amministrazione Centrale
				JsonObject obj = new JsonObject();
				String UO = "000.000";
				obj.addProperty("key", "-1");
				obj.addProperty("descrizione", "AMMINISTRAZIONE CENTRALE");
				obj.addProperty("citta", "ROMA");
				obj.addProperty("label", "AMMINISTRAZIONE CENTRALE PIAZZALE ALDO MORO 7 – 00185 ROMA (RM)".concat(" UO: ").concat(UO));				
				results.add(obj);

				JsonObject objCNR = new JsonObject();
				objCNR.addProperty("key", "-2");
				objCNR.addProperty("descrizione", "STRUTTURE/ ISTITUTI DEL CONSIGLIO NAZIONALE DELLE RICERCHE");
				objCNR.addProperty("citta", "ITALIA");
				objCNR.addProperty("label", "STRUTTURE/ ISTITUTI DEL CONSIGLIO NAZIONALE DELLE RICERCHE");				
				results.add(objCNR);
				
				json.add("results", results);
			}
		} catch (JsonParseException e) {
			LOGGER.error("Errore in fase di recupero dati da Siper fallito per le sedi - "
					+ e.getMessage() + " dalla URL:" + urlSedi, e);
		} catch (HttpException e) {
            LOGGER.error("Errore in fase di recupero dati da Siper fallito per le sedi - "
                    + e.getMessage() + " dalla URL:" + urlSedi, e);
        } catch (IOException e) {
            LOGGER.error("Errore in fase di recupero dati da Siper fallito per le sedi - "
                    + e.getMessage() + " dalla URL:" + urlSedi, e);
        }
        return json;
	}

	private String getAttribute(JsonObject json, String prop) {
		if (json.get(prop) != null)
			return json.get(prop).getAsString();
		return "";
	}
	public void setUrlAnadip(String urlAnadip) {
		this.urlAnadip = urlAnadip;
	}

	public void setUrlSedi(String urlSedi) {
		this.urlSedi = urlSedi;
	}

	public JsonElement getSedi() throws ExecutionException {
		return sediCache.get("all");
	}

	public ImmutableMap<String, JsonElement> getSedi(Iterable<String> sedi) throws ExecutionException {
		if (sediCache.getAllPresent(sedi).isEmpty()) 
			sediCache.get("all");
		return sediCache.getAll(sedi);
	}	
	
	public JsonElement getSede(String sedeId) throws ExecutionException {
		if (sediCache.getIfPresent(sedeId) == null)
			sediCache.get("all");
		return sediCache.get(sedeId);
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		sediCache = CacheBuilder.newBuilder()
				.expireAfterWrite(1, TimeUnit.DAYS)
				.build(new CacheLoader<String, JsonElement>() {
					@Override
					public JsonElement load(String key) {
						return retreiveSedi();
					}
				});
	}

}
