package it.cnr.si.security;

import it.cnr.si.service.dto.anagrafica.letture.EntitaOrganizzativaWebDto;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public class ACEAuthentication extends UsernamePasswordAuthenticationToken implements Authentication {

    public ACEAuthentication(Object principal, Object credentials, EntitaOrganizzativaWebDto sede) {
        super(principal, credentials);
        this.sede = sede;
    }

    public ACEAuthentication(Object principal, Object credentials, Collection<? extends GrantedAuthority> authorities, EntitaOrganizzativaWebDto sede) {
        super(principal, credentials, authorities);
        this.sede = sede;
    }

    private EntitaOrganizzativaWebDto sede;

    public EntitaOrganizzativaWebDto getSede() {
        return sede;
    }
}
