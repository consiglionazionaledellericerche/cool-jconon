package it.cnr.si.cool.jconon.service;

import it.cnr.cool.service.NodeService;
import it.cnr.si.cool.jconon.cmis.model.JCONONDocumentType;
import it.cnr.si.cool.jconon.cmis.model.JCONONPropertyIds;
import it.cnr.si.cool.jconon.service.call.CallService;
import org.apache.chemistry.opencmis.client.api.CmisObject;
import org.apache.chemistry.opencmis.client.api.Document;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.GregorianCalendar;
import java.util.Optional;

@Service
@Primary
public class JCONONNodeService extends NodeService {
    @Autowired
    private CallService callService;
    @Override
    protected CmisObject upgradeDocument(MultipartFile mFileDocumento, Document doc) {
        final CmisObject cmisObject = super.upgradeDocument(mFileDocumento, doc);
        /**
         * Sto inserendo un provvedimento di graduatoria sul Bando
         */
        if (doc.getDocumentType().getId().equalsIgnoreCase(JCONONDocumentType.JCONON_ATTACHMENT_CALL_CLASSIFICATION.value())) {
            final Optional<Folder> call = doc.getParents()
                    .stream()
                    .findAny();
            if (call.isPresent()) {
                callService.aggiornaProtocolloGraduatoria(
                        call.get(),
                        doc.<String>getPropertyValue(JCONONPropertyIds.PROTOCOLLO_NUMERO.value()),
                        doc.<GregorianCalendar>getPropertyValue(JCONONPropertyIds.PROTOCOLLO_DATA.value())
                );
                call.get().updateProperties(
                        Collections.singletonMap(JCONONPropertyIds.CALL_GRADUATORIA.value(), Boolean.TRUE)
                );
            }
        } else if (doc.getDocumentType().getId().equalsIgnoreCase(JCONONDocumentType.JCONON_ATTACHMENT_CALL_RECRUITMENT_PROVISION.value())) {
            final Optional<Folder> call = doc.getParents()
                    .stream()
                    .findAny();
            if (call.isPresent()) {
                callService.aggiornaProtocolloScorrimento(
                        call.get(),
                        doc.<String>getPropertyValue(JCONONPropertyIds.PROTOCOLLO_NUMERO.value()),
                        doc.<GregorianCalendar>getPropertyValue(JCONONPropertyIds.PROTOCOLLO_DATA.value())
                );
            }
        }
        return cmisObject;
    }
}
