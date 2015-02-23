package it.cnr.flows.resource;

import it.cnr.cool.dto.Credentials;
import it.cnr.cool.security.CMISAuthenticatorFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by francesco on 17/02/15.
 */
@Controller
public class LoginResource {

    @Autowired
    private CMISAuthenticatorFactory cmisAuthenticatorFactory;

    private static final Logger LOGGER = LoggerFactory.getLogger(LoginResource.class);


    @RequestMapping(value = "/security/login", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<?> login(@RequestBody Credentials credentials, HttpServletRequest req, HttpServletResponse res)  {


        String username = credentials.getUsername();
        String ticket = cmisAuthenticatorFactory.authenticate(req,
                username, credentials.getPassword());

        if (ticket == null) {
            LOGGER.warn("access denied to " + username);
            return new ResponseEntity<String>("access denied to user " + username, HttpStatus.UNAUTHORIZED);

        }

        Map<String, String> r = new HashMap<>();
        r.put("ticket", ticket);
        return new ResponseEntity<>(r, HttpStatus.OK);


    }







}
