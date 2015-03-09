package it.cnr.doccnr.service.zipper;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonSyntaxException;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.mail.MailService;
import it.cnr.cool.mail.model.EmailMessage;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.util.MimeTypes;
import org.apache.chemistry.opencmis.client.api.CmisObject;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.bindings.impl.CmisBindingsHelper;
import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.apache.chemistry.opencmis.client.bindings.spi.http.Response;
import org.apache.chemistry.opencmis.commons.SessionParameter;
import org.apache.chemistry.opencmis.commons.impl.UrlBuilder;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.io.InputStream;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Map;

public class ZipperServiceAsynchronous implements Runnable {

    public static final String KEY_CDS = "cds";
    public static final String KEY_VARIAZIONI = "variazioni";
    public static final String KEY_ESERCIZIO = "esercizio";
    public static final String URL_ZIP_CONTENT = "service/zipper/zipContent";
    public static final String URL_ISO_CONTENT = "service/iso/isoContent";

    private final String DOWNLOAD_URL = "/rest/content?nodeRef=";
    private final String KEY_NODEREF_RESPONSE = "nodeRef";
    private final String NODEREF_PREFIX = "workspace://SpacesStore/";
    private final Logger LOGGER = LoggerFactory
            .getLogger(ZipperServiceAsynchronous.class);
    @Autowired
    private MailService mailService;
    @Autowired
    private CMISService cmisService;

    private String downloadPrefixUrl;

    private Boolean deleteAfterDownload;

    private String formatDownload;
    private String zipName;

    private Session cmisSession;
    private CMISUser user;
    private Map<String, String> queryParam;
    private BindingSession bindingSession;


    public ZipperServiceAsynchronous() {

    }

    @Override
    public void run() {
        if (zipName.isEmpty()) {
            zipName = "default";
        }
        String query = "SELECT doc.cmis:objectId FROM varpianogest:document AS doc INNER JOIN strorg:cds AS cds ON doc.cmis:objectId = cds.cmis:objectId ";

        if (queryParam.containsKey(KEY_ESERCIZIO) || queryParam.containsKey(KEY_VARIAZIONI) || queryParam.containsKey(KEY_CDS)) {
            query = query + " where ";
            if (queryParam.containsKey(KEY_ESERCIZIO)) {
                query = query + " doc.varpianogest:esercizio = '" + queryParam.get(KEY_ESERCIZIO) + "' AND ";
            }
            if (queryParam.containsKey(KEY_VARIAZIONI)) {
                query = query + " doc.varpianogest:numeroVariazione IN (" + splitVariazioni(queryParam.get(KEY_VARIAZIONI)) + ") AND ";
            }

            if (queryParam.containsKey(KEY_CDS)) {
                query = query + "cds.strorgcds:codice = '" + queryParam.get(KEY_CDS) + "' AND";
            }
            query = query.substring(0, query.lastIndexOf("AND"));
        }

        String pathDestZip = "/User Homes/" + user.getId();
        CmisObject destZip = cmisSession.getObjectByPath(pathDestZip);

        // creo lo ZIP delle variazioni
        String link = null;
        if (formatDownload.equals("zip")) {
            link = cmisService.getBaseURL().concat(
                    URL_ZIP_CONTENT);
        } else if (formatDownload.equals("iso")) {
            link = cmisService.getBaseURL().concat(
                    URL_ISO_CONTENT);
        }

        UrlBuilder url = new UrlBuilder(link);
        url.addParameter("query", query);
        url.addParameter("destination",
                         NODEREF_PREFIX + destZip.getId());
        url.addParameter("filename", zipName);
        url.addParameter("noaccent", true);

        bindingSession.put(SessionParameter.READ_TIMEOUT, -1);


        LOGGER.info("ZipperService - Request Zip-Content partita");
        Response response = CmisBindingsHelper.getHttpInvoker(
                bindingSession).invokeGET(url, bindingSession);

        sendMessage(mailService, user, zipName, downloadPrefixUrl,
                    response.getResponseCode(), response.getStream(),
                    response.getErrorContent(), queryParam, formatDownload);
    }

    public void setFormatDownload(String formatDownload) {
        this.formatDownload = formatDownload;
    }

    public BindingSession getBindingsession() {
        return bindingSession;
    }

    public void setBindingsession(BindingSession bindingsession) {
        this.bindingSession = bindingsession;
    }

    public void setZipName(String zipName) {
        this.zipName = zipName;
    }

