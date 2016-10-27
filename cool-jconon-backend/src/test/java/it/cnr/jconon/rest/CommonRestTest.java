package it.cnr.jconon.rest;

import it.cnr.cool.security.service.impl.alfresco.CMISGroup;
import org.junit.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;

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