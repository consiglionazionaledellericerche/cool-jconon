/*
 *    Copyright (C) 2019  Consiglio Nazionale delle Ricerche
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as
 *     published by the Free Software Foundation, either version 3 of the
 *     License, or (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

package it.cnr.si.cool.jconon.util;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class UtilityTest {

    @Test
    public void testOBJEquals1() {
        assertTrue(Utility.OBJEquals(null, null));
    }

    @Test
    public void testOBJEquals2() {
        assertTrue(!Utility.OBJEquals(BigDecimal.valueOf(22), null));
    }

    @Test
    public void testOBJEquals3() {
        assertTrue(!Utility.OBJEquals(null, BigDecimal.valueOf(22)));
    }

    @Test
    public void testOBJEquals4() {
        assertTrue(!Utility.OBJEquals("22", BigDecimal.valueOf(22)));
    }

    @Test
    public void testOBJEquals5() {
        assertTrue(Utility.OBJEquals(BigDecimal.valueOf(22), BigDecimal.valueOf(22)));
    }
}
