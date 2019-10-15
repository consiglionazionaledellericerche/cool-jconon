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

package it.cnr.si.cool.jconon.rest;

import it.cnr.cool.security.service.impl.alfresco.CMISGroup;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class CommonRestTest {

    @Test
    public void testGetMd5Single() throws Exception {
        List<CMISGroup> groups = new ArrayList<>();
        groups.add(new CMISGroup("foo", "bar"));
        String md5 = CommonRest.getMd5(groups);
        assertEquals("acbd18db4cc2f85cedef654fccc4a4d8", md5);
    }

    @Test
    public void testGetMd5Multiple() throws Exception {
        List<CMISGroup> groups = new ArrayList<>();
        groups.add(new CMISGroup("baz", "baz"));
        groups.add(new CMISGroup("foo", "foo"));
        groups.add(new CMISGroup("bar", "bar"));
        String md5 = CommonRest.getMd5(groups);
        assertEquals("f08a3a47141ec5368b0ff672c7e14dee", md5);
    }

    @Test
    public void testGetMd5Empty() throws Exception {
        List<CMISGroup> groups = new ArrayList<>();
        String md5 = CommonRest.getMd5(groups);
        assertEquals("d41d8cd98f00b204e9800998ecf8427e", md5);
    }

    @Test
    public void testGetMd5Null() throws Exception {
        String md5 = CommonRest.getMd5(null);
        assertEquals("", md5);
    }

}