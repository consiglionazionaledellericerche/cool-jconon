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

package it.cnr.si.cool.jconon.service.helpdesk;

import feign.FeignException;
import feign.form.FormData;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.security.service.UserService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.service.I18nService;
import it.cnr.cool.util.StringUtil;
import it.cnr.ict.domain.Category;
import it.cnr.ict.domain.ExternalProblem;
import it.cnr.ict.domain.State;
import it.cnr.ict.domain.User;
import it.cnr.ict.service.OilService;
import it.cnr.si.cool.jconon.exception.HelpDeskNotConfiguredException;
import it.cnr.si.cool.jconon.model.HelpdeskBean;
import org.apache.chemistry.opencmis.client.bindings.impl.CmisBindingsHelper;
import org.apache.chemistry.opencmis.client.bindings.spi.http.Response;
import org.apache.chemistry.opencmis.commons.exceptions.CmisObjectNotFoundException;
import org.apache.chemistry.opencmis.commons.impl.UrlBuilder;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.MailException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

/**
 * Created by cirone on 27/10/2014.
 * Modified by marco.spasiano 25/06/2015
 */
@Service
public class HelpdeskService {
    private static final Logger LOGGER = LoggerFactory
            .getLogger(HelpdeskService.class);

    @Autowired(required = false)
    private Optional<OilService> oilService;

    @Autowired
    private CMISService cmisService;

    @Autowired
    private UserService userService;

    @Autowired
    private I18nService i18nService;

    @Value("${oil.newuser.password}")
    private String newUserPassord;
    @Value("${oil.newuser.profilo}")
    private Long profilo;
    @Value("${oil.newuser.struttura}")
    private String struttura;
    @Value("${oil.newuser.mailStop}")
    private String mailStop;

    public void sendReopenMessage(HelpdeskBean hdBean, CMISUser cmisUser) throws MailException {
        StringBuilder descrizione = new StringBuilder();
        descrizione.append(hdBean.getMessage());
        descrizione.append("\n\n");
        descrizione.append("Data: ");
        DateFormat formatter = new SimpleDateFormat("dd.MM.yyyy (HH:mm:ss)");
        descrizione.append(formatter.format(Calendar.getInstance().getTime()));
        descrizione.append("  IP: ");
        descrizione.append(hdBean.getIp());

        oilService
                .ifPresent(oil -> oil.changeState(Long.valueOf(hdBean.getId()), State.APERTA, descrizione.toString(), "mail"));
    }

    public void post(
            HelpdeskBean hdBean, MultipartFile allegato,
            CMISUser user) throws IOException, MailException, CmisObjectNotFoundException {

        hdBean.setMatricola("0");

        if (user != null && !user.isGuest()
                && user.getFirstName() != null
                && user.getFirstName().equals(hdBean.getFirstName())
                && user.getLastName() != null
                && user.getLastName().equals(hdBean.getLastName())
                && user.getMatricola() != null) {
            hdBean.setMatricola(String.valueOf(user.getMatricola()));
        }
        // eliminazione caratteri problematici
        hdBean.setSubject(cleanText(hdBean.getSubject()));
        hdBean.setFirstName(cleanText(hdBean.getFirstName()));
        hdBean.setLastName(cleanText(hdBean.getLastName()));
        hdBean.setMessage(cleanText(hdBean.getMessage()));
        hdBean.setEmail(hdBean.getEmail().trim());

        Integer category = Integer.valueOf(hdBean.getCategory());
        try {
            if (getEsperti(category).equals("{}")) {
                LOGGER.error("La categoria con id " + category + " (Bando \"" + hdBean.getCall() + "\") NON HA NESSUN ESPERTO!");
            }
            if (category == 1) {
                LOGGER.warn("Il Bando \"" + hdBean.getCall() + "\" NON HA NESSUN ID ASSOCIATO ALLA CATEGORIA " + hdBean.getProblemType() + " !");
            }
        } catch (HelpDeskNotConfiguredException _ex) {
        }

        sendMessage(hdBean, allegato, user);
    }

