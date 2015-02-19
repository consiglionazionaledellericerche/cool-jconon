package it.cnr.flows.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Created by francesco on 19/02/15.
 */
public class Utils {

    private static final Logger LOGGER = LoggerFactory.getLogger(Utils.class);

    public static boolean isPublicUrl (String url) {

        String [] publicUrls = {
                "/rest/static",
                "/rest/security/login",
                "/rest/proxy"
        };

        LOGGER.info(url);

        boolean allowed = false;

        for (String publicUrl : publicUrls) {
            //TODO: controllare url correttamente
            if (url.indexOf(publicUrl) > 0) {
                allowed = true;
            }
        }

        return allowed;

    }


}
