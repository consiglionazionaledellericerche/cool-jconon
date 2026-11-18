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

package it.cnr.si.cool.jconon.push;

import javax.crypto.Cipher;
import javax.crypto.KeyAgreement;
import javax.crypto.Mac;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.math.BigInteger;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.security.interfaces.ECPrivateKey;
import java.security.interfaces.ECPublicKey;
import java.security.spec.*;
import java.util.Arrays;
import java.util.Base64;

/**
 * Invio di notifiche Web Push senza dipendenze esterne (solo JCE del JDK 8):
 * cifratura del contenuto "aes128gcm" (RFC 8188 / RFC 8291) e autenticazione VAPID con JWT ES256 (RFC 8292).
 */
public class WebPushSender {

    /** Esito dell'invio: le iscrizioni scadute (404/410) vanno rimosse. */
    public enum Result { SENT, EXPIRED, FAILED }

    private static final Base64.Encoder B64URL = Base64.getUrlEncoder().withoutPadding();
    private static final Base64.Decoder B64URL_DECODER = Base64.getUrlDecoder();
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final int RECORD_SIZE = 4096;
    private static final int TIMEOUT_MILLIS = 10000;

    private final ECPublicKey vapidPublicKey;
    private final ECPrivateKey vapidPrivateKey;
    private final String vapidPublicKeyBase64;
    private final String subject;

    /**
     * @param publicKey  chiave pubblica VAPID: punto non compresso P-256 (65 byte) in base64url
     * @param privateKey chiave privata VAPID: scalare di 32 byte in base64url
     * @param subject    contatto dell'applicazione (mailto:... oppure https://...)
     */
    public WebPushSender(String publicKey, String privateKey, String subject) throws GeneralSecurityException {
        this.vapidPublicKey = publicKey(decode(publicKey));
        this.vapidPrivateKey = privateKey(decode(privateKey));
        this.vapidPublicKeyBase64 = publicKey;
        this.subject = subject;
    }

    /** Nuova coppia di chiavi VAPID: [chiave pubblica, chiave privata] in base64url. */
    public static String[] generateVapidKeys() throws GeneralSecurityException {
        final KeyPair keyPair = generateKeyPair();
        final byte[] d = toFixedLength(((ECPrivateKey) keyPair.getPrivate()).getS().toByteArray(), 32);
        return new String[]{B64URL.encodeToString(encodePoint((ECPublicKey) keyPair.getPublic())), B64URL.encodeToString(d)};
    }

    public String getPublicKey() {
        return vapidPublicKeyBase64;
    }

    /**
     * Invia il contenuto (JSON) all'iscrizione del browser.
     *
     * @param endpoint url del servizio push del browser
     * @param p256dh   chiave pubblica dell'iscrizione (base64url)
     * @param auth     segreto di autenticazione dell'iscrizione (base64url)
     * @param ttl      secondi per cui il servizio push conserva il messaggio se il dispositivo non è raggiungibile
     */
    public Result send(String endpoint, String p256dh, String auth, byte[] payload, int ttl) throws IOException, GeneralSecurityException {
        final byte[] body = encrypt(payload, decode(p256dh), decode(auth));
        final HttpURLConnection connection = (HttpURLConnection) new URL(endpoint).openConnection();
        connection.setConnectTimeout(TIMEOUT_MILLIS);
        connection.setReadTimeout(TIMEOUT_MILLIS);
        connection.setRequestMethod("POST");
        connection.setDoOutput(true);
        connection.setRequestProperty("TTL", String.valueOf(ttl));
        connection.setRequestProperty("Urgency", "normal");
        connection.setRequestProperty("Content-Type", "application/octet-stream");
        connection.setRequestProperty("Content-Encoding", "aes128gcm");
        connection.setRequestProperty("Authorization", "vapid t=" + vapidToken(endpoint) + ", k=" + vapidPublicKeyBase64);
        connection.setFixedLengthStreamingMode(body.length);
        try (OutputStream out = connection.getOutputStream()) {
            out.write(body);
        }
        final int status = connection.getResponseCode();
        drain(connection);
        if (status == 404 || status == 410) {
            return Result.EXPIRED;
        }
        return status >= 200 && status < 300 ? Result.SENT : Result.FAILED;
    }