    protected void sendMessage(HelpdeskBean hdBean, MultipartFile allegato, CMISUser user) throws MailException, IOException {
        StringBuilder subject = new StringBuilder();
        subject.append(hdBean.getCall() + " - " + hdBean.getSubject());

        // aggiunge il footer al messaggio
        StringBuilder testo = new StringBuilder();
        testo.append(hdBean.getMessage());
        testo.append("\n\n");
        testo.append("Utente: ");
        testo.append(hdBean.getFirstName());
        testo.append(" ");
        testo.append(hdBean.getLastName());
        if (Optional.ofNullable(hdBean.getMatricola()).isPresent()) {
            testo.append("  Matricola: ");
            testo.append(hdBean.getMatricola());
        }
        testo.append("  Email: ");
        testo.append(hdBean.getEmail());
        if (Optional.ofNullable(hdBean.getPhoneNumber()).isPresent()) {
            testo.append("  Tel: ");
            testo.append(hdBean.getPhoneNumber());
        }
        testo.append("  Data: ");
        DateFormat formatter = new SimpleDateFormat("dd.MM.yyyy (HH:mm:ss)");
        testo.append(formatter.format(Calendar.getInstance().getTime()));
        testo.append("  IP: ");
        testo.append(hdBean.getIp());

        ExternalProblem externalProblem = new ExternalProblem();
        externalProblem.setFirstName(hdBean.getFirstName());
        externalProblem.setFamilyName(hdBean.getLastName());
        externalProblem.setEmail(hdBean.getEmail());
        externalProblem.setConfirmRequested(Optional.ofNullable(user).filter(cmisUser -> cmisUser.isGuest()).map(s -> "y").orElse("n"));
        externalProblem.setTitolo(subject.toString());
        externalProblem.setDescrizione(testo.toString());
        externalProblem.setStato(State.APERTA);
        externalProblem.setCategoria(Integer.valueOf(hdBean.getCategory()));
        final Optional<Long> idSegnalazione = oilService.map(oil -> oil.newProblem(externalProblem));


        if (allegato != null && !allegato.isEmpty() && idSegnalazione.isPresent()) {
            FormData formData = new FormData(
                    allegato.getContentType(),
                    allegato.getOriginalFilename(),
                    allegato.getBytes()
            );
            oilService.ifPresent(oil -> oil.addAttachments(idSegnalazione.get(), formData));
        }

    }

    private String cleanText(String text) {
        if (text == null)
            return "";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            if (c < 32)
                continue;
            if (c == 224 || c == 225)
                sb.append('a');
            else if (c == 232 || c == 233)
                sb.append('e');
            else if (c == 236 || c == 237)
                sb.append('i');
            else if (c == 242 || c == 243)
                sb.append('o');
            else if (c == 249 || c == 250)
                sb.append('u');
            else if (c < 127)
                sb.append(c);
        }
        return sb.toString();
    }


    public Integer getCategoriaMaster(String callType) {
        String link = cmisService.getBaseURL().concat("service/cnr/jconon/categorie-helpdesk");
        UrlBuilder url = new UrlBuilder(link);
        Response resp = CmisBindingsHelper.getHttpInvoker(cmisService.getAdminSession()).invokeGET(url, cmisService.getAdminSession());
        int status = resp.getResponseCode();
        if (status == HttpStatus.OK.value()) {
            JSONObject jsonObject = new JSONObject(StringUtil.convertStreamToString(resp.getStream()));
            return jsonObject.optInt(callType, 1);
        }
        return 1;
    }

    public Integer createCategoria(Integer idPadre, String nome, String descrizione) {
        Category category = new Category();
        category.setIdPadre(Optional.ofNullable(idPadre).map(Long::valueOf).orElse(new Long(1)));
        category.setNome(nome);
        category.setDescrizione(descrizione);
        return oilService.map(oil -> oil.addCategory(category).intValue()).orElse(null);
    }

    public List<User> getEsperti(Integer idCategoria) {
        try {
            return oilService.map(oil -> oil.getExperts(Long.valueOf(idCategoria))).orElse(Collections.emptyList());
        } catch (FeignException _ex) {
            if (_ex.status() == HttpStatus.NOT_FOUND.value()) {
                return Collections.emptyList();
            }
            throw _ex;
        }
    }

    public boolean existUser(String uid) {
        try {
            return oilService.map(oil -> oil.getUser(uid)).isPresent();
        } catch (FeignException _ex) {
            if (_ex.status() == HttpStatus.NOT_FOUND.value()) {
                return false;
            }
            throw _ex;
        }
    }

    public Object manageEsperto(Integer idCategoria, String idEsperto, boolean delete) {
        inserisciEsperto(idEsperto);
        if (delete) {
            oilService.ifPresent(oil -> oil.removeCategory2User(String.valueOf(idCategoria), idEsperto));
        } else {
            oilService.ifPresent(oil -> oil.assignCategory2User(String.valueOf(idCategoria), idEsperto));
        }
        return null;
    }

    private void inserisciEsperto(String uid) {
        if(!existUser(uid)) {
            CMISUser cmisUser = userService.loadUserForConfirm(uid);
            User user = new User();
            user.setFirstName(cmisUser.getFirstName());
            user.setFamilyName(cmisUser.getLastName());
            user.setLogin(cmisUser.getId());
            user.setEmail(cmisUser.getEmail());
            user.setProfile(profilo);
            user.setPassword(newUserPassord);
            user.setStruttura(struttura);
            user.setMailStop(mailStop);
            try {
                oilService.ifPresent(oil -> oil.addUser(user));
            } catch (FeignException _ex) {
                LOGGER.warn("Create user on OIL error: {}", _ex.getMessage());
            }
        }
    }
}