package it.cnr.si.cool.jconon.util;

import org.junit.Test;

import java.math.BigDecimal;

import static org.junit.Assert.assertTrue;

public class UtilityTest {

    @Test
    public void testOBJEquals1() {
        assertTrue(Utility.OBJEquals(null,null));
    }

    @Test
    public void testOBJEquals2() {
        assertTrue(!Utility.OBJEquals(BigDecimal.valueOf(22),null));
    }

    @Test
    public void testOBJEquals3() {
        assertTrue(!Utility.OBJEquals(null,BigDecimal.valueOf(22)));
    }

    @Test
    public void testOBJEquals4() {
        assertTrue(!Utility.OBJEquals("22",BigDecimal.valueOf(22)));
    }

    @Test
    public void testOBJEquals5() {
        assertTrue(Utility.OBJEquals(BigDecimal.valueOf(22),BigDecimal.valueOf(22)));
    }
}
