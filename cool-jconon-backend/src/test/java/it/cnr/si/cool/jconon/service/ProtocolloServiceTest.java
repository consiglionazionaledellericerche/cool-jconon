package it.cnr.si.cool.jconon.service;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.si.cool.jconon.repository.ProtocolRepository;
import it.cnr.si.cool.jconon.service.call.CallService;
import org.apache.chemistry.opencmis.commons.exceptions.CmisVersioningException;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Calendar;

import static org.junit.Assert.*;

@RunWith(SpringRunner.class)
@SpringBootTest
public class ProtocolloServiceTest {
    @Autowired
    private ProtocolRepository protocolRepository;

    @Autowired
    private CallService callService;

    @Autowired
	private CMISService cmisService;
    
	@Test
	public void testProtocollo(){
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
			assertEquals(_ex.getClass(), CmisVersioningException.class);
		}		
		try {
			protocolRepository.putNumProtocollo(registro, anno, (long)2);
		} catch (Exception e) {
			assertNull(e);
		}		
	}	
}