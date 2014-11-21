package it.cnr.cool.service.impl;


import java.io.OutputStream;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBElement;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;
import javax.xml.stream.XMLStreamWriter;

public final class JaxBHelper implements it.cnr.cool.cmis.service.JaxBHelper {

    public static final JAXBContext CONTEXT;
    static {
        JAXBContext jc = null;
        try {
            jc = JAXBContext.newInstance(
            		org.alfresco.model.dictionary._1.ObjectFactory.class);
        } catch (JAXBException e) {
            e.printStackTrace();
        }
        CONTEXT = jc;
    }
    /**
     * Private constructor.
     */
    private JaxBHelper() {
    }

    /**
     * Creates an Unmarshaller.
     */
    public static Unmarshaller createUnmarshaller() throws JAXBException {
        return CONTEXT.createUnmarshaller();
    }

    /**
     * Creates an Marshaller.
     */
	@Override
	public Marshaller createMarshaller() throws JAXBException {
        return CONTEXT.createMarshaller();
    }

    /**
     * UNMarshals an object to a stream.
     */
	@Override
	public <T> JAXBElement<T> unmarshal(javax.xml.transform.Source source,
			Class<T> declaredType, boolean fragment) throws JAXBException {

        Unmarshaller m = createUnmarshaller();
        if (fragment) {
            m.setProperty(Marshaller.JAXB_FRAGMENT, Boolean.TRUE);
        }

        return m.unmarshal(source, declaredType);
    }
    
    /**
     * Marshals an object to a stream.
     */
    public static <T> void marshal(JAXBElement<T> object, OutputStream out, boolean fragment) throws JAXBException {
        if (object == null) {
            return;
        }

        Marshaller m = CONTEXT.createMarshaller();
        if (fragment) {
            m.setProperty(Marshaller.JAXB_FRAGMENT, Boolean.TRUE);
        }

        m.marshal(object, out);
    }

    /**
     * Marshals an object to a XMLStreamWriter.
     */
    public static void marshal(Object object, XMLStreamWriter out, boolean fragment) throws JAXBException {
        if (object == null) {
            return;
        }

        Marshaller m = CONTEXT.createMarshaller();
        if (fragment) {
            m.setProperty(Marshaller.JAXB_FRAGMENT, Boolean.TRUE);
        }

        m.marshal(object, out);
    }
}
