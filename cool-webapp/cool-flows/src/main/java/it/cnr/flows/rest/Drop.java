package it.cnr.flows.rest;

import it.cnr.flows.exception.DropException;
import it.cnr.flows.service.DropService;
import org.glassfish.jersey.media.multipart.FormDataBodyPart;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.InputStream;
import java.util.Map;

@Path("drop")
@Component
@Produces(MediaType.APPLICATION_JSON)
public class Drop {

    private static final Logger LOGGER = LoggerFactory.getLogger(Drop.class);

    private static final String DEFAULT_FILE_NAME = "foo";

    @Autowired
    private DropService dropService;

	@POST
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public Response post(@FormDataParam("type") String type,
			@FormDataParam("id") String id,
            @FormDataParam("username") String username,
            @FormDataParam("document-id") String documentId,
			@FormDataParam("file") InputStream uploadedInputStream,
			@FormDataParam("file") FormDataContentDisposition fileDetail,
			@FormDataParam("file") FormDataBodyPart p,
			@Context HttpServletRequest request) {

        String mimetype = getMimetype(p);

        String fileName = getFileName(fileDetail);

        try {
            Map<String, String> m = dropService.dropFile(type, id, username, documentId, uploadedInputStream, mimetype, fileName, request);
            return Response.ok(m).build();
        } catch (DropException e) {
            throw new InternalServerErrorException(e);
        }

    }


    private static String getMimetype (FormDataBodyPart p) {

        String mimetype;
        if (p != null) {
            mimetype = p.getMediaType().toString();
        } else {
            mimetype = MediaType.TEXT_PLAIN_TYPE.toString();
        }
        LOGGER.debug("mimetype: " + mimetype);
        return mimetype;
    }

    private static String getFileName(FormDataContentDisposition fileDetail) {

        String filename;

        if (fileDetail != null) {
            LOGGER.info(fileDetail.toString());
            filename = fileDetail.getFileName();
        } else {
            LOGGER.debug("unable to detect file name, using default: "
                    + DEFAULT_FILE_NAME);
            filename = DEFAULT_FILE_NAME;
        }

        return filename;
    }



}
