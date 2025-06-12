package com.openclassrooms.mddapi.Service;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

@Configuration
public class JweKeyGen {

    @Bean
    public static SecretKey generateAESKey() throws Exception {
        String keyString = "vT7wz!A2xP8dR9sK1mJ6fG0bQ4cY5uL3";
        byte[] keyBytes = keyString.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length != 32) {
            throw new IllegalArgumentException("La clé doit être de 32 octets, trouvé : " + keyBytes.length);
        }
        return new SecretKeySpec(keyBytes, "AES");
    }

}
