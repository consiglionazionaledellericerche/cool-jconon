package it.cnr.cool.cmis.service;

import javax.xml.bind.JAXBElement;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;

public interface JaxBHelper {

	Marshaller createMarshaller() throws JAXBException;

	<T> JAXBElement<T> unmarshal(javax.xml.transform.Source source,
			Class<T> declaredType, boolean fragment) throws JAXBException;

}
