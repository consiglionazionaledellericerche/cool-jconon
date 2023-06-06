package it.cnr.si.cool.jconon.service.application;

import org.apache.chemistry.opencmis.client.api.Folder;

public interface ApplicationValidateSend {
    void validate(Folder call, Folder application);
}
