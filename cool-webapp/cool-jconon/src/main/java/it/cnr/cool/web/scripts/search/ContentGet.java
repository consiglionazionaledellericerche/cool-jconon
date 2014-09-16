package it.cnr.cool.web.scripts.search;


import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.web.scripts.AbstractWebScript;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.SocketException;
import java.util.Date;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.chemistry.opencmis.client.api.Document;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.commons.exceptions.CmisRuntimeException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.extensions.surf.ServletUtil;
import org.springframework.extensions.surf.extensibility.impl.ModelWriter;
import org.springframework.extensions.surf.support.ThreadLocalRequestContext;
import org.springframework.extensions.webscripts.Cache;
import org.springframework.extensions.webscripts.WebScriptException;
import org.springframework.extensions.webscripts.WebScriptRequest;
import org.springframework.extensions.webscripts.WebScriptResponse;
import org.springframework.util.FileCopyUtils;

public class ContentGet extends AbstractWebScript {
	  // Logger
    private static final Logger LOGGER = LoggerFactory.getLogger(ContentGet.class);
    @Autowired
    private CMISService cmisService;

    private static final long MAX_LENGTH = 500000000;

	@Override
	public void execute(WebScriptRequest req, WebScriptResponse res)
			throws IOException {
		String nodeRef = req.getParameter("nodeRef");
		responseCMISContent(req, res, nodeRef);
	}

	public void responseCMISContent(WebScriptRequest req, WebScriptResponse res, InputStream is, long length){
        try
        {
        	if (length > MAX_LENGTH) {
            	FileCopyUtils.copy(is, res.getOutputStream());
        	} else {
    			ThreadLocalRequestContext.getRequestContext().getCurrentExtensibilityModel().addUnboundContent();
    			ModelWriter out = ThreadLocalRequestContext.getRequestContext().getCurrentExtensibilityModel().getWriter();
            	FileCopyUtils.copy(new InputStreamReader(is,"ISO-8859-1"), out);
        	}
        }
        catch (SocketException e1)
        {
            // the client cut the connection - our mission was accomplished apart from a little error message
            if (LOGGER.isInfoEnabled())
            	LOGGER.info("Client aborted stream read:\n\tcontent: " + e1.getMessage());
        } catch (IOException e) {
			throw new WebScriptException(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.getMessage());
		}
	}

	public void responseCMISContent(WebScriptRequest req, WebScriptResponse res, InputStream is, String mimeType, String attachFileName){
		try{
	        res.setContentType(mimeType);
	        //TODO res.setContentEncoding(reader.getEncoding());
	        res.setHeader("Content-Length", Long.toString(is.available()));

	        // set caching
	        Cache cache = new Cache();
	        cache.setNeverCache(false);
	        cache.setMustRevalidate(true);
	        cache.setMaxAge(0L);
	        cache.setLastModified(new Date());
	        cache.setETag( String.valueOf(new Date()));
	        res.setCache(cache);

	        String headerValue = "attachment";
	        if (attachFileName != null && attachFileName.length() > 0)
	        {
	            if (LOGGER.isDebugEnabled())
	            	LOGGER.debug("Attaching content using filename: " + attachFileName);

	            headerValue += "; filename=\"" + attachFileName+"\"";
	        }

	        // set header based on filename - will force a Save As from the browse if it doesn't recognize it
	        // this is better than the default response of the browser trying to display the contents
	        res.setHeader("Content-Disposition", headerValue);

	        // get the content and stream directly to the response output stream
	        // assuming the repository is capable of streaming in chunks, this should allow large files
	        // to be streamed directly to the browser response stream.
	        responseCMISContent(req, res, is, is.available());
		} catch (IOException e) {
			throw new WebScriptException(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.getMessage());
		}
	}

	public void responseCMISContent(WebScriptRequest req, WebScriptResponse res, String nodeRef){
		try{
			HttpSession session = ServletUtil.getSession(false);
			Session cmisSession = cmisService.getCurrentCMISSession(session);

			Document document = (Document) cmisSession.getObject(nodeRef);
			if (nodeRef.indexOf(";") == -1)
				document = document.getObjectOfLatestVersion(false);
			// set mimetype for the content and the character encoding + length for the stream
	        res.setContentType(document.getContentStreamMimeType());
	        //TODO res.setContentEncoding(reader.getEncoding());
	        res.setHeader("Content-Length", Long.toString(document.getContentStreamLength()));

	        // set caching
	        Cache cache = new Cache();
	        cache.setNeverCache(false);
	        cache.setMustRevalidate(true);
	        cache.setMaxAge(0L);
	        cache.setLastModified(document.getLastModificationDate().getTime());
	        cache.setETag( String.valueOf(document.getLastModificationDate().getTime()));
	        res.setCache(cache);
	        String attachFileName = document.getContentStreamFileName();

	        String headerValue = "attachment";
            if (attachFileName != null && attachFileName.length() > 0)
            {
                if (LOGGER.isDebugEnabled())
                	LOGGER.debug("Attaching content using filename: " + attachFileName);

                headerValue += "; filename=\"" + attachFileName+"\"";
            }

            // set header based on filename - will force a Save As from the browse if it doesn't recognize it
            // this is better than the default response of the browser trying to display the contents
            res.setHeader("Content-Disposition", headerValue);

	        // get the content and stream directly to the response output stream
	        // assuming the repository is capable of streaming in chunks, this should allow large files
	        // to be streamed directly to the browser response stream.
	        responseCMISContent(req, res, document.getContentStream().getStream(), document.getContentStreamLength());
	        if (Boolean.valueOf(req.getParameter("deleteAfterDownload")))
	        	document.delete();
		}catch(CmisRuntimeException _ex){
			throw new WebScriptException(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, _ex.getMessage());
		}
	}

}
