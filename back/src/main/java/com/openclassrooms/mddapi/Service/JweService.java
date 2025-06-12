package com.openclassrooms.mddapi.Service;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.DirectDecrypter;
import com.nimbusds.jose.crypto.DirectEncrypter;
import com.nimbusds.jwt.JWTClaimsSet;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.security.SecureRandom;
import java.text.ParseException;
import java.time.Instant;
import java.util.Base64;
import java.util.Date;
import java.util.Map;

import net.minidev.json.JSONObject;

@Service
public class JweService {

    private final SecretKey secretKey;
    private final long EXPIRATION_TIME_SECONDS = 3600;

    public JweService(SecretKey secretKey) {
        this.secretKey = secretKey;
    }

    public String createJWE(String email) throws JOSEException {
        Instant expirationInstant = Instant.now().plusSeconds(EXPIRATION_TIME_SECONDS);
        Date expirationDate = Date.from(expirationInstant);

        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .subject(email)
                .expirationTime(expirationDate)
                .issueTime(new Date())
                .build();

        Payload payload = new Payload(claimsSet.toJSONObject());

        JWEObject jweObject = new JWEObject(
                new JWEHeader(JWEAlgorithm.DIR, EncryptionMethod.A256GCM),
                payload
        );

        jweObject.encrypt(new DirectEncrypter(secretKey));

        return jweObject.serialize();
    }

    public String decryptJWE(String jweString) throws JOSEException, ParseException {

        JWEObject jweObject = JWEObject.parse(jweString);

        jweObject.decrypt(new DirectDecrypter(secretKey));

        Map<String, Object> jsonPayload = jweObject.getPayload().toJSONObject();

        JWTClaimsSet claimsSet = JWTClaimsSet.parse(jsonPayload);

        String email = claimsSet.getSubject();

        Date expirationTime = claimsSet.getExpirationTime();

        if (expirationTime != null && expirationTime.before(new Date())) {
            throw new JOSEException("JWE token has expired.");
        }

        return email;
    }
}
