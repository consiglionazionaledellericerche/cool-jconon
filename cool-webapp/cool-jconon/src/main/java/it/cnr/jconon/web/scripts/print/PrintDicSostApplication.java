package it.cnr.jconon.web.scripts.print;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.web.scripts.search.ContentGet;
import it.cnr.jconon.web.scripts.model.ApplicationModel;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Type;
import java.nio.charset.Charset;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.Map;
import java.util.ResourceBundle;

import net.sf.jasperreports.engine.JRDataSource;
import net.sf.jasperreports.engine.JRParameter;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.data.JsonDataSource;
import net.sf.jasperreports.engine.fill.JRGzipVirtualizer;

import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.Session;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.extensions.surf.support.ThreadLocalRequestContext;
import org.springframework.extensions.surf.util.I18NUtil;
import org.springframework.extensions.webscripts.WebScriptException;
import org.springframework.extensions.webscripts.WebScriptRequest;
import org.springframework.extensions.webscripts.WebScriptResponse;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;

public class PrintDicSostApplication extends ContentGet { // TODO rinominare. (PrintDichiarazioneSostitutiva?)
	private static final Logger LOGGER = LoggerFactory.getLogger(PrintDicSostApplication.class);
    @Autowired
    private CMISService cmisService;


	@Override
	public void execute(WebScriptRequest req, WebScriptResponse res)
			throws IOException {
		String nodeRef = req.getParameter("applicationId");
		Session cmisSession = cmisService.createAdminSession();
		Folder application = (Folder) cmisSession.getObject(nodeRef);
		application.refresh();
		final String contextURL = req.getContextPath() + ThreadLocalRequestContext.getRequestContext().getContextPath();
		InputStream is = new ByteArrayInputStream(getRicevutaReportModel(cmisSession, application, contextURL));
		responseCMISContent(req, res, is,"application/pdf", "Dichiarazione sostitutiva.pdf");
	}

	@SuppressWarnings("deprecation")
	public byte[] getRicevutaReportModel(Session cmisSession, Folder application, String contextURL) throws WebScriptException {

		ApplicationModel applicationBulk = new ApplicationModel(application,
				cmisSession.getDefaultContext(), getMessages("GET",
						"manage-application"), contextURL);

		final Gson gson = new GsonBuilder()
		.setDateFormat("yyyy-MM-dd'T'HH:mm:ss")
		.excludeFieldsWithoutExposeAnnotation()
		.registerTypeAdapter(GregorianCalendar.class, new JsonSerializer<GregorianCalendar>() {
			@Override
			public JsonElement serialize(GregorianCalendar src, Type typeOfSrc,
					JsonSerializationContext context) {
				return  context.serialize(src.getTime());
			}
		}).create();
		String json = "{\"properties\":"+gson.toJson(applicationBulk.getProperties())+"}";
		LOGGER.debug(json);

		try {

			Map<String, Object> parameters = new HashMap<String, Object>();
			JRDataSource datasource = new JsonDataSource(new ByteArrayInputStream(json.getBytes(Charset.forName("UTF-8"))), "properties");
			JRGzipVirtualizer vir = new JRGzipVirtualizer(100);
			final ResourceBundle resourceBundle = ResourceBundle.getBundle(
					"net.sf.jasperreports.view.viewer", I18NUtil.getLocale());
			parameters.put(JRParameter.REPORT_LOCALE, I18NUtil.getLocale());
			parameters.put(JRParameter.REPORT_RESOURCE_BUNDLE, resourceBundle);
			parameters.put(JRParameter.REPORT_DATA_SOURCE, datasource);
			parameters.put(JRParameter.REPORT_VIRTUALIZER, vir);
			parameters.put("DIR_IMAGE", this.getClass().getResource("/it/cnr/jconon/print/").getPath());
			parameters.put("SUBREPORT_DIR", this.getClass().getResource("/it/cnr/jconon/print/").getPath());

			ClassLoader classLoader = ClassLoader.getSystemClassLoader();
			parameters.put(JRParameter.REPORT_CLASS_LOADER, classLoader);

			JasperPrint jasperPrint = JasperFillManager.fillReport(this.getClass().getResourceAsStream("/it/cnr/jconon/print/DichiarazioneSostitutiva.jasper"), parameters);
			return JasperExportManager.exportReportToPdf(jasperPrint);
		} catch (Exception e) {
			throw new WebScriptException("Error in JASPER", e);
		}
	}
}