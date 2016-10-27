package it.cnr.jconon.service;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

import java.util.Calendar;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.jconon.repository.ProtocolRepository;
import it.cnr.jconon.service.call.CallService;

import org.apache.chemistry.opencmis.commons.exceptions.CmisVersioningException;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.MethodSorters;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:/META-INF/cool-jconon-test-context.xml"})
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class ProtocolloServiceTest {
    @Autowired
    private ProtocolRepository protocolRepository;

    @Autowired
    private CallService callService;

    @Autowired
	private CMISService cmisService;
    
	@Test
	public void test1(){
		String anno = String.valueOf(Calendar.getInstance().get(Calendar.YEAR));
		String registro = ProtocolRepository.ProtocolRegistry.CON.name();
		Long numProtocollo = null;
		try {
			numProtocollo = protocolRepository.getNumProtocollo(registro, anno);
		} catch (Exception e) {
			assertNull(e);
		}
		assertNotNull(numProtocollo);
		try {
			protocolRepository.getNumProtocollo(registro, anno);
		} catch (Exception _ex ) {
			assertEquals(_ex.getCause().getClass(), CmisVersioningException.class);
		}		
		try {
			protocolRepository.putNumProtocollo(registro, anno, (long)2);
		} catch (Exception e) {
			assertNull(e);
		}		
	}	
}