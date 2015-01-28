package it.cnr.cool.service.search;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.util.StringUtil;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

import org.apache.chemistry.opencmis.client.bindings.impl.CmisBindingsHelper;
import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.apache.chemistry.opencmis.client.bindings.spi.http.Response;
import org.apache.chemistry.opencmis.commons.impl.UrlBuilder;
import org.apache.commons.httpclient.HttpStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import com.google.common.collect.ImmutableMap;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParseException;
import com.google.gson.JsonParser;

public class SiperService implements InitializingBean {

	private static final Logger LOGGER = LoggerFactory
			.getLogger(SiperService.class);
	@Autowired
	private CMISService cmisService;
	
	private String urlAnadip;
	private String urlSedi;
	LoadingCache<String, JsonElement> sediCache;

	public JsonObject getAnagraficaDipendente(String matricola,
			BindingSession siperCurrentBindingSession) {
		// Create an instance of HttpClient.
		JsonElement json = null;

		if (matricola == null || urlAnadip == null) {
			LOGGER.error("Parameter Url and Matricola are required.");
		} else {
			UrlBuilder url = new UrlBuilder(urlAnadip + '/' + matricola);

			Response resp = CmisBindingsHelper.getHttpInvoker(
					siperCurrentBindingSession).invokeGET(url,
					siperCurrentBindingSession);

			try {
				// Execute the method.
				int statusCode = resp.getResponseCode();

				if (statusCode != HttpStatus.SC_OK) {
					LOGGER.error("Recupero dati da Siper fallito per la matricola "
							+ matricola
							+ "."
							+ " dalla URL:"
							+ urlAnadip
							+ " [" + statusCode + "]");
					return null;
				} else {
					// Read the response body.
					String jsonString = new String(
							StringUtil.convertStreamToString(resp.getStream()));

					json = new JsonParser().parse(jsonString);
				}
			} catch (JsonParseException e) {
				LOGGER.error("Errore in fase di recupero dati da Siper fallito per la matricola "
						+ matricola
						+ " - "
						+ e.getMessage()
						+ " dalla URL:"
						+ urlAnadip);
			}
		}
		return (JsonObject) json;
	}

	private JsonElement retreiveSedi() {
		// Create an instance of HttpClient.
		JsonObject json = null;

		UrlBuilder url = new UrlBuilder(urlSedi);
		url.addParameter("attive", Boolean.TRUE);
		Response resp = CmisBindingsHelper.getHttpInvoker(
				cmisService.createBindingSession()).invokeGET(url,
						cmisService.createBindingSession());
		try {
			// Execute the method.
			int statusCode = resp.getResponseCode();

			if (statusCode != HttpStatus.SC_OK) {
				LOGGER.error("Recupero dati da Siper fallito per le Sedi "
						+ "." + " dalla URL:" + urlSedi + " [" + statusCode
						+ "]");
				return null;
			} else {
				// Read the response body.
				String jsonString = new String(
						StringUtil.convertStreamToString(resp.getStream()));
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
				json.add("results", results);
			}
		} catch (JsonParseException e) {
			LOGGER.error("Errore in fase di recupero dati da Siper fallito per le sedi - "
					+ e.getMessage() + " dalla URL:" + urlSedi);
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