    /* ------------------------------------------------------------------ */
    /* Cifratura del contenuto (RFC 8291)                                    */
    /* ------------------------------------------------------------------ */

    static byte[] encrypt(byte[] payload, byte[] userAgentPublicKey, byte[] authSecret) throws GeneralSecurityException {
        final KeyPair serverKeys = generateKeyPair();
        final byte[] serverPublicKey = encodePoint((ECPublicKey) serverKeys.getPublic());
        final byte[] salt = new byte[16];
        RANDOM.nextBytes(salt);
        return encrypt(payload, userAgentPublicKey, authSecret, serverKeys, serverPublicKey, salt);
    }

    static byte[] encrypt(byte[] payload, byte[] userAgentPublicKey, byte[] authSecret,
                          KeyPair serverKeys, byte[] serverPublicKey, byte[] salt) throws GeneralSecurityException {
        final KeyAgreement agreement = KeyAgreement.getInstance("ECDH");
        agreement.init(serverKeys.getPrivate());
        agreement.doPhase(publicKey(userAgentPublicKey), true);
        final byte[] ecdhSecret = agreement.generateSecret();

        // IKM = HKDF(auth_secret, ecdh_secret, "WebPush: info" || 0x00 || ua_public || as_public, 32)
        final byte[] keyInfo = concat("WebPush: info\0".getBytes(StandardCharsets.US_ASCII), userAgentPublicKey, serverPublicKey);
        final byte[] ikm = hkdf(authSecret, ecdhSecret, keyInfo, 32);
        // CEK e NONCE derivati con il salt casuale del record
        final byte[] cek = hkdf(salt, ikm, "Content-Encoding: aes128gcm\0".getBytes(StandardCharsets.US_ASCII), 16);
        final byte[] nonce = hkdf(salt, ikm, "Content-Encoding: nonce\0".getBytes(StandardCharsets.US_ASCII), 12);

        // unico record: contenuto seguito dal delimitatore 0x02 (ultimo record)
        final Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        cipher.init(Cipher.ENCRYPT_MODE, new SecretKeySpec(cek, "AES"), new GCMParameterSpec(128, nonce));
        final byte[] ciphertext = cipher.doFinal(concat(payload, new byte[]{2}));

        // intestazione: salt (16) || record size (4) || lunghezza keyid (1) || keyid = chiave pubblica del server
        final ByteBuffer header = ByteBuffer.allocate(16 + 4 + 1 + serverPublicKey.length);
        header.put(salt).putInt(RECORD_SIZE).put((byte) serverPublicKey.length).put(serverPublicKey);
        return concat(header.array(), ciphertext);
    }

    private static byte[] hkdf(byte[] salt, byte[] ikm, byte[] info, int length) throws GeneralSecurityException {
        final Mac extract = Mac.getInstance("HmacSHA256");
        extract.init(new SecretKeySpec(salt, "HmacSHA256"));
        final byte[] prk = extract.doFinal(ikm);
        final Mac expand = Mac.getInstance("HmacSHA256");
        expand.init(new SecretKeySpec(prk, "HmacSHA256"));
        // length <= 32: basta il primo blocco T(1) = HMAC(PRK, info || 0x01)
        return Arrays.copyOf(expand.doFinal(concat(info, new byte[]{1})), length);
    }

    /* ------------------------------------------------------------------ */
    /* VAPID (RFC 8292)                                                      */
    /* ------------------------------------------------------------------ */

    String vapidToken(String endpoint) throws GeneralSecurityException {
        final URL url;
        try {
            url = new URL(endpoint);
        } catch (IOException e) {
            throw new GeneralSecurityException("Invalid endpoint " + endpoint, e);
        }
        final String audience = url.getProtocol() + "://" + url.getHost() + (url.getPort() == -1 ? "" : ":" + url.getPort());
        final long expiration = System.currentTimeMillis() / 1000 + 12 * 60 * 60;
        final String header = B64URL.encodeToString("{\"typ\":\"JWT\",\"alg\":\"ES256\"}".getBytes(StandardCharsets.UTF_8));
        final String claims = B64URL.encodeToString(("{\"aud\":\"" + audience + "\",\"exp\":" + expiration +
                ",\"sub\":\"" + subject.replace("\"", "") + "\"}").getBytes(StandardCharsets.UTF_8));
        final Signature signature = Signature.getInstance("SHA256withECDSA");
        signature.initSign(vapidPrivateKey);
        signature.update((header + "." + claims).getBytes(StandardCharsets.US_ASCII));
        return header + "." + claims + "." + B64URL.encodeToString(derToJose(signature.sign()));
    }