    public void setCmisSession(Session cmisSession) {
        this.cmisSession = cmisSession;
    }

    public void setUser(CMISUser user) {
        this.user = user;
    }

    public void setQueryParam(Map<String, String> queryParam) {
        this.queryParam = queryParam;
    }

    public void setDownloadPrefixUrl(String downloadPrefixUrl) {
        this.downloadPrefixUrl = downloadPrefixUrl;
    }

    public void setDeleteAfterDownload(Boolean deleteAfterDownload) {
        this.deleteAfterDownload = deleteAfterDownload;
    }

    private void sendMessage(
            MailService mailService, CMISUser user,
            String zipName, String urlServer, int responseCode,
            InputStream stream, String errorContent, Map<String, String> queryParam, String formatDownload) {

        EmailMessage message = new EmailMessage();
        StringBuffer testo = new StringBuffer();
        StringBuilder subject = new StringBuilder();
        // aggiunge il footer al messaggio
        testo.append("  Data: ");
        DateFormat formatter = new SimpleDateFormat("dd.MM.yyyy (HH:mm:ss)");
        testo.append(formatter.format(Calendar.getInstance().getTime()));

        try {
            if (responseCode == HttpStatus.SC_OK) {
                LOGGER.info("ZipperService - file " + zipName + MimeTypes.ZIP.getExtension() + " creato");

                JsonObject json = new JsonParser().parse(
                        IOUtils.toString(stream)).getAsJsonObject();

                subject.append("E' stato creato il file " + zipName + (formatDownload.equals("zip") ? MimeTypes.ZIP.getExtension() : MimeTypes.ISO));
                testo.append("<br/>");
                testo.append("Il processo di background è terminato quindi è possibile utilizzare e scaricare il file ");
                testo.append("<a href='")
                        .append(urlServer + DOWNLOAD_URL
                                        + json.get(KEY_NODEREF_RESPONSE).getAsString())
                        .append("&deleteAfterDownload=" + deleteAfterDownload).append("'>");
                testo.append(zipName + "." + formatDownload).append("</a>");
                if (deleteAfterDownload) {
                    testo.append("<BR><b>Il file verrà eliminato dopo il download.</b>");
                }
                LOGGER.info("Downlod URL:" + urlServer + DOWNLOAD_URL
                                    + json.get(KEY_NODEREF_RESPONSE).getAsString());
            } else {
                LOGGER.error("ZipperService - Creazione del file " + zipName + (formatDownload.equals("zip") ? MimeTypes.ZIP.getExtension() : MimeTypes.ISO) + " fallita: "
                                     + errorContent);
                subject.append("Il processo background di creazione del file " + zipName + (formatDownload.equals("zip") ? MimeTypes.ZIP.getExtension() : MimeTypes.ISO) + " è FALLITO");
                testo.append("<br/>");
                testo.append(subject.toString());
                testo.append("<BR>");
                testo.append("Codice: " + responseCode);
                testo.append("<BR>");
                JsonObject item = new JsonParser().parse(errorContent).getAsJsonObject();
                testo.append("Response Message: " + item.get("message"));
                testo.append("<BR>");
                testo.append("Variazioni: " + queryParam.get(KEY_VARIAZIONI));
                testo.append("<BR>");
                testo.append("Esercizio: " + queryParam.get(KEY_ESERCIZIO));
                testo.append("<BR>");
                testo.append("Cds: " + queryParam.get(KEY_CDS));
                testo.append("<BR>");
            }
            message.setBody(testo);
            message.setHtmlBody(true);
            message.setSubject(subject.toString());
            message.addRecipient(user.getEmail());
            mailService.send(message);
        } catch (JsonSyntaxException jsonExceprtion) {
            LOGGER.error("Errore nel parsing del noderef dello zip creato",
                         jsonExceprtion);
        } catch (IOException ioExceprtion) {
            LOGGER.error("Errore nel parsing del noderef dello zip creato",
                         ioExceprtion);
        } catch (Exception e) {
            LOGGER.error("Errore nell'invio della mail", e);
        }
    }

    private String splitVariazioni(String input) {
        String ret = "";
        String[] stringSpitted = input.split(",");
        for (int j = 0; j < stringSpitted.length; j++) {
            ret = ret + "'" + Integer.parseInt(stringSpitted[j].trim()) + "',";
        }
        return ret.substring(0, ret.lastIndexOf(","));
    }
}