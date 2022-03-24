package it.cnr.si.cool.jconon.model;

import org.springframework.security.core.Authentication;

public interface AuthenticationProvider {
    boolean isCNRUser(Authentication authentication);
}