    /** Firma ECDSA DER (SEQUENCE di due INTEGER) convertita nel formato JWS: r || s su 32 byte ciascuno. */
    private static byte[] derToJose(byte[] der) {
        int offset = 2;
        if ((der[1] & 0x80) != 0) {
            offset += der[1] & 0x7f;
        }
        final int rLength = der[offset + 1];
        final byte[] r = Arrays.copyOfRange(der, offset + 2, offset + 2 + rLength);
        offset = offset + 2 + rLength;
        final int sLength = der[offset + 1];
        final byte[] s = Arrays.copyOfRange(der, offset + 2, offset + 2 + sLength);
        return concat(toFixedLength(r, 32), toFixedLength(s, 32));
    }

    /* ------------------------------------------------------------------ */
    /* Chiavi P-256                                                          */
    /* ------------------------------------------------------------------ */

    private static ECParameterSpec curve() throws GeneralSecurityException {
        final AlgorithmParameters parameters = AlgorithmParameters.getInstance("EC");
        parameters.init(new ECGenParameterSpec("secp256r1"));
        return parameters.getParameterSpec(ECParameterSpec.class);
    }

    private static KeyPair generateKeyPair() throws GeneralSecurityException {
        final KeyPairGenerator generator = KeyPairGenerator.getInstance("EC");
        generator.initialize(new ECGenParameterSpec("secp256r1"), RANDOM);
        return generator.generateKeyPair();
    }

    private static ECPublicKey publicKey(byte[] uncompressed) throws GeneralSecurityException {
        if (uncompressed.length != 65 || uncompressed[0] != 4) {
            throw new InvalidKeyException("P-256 public key must be an uncompressed point of 65 bytes");
        }
        final ECPoint point = new ECPoint(new BigInteger(1, Arrays.copyOfRange(uncompressed, 1, 33)),
                new BigInteger(1, Arrays.copyOfRange(uncompressed, 33, 65)));
        return (ECPublicKey) KeyFactory.getInstance("EC").generatePublic(new ECPublicKeySpec(point, curve()));
    }

    private static ECPrivateKey privateKey(byte[] d) throws GeneralSecurityException {
        return (ECPrivateKey) KeyFactory.getInstance("EC").generatePrivate(new ECPrivateKeySpec(new BigInteger(1, d), curve()));
    }

    private static byte[] encodePoint(ECPublicKey key) {
        return concat(new byte[]{4},
                toFixedLength(key.getW().getAffineX().toByteArray(), 32),
                toFixedLength(key.getW().getAffineY().toByteArray(), 32));
    }

    /* ------------------------------------------------------------------ */

    private static byte[] toFixedLength(byte[] value, int length) {
        if (value.length == length) {
            return value;
        }
        if (value.length > length) {
            // zeri iniziali (segno dei BigInteger o padding DER)
            return Arrays.copyOfRange(value, value.length - length, value.length);
        }
        final byte[] padded = new byte[length];
        System.arraycopy(value, 0, padded, length - value.length, value.length);
        return padded;
    }

    private static byte[] concat(byte[]... arrays) {
        final ByteArrayOutputStream out = new ByteArrayOutputStream();
        for (byte[] array : arrays) {
            out.write(array, 0, array.length);
        }
        return out.toByteArray();
    }

    private static byte[] decode(String value) {
        return B64URL_DECODER.decode(value.trim().replace('+', '-').replace('/', '_').replace("=", ""));
    }

    private static void drain(HttpURLConnection connection) {
        try {
            final InputStream stream = connection.getResponseCode() >= 400 ? connection.getErrorStream() : connection.getInputStream();
            if (stream != null) {
                final byte[] buffer = new byte[1024];
                while (stream.read(buffer) != -1) {
                    // svuota la risposta per riutilizzare la connessione
                }
                stream.close();
            }
        } catch (IOException ignored) {
            // la risposta non serve
        } finally {
            connection.disconnect();
        }
    }
}
