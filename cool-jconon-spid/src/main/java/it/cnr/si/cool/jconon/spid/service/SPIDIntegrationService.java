/*
 * Copyright (C) 2019  Consiglio Nazionale delle Ricerche
 *
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

package it.cnr.si.cool.jconon.spid.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sun.org.apache.xerces.internal.parsers.DOMParser;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.security.service.UserService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.service.PageModel;
import it.cnr.cool.service.PageService;
import it.cnr.si.cool.jconon.spid.config.AuthenticationException;
import it.cnr.si.cool.jconon.spid.config.IdpConfiguration;
import it.cnr.si.cool.jconon.spid.model.IdpEntry;
import org.apache.chemistry.opencmis.client.bindings.impl.CmisBindingsHelper;
import org.apache.chemistry.opencmis.commons.impl.UrlBuilder;
import org.apache.commons.httpclient.HttpStatus;
import org.joda.time.DateTime;
import org.opensaml.DefaultBootstrap;
import org.opensaml.common.SAMLException;
import org.opensaml.common.SAMLVersion;
import org.opensaml.saml2.core.*;
import org.opensaml.saml2.core.impl.*;
import org.opensaml.saml2.core.validator.ResponseSchemaValidator;
import org.opensaml.saml2.metadata.EntityDescriptor;
import org.opensaml.saml2.metadata.IDPSSODescriptor;
import org.opensaml.saml2.metadata.KeyDescriptor;
import org.opensaml.saml2.metadata.provider.AbstractReloadingMetadataProvider;
import org.opensaml.saml2.metadata.provider.MetadataProviderException;
import org.opensaml.saml2.metadata.provider.ResourceBackedMetadataProvider;
import org.opensaml.util.resource.ResourceException;
import org.opensaml.xml.Configuration;
import org.opensaml.xml.ConfigurationException;
import org.opensaml.xml.XMLObjectBuilderFactory;
import org.opensaml.xml.io.Marshaller;
import org.opensaml.xml.io.MarshallingException;
import org.opensaml.xml.io.UnmarshallingException;
import org.opensaml.xml.parse.BasicParserPool;
import org.opensaml.xml.schema.XSAny;
import org.opensaml.xml.schema.XSString;
import org.opensaml.xml.security.SecurityConfiguration;
import org.opensaml.xml.security.SecurityException;
import org.opensaml.xml.security.SecurityHelper;
import org.opensaml.xml.security.credential.Credential;
import org.opensaml.xml.security.keyinfo.KeyInfoHelper;
import org.opensaml.xml.security.x509.BasicX509Credential;
import org.opensaml.xml.security.x509.X509Credential;
import org.opensaml.xml.signature.Signature;
import org.opensaml.xml.signature.SignatureException;
import org.opensaml.xml.signature.Signer;
import org.opensaml.xml.signature.*;
import org.opensaml.xml.util.Base64;
import org.opensaml.xml.util.XMLHelper;
import org.opensaml.xml.validation.ValidationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.core.env.Environment;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.w3c.dom.Element;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import javax.inject.Inject;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringReader;
import java.io.StringWriter;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.security.cert.CertificateException;
import java.text.Normalizer;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class SPIDIntegrationService implements InitializingBean {
    private static final Logger LOGGER = LoggerFactory.getLogger(SPIDIntegrationService.class);

    private static final String SAML2_PROTOCOL = "urn:oasis:names:tc:SAML:2.0:protocol";
    private static final String SAML2_NAME_ID_ISSUER = "urn:oasis:names:tc:SAML:2.0:nameid-format:entity";
    private static final String SAML2_NAME_ID_POLICY = "urn:oasis:names:tc:SAML:2.0:nameid-format:transient";
    private static final String SAML2_PASSWORD_PROTECTED_TRANSPORT = "urn:oasis:names:tc:SAML:2.0:ac:classes:SpidL1";

    private static final String SAML2_ASSERTION = "urn:oasis:names:tc:SAML:2.0:assertion";
    private static final String SAML2_POST_BINDING = "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST";

    @Autowired
    private PageService pageService;
    @Autowired
    private IdpConfiguration idpConfiguration;

    @Autowired
    private UserService userService;

    @Autowired
    private CMISService cmisService;
    @Autowired
    private ApplicationContext appContext;

    @Inject
    private Environment env;

    private List<Credential> credentials;

    @Override
    public void afterPropertiesSet() throws Exception {
        try {
            DefaultBootstrap.bootstrap();
        } catch (ConfigurationException e) {
            LOGGER.error("SPIDIntegrationService SAML Bootstrap ERROR :: {}", e.getMessage(), e);
            throw new RuntimeException(e);
        }
        pageService.registerPageModels("login", new PageModel() {
            @Override
            public Map<String, Object> addToModel(Map<String, String[]> paramz) {
                return Stream.of(
                        new AbstractMap.SimpleEntry<>("idp", idpConfiguration
                                .getSpidProperties()
                                .getIdp()
                                .entrySet()
                                .stream()
                                .filter(stringIdpEntryEntry ->
                                        Arrays.asList(env.getActiveProfiles())
                                                .contains(stringIdpEntryEntry.getValue().getProfile())
                                ).collect(Collectors.toMap(o -> o.getKey(), o -> o.getValue()))
                        ),
                        new AbstractMap.SimpleEntry<>("spidEnable",
                                idpConfiguration.getSpidProperties().getEnable() ||
                                        Arrays.asList(paramz.getOrDefault("spidEnable", new String[]{"false"}))
                                                .stream().findFirst().map(s -> Boolean.valueOf(s)).orElse(Boolean.FALSE)
                        ))
                        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
            }
        });
        pageService.registerPageModels("spid-idp", new PageModel() {
            @Override
            public Map<String, Object> addToModel(Map<String, String[]> paramz) {
                final IdpEntry idpEntry = Optional.ofNullable(paramz)
                        .flatMap(stringMap -> Optional.ofNullable(stringMap.get("key")))
                        .flatMap(strings -> Arrays.asList(strings).stream().findAny())
                        .flatMap(s -> Optional.ofNullable(idpConfiguration.getSpidProperties().getIdp().get(s)))
                        .orElseThrow(() -> new RuntimeException());
                LOGGER.info("Find idpEntry {}", idpEntry);
                return Stream.of(
                        new AbstractMap.SimpleEntry<>("spidURL", idpEntry.getPostURL()),
                        new AbstractMap.SimpleEntry<>("RelayState",
                                Base64.encodeBytes(
                                        idpConfiguration.getSpidProperties().getIssuer().getEntityId()
                                                .concat(
                                                        Optional.ofNullable(env.getProperty("server.servlet.context-path"))
                                                            .map(s -> s.concat("/spid/send-response"))
                                                            .orElse("")
                                                )
                                                .getBytes(StandardCharsets.UTF_8)
                                )
                        ),
                        new AbstractMap.SimpleEntry<>("SAMLRequest", getSAMLRequest(idpEntry)))
                        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
            }
        });
        credentials = idpConfiguration.getSpidProperties()
                .getIdp()
                .values()
                .stream()
                .map(idpEntry -> {
                    X509Certificate certificate = null;
                    try {
                        final Resource resource = appContext.getResource(idpEntry.getFile());
                        IDPSSODescriptor idp = getIDPSSODescriptor(idpEntry.getEntityId(), resource);
                        for (KeyDescriptor keyDescriptor : idp.getKeyDescriptors()) {
                            KeyInfo keyInfo = keyDescriptor.getKeyInfo();
                            certificate = Optional.ofNullable(keyInfo)
                                    .map(KeyInfo::getX509Datas)
                                    .orElse(Collections.emptyList())
                                    .stream()
                                    .map(X509Data::getX509Certificates)
                                    .flatMap(List::stream)
                                    .findFirst()
                                    .orElse(null);
                        }
                    } catch (MetadataProviderException e) {
                        LOGGER.error("Cannot find IdP Metadata {}", idpEntry.getFile(), e);
                    }
                    return certificate;
                })
                .map(x509Certificate -> {
                    try {
                        return getCredential(x509Certificate);
                    } catch (CertificateException e) {
                        LOGGER.error("CertificateException IdP Metadata {}", e);
                        return null;
                    }
                })
                .collect(Collectors.toList());
    }


    /**
     * @param entityId
     * @param resource
     * @return
     * @throws MetadataProviderException
     */
    private IDPSSODescriptor getIDPSSODescriptor(String entityId, Resource resource) throws MetadataProviderException {
        EntityDescriptor entityDescriptor = getEntityDescriptor(entityId, resource);
        IDPSSODescriptor idpssoDescriptor = entityDescriptor.getIDPSSODescriptor(SAML2_PROTOCOL);
        return idpssoDescriptor;
    }

    /**
     * @param entityId
     * @param resource
     * @return
     * @throws MetadataProviderException
     */
    private EntityDescriptor getEntityDescriptor(String entityId, Resource resource) throws MetadataProviderException {
        AbstractReloadingMetadataProvider abstractReloadingMetadataProvider =
                new ResourceBackedMetadataProvider(new Timer(), new org.opensaml.util.resource.Resource() {
                    @Override
                    public String getLocation() {
                        return resource.getFilename();
                    }

                    @Override
                    public boolean exists() throws ResourceException {
                        return resource.exists();
                    }

                    @Override
                    public InputStream getInputStream() throws ResourceException {
                        try {
                            return resource.getInputStream();
                        } catch (IOException e) {
                            throw new ResourceException(e);
                        }
                    }

                    @Override
                    public DateTime getLastModifiedTime() throws ResourceException {
                        try {
                            return new DateTime(resource.lastModified());
                        } catch (IOException e) {
                            throw new ResourceException(e);
                        }
                    }
                });
        BasicParserPool parser = new BasicParserPool();
        parser.setNamespaceAware(true);
        abstractReloadingMetadataProvider.setParserPool(parser);
        abstractReloadingMetadataProvider.initialize();
        EntityDescriptor entityDescriptor = abstractReloadingMetadataProvider.getEntityDescriptor(entityId);
        return entityDescriptor;
    }

    private String getSAMLRequest(IdpEntry idpEntry) {
        AuthnRequest authnRequest = buildAuthenticationRequest(idpEntry.getEntityId());
        String requestMessage = printAuthnRequest(authnRequest);
        LOGGER.info("SAML Request::{}", requestMessage);
        return Base64.encodeBytes(requestMessage.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Print AuthnRequest.
     *
     * @param authnRequest
     * @return
     * @throws MarshallingException
     */
    public String printAuthnRequest(AuthnRequest authnRequest) {

        Marshaller marshaller = Configuration.getMarshallerFactory().getMarshaller(authnRequest); // object to DOM converter
        Element authDOM;
        try {
            authDOM = marshaller.marshall(authnRequest);
            Signer.signObject(authnRequest.getSignature());
        } catch (MarshallingException | SignatureException e) {
            LOGGER.error("printAuthnRequest :: {}", e.getMessage(), e);
            throw new RuntimeException(e);
        }
        // converting to a DOM
        StringWriter requestWriter = new StringWriter();
        requestWriter = new StringWriter();
        XMLHelper.writeNode(authDOM, requestWriter);
        String authnRequestString = requestWriter.toString(); // DOM to string
        return authnRequestString;
    }

    private AuthnRequest buildAuthenticationRequest(String entityID) {
        AuthnRequestBuilder authRequestBuilder = new AuthnRequestBuilder();

        AuthnRequest authRequest = authRequestBuilder.buildObject(SAML2_PROTOCOL, "AuthnRequest", "samlp");
        authRequest.setIsPassive((Boolean) null);
        authRequest.setIssueInstant(new DateTime());
        authRequest.setProtocolBinding(SAML2_POST_BINDING);
        authRequest.setAssertionConsumerServiceIndex(idpConfiguration.getSpidProperties().getAssertionConsumerServiceIndex());
        authRequest.setIssuer(buildIssuer(
                idpConfiguration.getSpidProperties().getIssuer().getEntityId(),
                idpConfiguration.getSpidProperties().getIssuer().getName()
        ));
        authRequest.setNameIDPolicy(buildNameIDPolicy());
        authRequest.setRequestedAuthnContext(buildRequestedAuthnContext());
        authRequest.setID(UUID.randomUUID().toString());
        authRequest.setVersion(SAMLVersion.VERSION_20);

        authRequest.setAttributeConsumingServiceIndex(idpConfiguration.getSpidProperties().getAttributeConsumingServiceIndex());
        authRequest.setDestination(entityID);

        // firma la request
        authRequest.setSignature(getSignature());
        return authRequest;
    }

    /**
     * @return
     */
    public Signature getSignature() {
        XMLObjectBuilderFactory builderFactory = Configuration.getBuilderFactory();
        Signature signature = (Signature) builderFactory.getBuilder(Signature.DEFAULT_ELEMENT_NAME).buildObject(Signature.DEFAULT_ELEMENT_NAME);
        final X509Credential credential = getCredential();
        signature.setSigningCredential(credential);
        signature.setSignatureAlgorithm(SignatureConstants.ALGO_ID_SIGNATURE_RSA_SHA256);
        signature.setCanonicalizationAlgorithm(SignatureConstants.ALGO_ID_C14N_EXCL_OMIT_COMMENTS);
        try {
            // This is also the default if a null SecurityConfiguration is specified
            SecurityConfiguration secConfig = Configuration
                    .getGlobalSecurityConfiguration();
            SecurityHelper.prepareSignatureParams(signature,
                    credential, secConfig, null);
        } catch (SecurityException | IllegalArgumentException e) {
            LOGGER.error("buildAuthenticationRequest :: {}", e.getMessage(), e);
        }
        return signature;
    }

    private Credential getCredential(X509Certificate certificate) throws CertificateException {
        final java.security.cert.X509Certificate cert = KeyInfoHelper.getCertificate(certificate);
        BasicX509Credential credential = new BasicX509Credential();
        credential.setEntityCertificate(cert);
        credential.setPublicKey(cert.getPublicKey());
        credential.setCRLs(Collections.emptyList());
        return credential;
    }

    private X509Credential getCredential() {
        KeyStore ks = getKeyStore();
        // Get Private Key Entry From Certificate
        KeyStore.PrivateKeyEntry pkEntry = null;
        try {
            pkEntry = (KeyStore.PrivateKeyEntry) ks.getEntry(
                    idpConfiguration.getSpidProperties().getKeystore().getAlias(),
                    new KeyStore.PasswordProtection(idpConfiguration.getSpidProperties().getKeystore().getPassword().toCharArray())
            );
        } catch (NoSuchAlgorithmException e) {
            LOGGER.error("Failed to Get Private Entry From the keystore", e);
        } catch (UnrecoverableEntryException e) {
            LOGGER.error("Failed to Get Private Entry From the keystore", e);
        } catch (KeyStoreException e) {
            LOGGER.error("Failed to Get Private Entry From the keystore", e);
        }
        PrivateKey pk = pkEntry.getPrivateKey();

        java.security.cert.X509Certificate certificate = (java.security.cert.X509Certificate) pkEntry.getCertificate();
        BasicX509Credential credential = new BasicX509Credential();
        credential.setEntityCertificate(certificate);
        credential.setPrivateKey(pk);

        LOGGER.info("Private Key {}", Optional.ofNullable(pk)
                .map(PrivateKey::getEncoded)
                .map(bytes -> Base64.encodeBytes(bytes))
                .orElse(""));

        return credential;
    }

    public KeyStore getKeyStore() {
        KeyStore ks = null;
        char[] password = idpConfiguration.getSpidProperties().getKeystore().getPassword().toCharArray();

        // Get Default Instance of KeyStore
        try {
            ks = KeyStore.getInstance(KeyStore.getDefaultType());
        } catch (KeyStoreException e) {
            LOGGER.error("Error while Intializing Keystore", e);
        }
        final Resource resource = appContext.getResource(idpConfiguration.getSpidProperties().getKeystore().getPath());
        // Load KeyStore from input stream
        try (InputStream keystoreInputStream = resource.getInputStream()) {
            ks.load(keystoreInputStream, password);
        } catch (NoSuchAlgorithmException | CertificateException | IOException e) {
            LOGGER.error("Failed to Load the KeyStore:: ", e);
        }
        return ks;
    }

    /**
     * Costruisce lo issuer object
     *
     * @return Issuer object
     */
    private Issuer buildIssuer(String issuerId, String name) {
        IssuerBuilder issuerBuilder = new IssuerBuilder();
        Issuer issuer = issuerBuilder.buildObject();
        issuer.setNameQualifier(issuerId);
        issuer.setFormat(SAML2_NAME_ID_ISSUER);
        issuer.setValue(name);
        return issuer;
    }

    /**
     * Costruisce il NameIDPolicy object
     *
     * @return NameIDPolicy object
     */
    private NameIDPolicy buildNameIDPolicy() {
        NameIDPolicy nameIDPolicy = new NameIDPolicyBuilder().buildObject();
        nameIDPolicy.setFormat(SAML2_NAME_ID_POLICY);
        return nameIDPolicy;
    }


    private RequestedAuthnContext buildRequestedAuthnContext() {

        // Create AuthnContextClassRef
        AuthnContextClassRefBuilder authnContextClassRefBuilder = new AuthnContextClassRefBuilder();
        AuthnContextClassRef authnContextClassRef = authnContextClassRefBuilder.buildObject(SAML2_ASSERTION, "AuthnContextClassRef", "saml");
        authnContextClassRef.setAuthnContextClassRef(SAML2_PASSWORD_PROTECTED_TRANSPORT);

        // Create RequestedAuthnContext
        RequestedAuthnContextBuilder requestedAuthnContextBuilder = new RequestedAuthnContextBuilder();
        RequestedAuthnContext requestedAuthnContext = requestedAuthnContextBuilder.buildObject();
        requestedAuthnContext.setComparison(AuthnContextComparisonTypeEnumeration.EXACT);
        requestedAuthnContext.getAuthnContextClassRefs().add(authnContextClassRef);

        return requestedAuthnContext;
    }

    /**
     * Decodes and validates an SAML response returned by an identity provider.
     *
     * @param encodedResponse the encoded response returned by the identity provider.
     * @return An {@link Response} object containing information decoded from the SAML response.
     * @throws SAMLException if the signature is invalid, or if any other error occurs.
     */
    public Response decodeAndValidateSamlResponse(String encodedResponse) throws SAMLException, AuthenticationException {
        String decodedResponse;
        decodedResponse = new String(Base64.decode(encodedResponse), StandardCharsets.UTF_8);

        LOGGER.trace("Validating SAML response: " + decodedResponse);

        Response response;
        try {
            DOMParser parser = new DOMParser();
            parser.parse(new InputSource(new StringReader(decodedResponse)));
            response =
                    (Response)
                            Configuration.getUnmarshallerFactory()
                                    .getUnmarshaller(parser.getDocument().getDocumentElement())
                                    .unmarshall(parser.getDocument().getDocumentElement());
        } catch (IOException | SAXException | UnmarshallingException ex) {
            throw new SAMLException("Cannot decode xml encoded response", ex);
        }

        validateResponse(response);
        validateAssertion(response);
        validateSignature(response);

        return response;
    }

    private void validateSignature(Response response) throws SAMLException {
        if (!validateResponseSignature(response) && !validateAssertionSignature(response)) {
            throw new SAMLException("No signature is present in either response or assertion");
        }
    }

    private boolean validateResponseSignature(Response response) throws SAMLException {
        Signature signature = response.getSignature();
        return validate(signature);
    }

    private boolean validateAssertionSignature(Response response) throws SAMLException {
        // We assume that there is only one assertion in the response
        Assertion assertion = response.getAssertions().get(0);
        return validate(assertion.getSignature());
    }

    private boolean validate(Signature signature) {
        if (signature == null) {
            return false;
        }
        // It's fine if any of the credentials match the signature
        return credentials
                .stream()
                .anyMatch(
                        c -> {
                            try {
                                SignatureValidator signatureValidator = new SignatureValidator(c);
                                signatureValidator.validate(signature);
                                return true;
                            } catch (ValidationException ex) {
                                return false;
                            }
                        });
    }

    private void validateResponse(Response response) throws SAMLException, AuthenticationException {
        try {
            new ResponseSchemaValidator().validate(response);
        } catch (ValidationException ex) {
            throw new SAMLException("The response schema validation failed", ex);
        }

        String statusCode = response.getStatus().getStatusCode().getValue();

        if (!statusCode.equals("urn:oasis:names:tc:SAML:2.0:status:Success")) {
            throw new AuthenticationException("Invalid status code: " + statusCode);
        }

    }

    private void validateAssertion(Response response) throws SAMLException {
        if (response.getAssertions().size() != 1) {
            throw new SAMLException("The response doesn't contain exactly 1 assertion");
        }

        Assertion assertion = response.getAssertions().get(0);

        if (assertion.getSubject().getNameID() == null) {
            throw new SAMLException(
                    "The NameID value is missing from the SAML response; this is likely an IDP configuration issue");
        }

        enforceConditions(assertion.getConditions());
    }

    private void enforceConditions(Conditions conditions) throws SAMLException {
        DateTime now = DateTime.now();

        if (now.isBefore(conditions.getNotBefore())) {
            throw new SAMLException(
                    "The assertion cannot be used before " + conditions.getNotBefore().toString());
        }

        if (now.isAfter(conditions.getNotOnOrAfter())) {
            throw new SAMLException(
                    "The assertion cannot be used after  " + conditions.getNotOnOrAfter().toString());
        }
    }


    public String idpResponse(String samlResponse) throws SAMLException, AuthenticationException {
        Response response = decodeAndValidateSamlResponse(samlResponse);
        final Map<String, String> collect = response.getAssertions()
                .stream()
                .map(Assertion::getAttributeStatements)
                .flatMap(List<AttributeStatement>::stream)
                .map(AttributeStatement::getAttributes)
                .flatMap(List<Attribute>::stream)
                .collect(HashMap::new, (m, attribute) -> m.put(attribute.getName(), getValue(attribute)), HashMap::putAll);
        CMISUser cmisUser = new CMISUser();
        cmisUser.setFirstName(collect.getOrDefault("name", null));
        cmisUser.setLastName(collect.getOrDefault("familyName", null));
        cmisUser.setDataDiNascita(Optional.ofNullable(collect.getOrDefault("dateOfBirth", null))
                .filter(s -> !s.isEmpty())
                .map(date -> Date.from(
                        LocalDate.parse(date, DateTimeFormatter.ofPattern("yyyy-MM-dd")).atStartOfDay().atZone(ZoneId.systemDefault()).toInstant()))
                .orElse(null));
        cmisUser.setCodicefiscale(
                Optional.ofNullable(collect.getOrDefault("fiscalNumber", null))
                        .map(cf -> cf.replaceAll("TINIT-", ""))
                        .orElse(null)
        );
        cmisUser.setSesso(collect.getOrDefault("gender", null));
        cmisUser.setEmail(collect.getOrDefault("email", null));
        final Optional<CMISUser> userByCodiceFiscale =
                Optional.ofNullable(userService.findUserByCodiceFiscale(cmisUser.getCodicefiscale(), cmisService.getAdminSession()));
        if (userByCodiceFiscale.isPresent()) {
            return createTicketForUser(userByCodiceFiscale.get());
        } else {
            String userName = normalize(cmisUser.getFirstName())
                    .toLowerCase()
                    .concat("-")
                    .concat(normalize(cmisUser.getLastName())
                            .toLowerCase());
            if (!userService.isUserExists(userName)) {
                cmisUser.setUserName(userName);
            } else {
                for (int i = 1; i < 20; i++) {
                    final String concatUsername = userName.concat("0").concat(String.valueOf(i));
                    if (!userService.isUserExists(concatUsername)) {
                        cmisUser.setUserName(concatUsername);
                        break;
                    }
                }
            }
            final CMISUser user = userService.createUser(cmisUser);
            userService.enableAccount(user.getUserName());
            return createTicketForUser(user);
        }
    }

    private String createTicketForUser(CMISUser cmisUser) {
        try {
            String link = cmisService.getBaseURL().concat("service/cnr/jconon/get-ticket/").concat(cmisUser.getId());
            UrlBuilder urlBuilder = new UrlBuilder(link);
            org.apache.chemistry.opencmis.client.bindings.spi.http.Response response =
                    CmisBindingsHelper.getHttpInvoker(cmisService.getAdminSession()).invokeGET(urlBuilder, cmisService.getAdminSession());
            ObjectMapper objectMapper = new ObjectMapper();
            if (response.getResponseCode() == HttpStatus.SC_OK) {
                @SuppressWarnings("unchecked")
                Map<String, String> readValue = objectMapper.readValue(response.getStream(), Map.class);
                return readValue.get("ticket");
            }
        } catch (IOException _ex) {
            LOGGER.error("Cannot create ticket for user {}", cmisUser.getId(), _ex);
        }
        return null;
    }

    private String getValue(Attribute attribute) {
        final Optional<String> stringValue = attribute.getAttributeValues()
                .stream()
                .filter(XSString.class::isInstance)
                .map(XSString.class::cast)
                .map(xsString -> Optional.ofNullable(xsString.getValue()).orElse(""))
                .filter(s -> !s.isEmpty())
                .findFirst();
        final Optional<String> anyValue = attribute.getAttributeValues()
                .stream()
                .filter(XSAny.class::isInstance)
                .map(XSAny.class::cast)
                .map(xsAny -> Optional.ofNullable(xsAny.getTextContent()).orElse(""))
                .filter(s -> !s.isEmpty())
                .findFirst();

        return stringValue.orElse(anyValue.orElse(null));
    }

    private String normalize(String src) {
        return Normalizer
                .normalize(src, Normalizer.Form.NFD)
                .replaceAll("[^\\p{ASCII}]", "")
                .replaceAll("\\W", "");
    }

}
