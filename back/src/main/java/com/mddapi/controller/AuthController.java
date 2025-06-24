package com.mddapi.controller;

import com.mddapi.dto.request.AuthenticationRequest;
import com.mddapi.dto.request.RegistrationRequest;
import com.mddapi.model.User;
import com.mddapi.repository.UserRepository;
import com.mddapi.service.JweService;
import com.mddapi.service.UserService;
import com.nimbusds.jose.JOSEException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.time.Duration;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final UserService userService;
    private final UserRepository userRepository;
    private JweService jweService;

    public AuthController(
            JweService jweService,
            UserService userService, UserRepository userRepository) {
        this.jweService = jweService;
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegistrationRequest request, HttpServletResponse response) {

        try {
            User user = userService.register(request);
            String token = null;

            try {
                token = jweService.createJWE(request.getMail());
                logger.info("JWE token successfully created for user: {}", request.getUsername());
            } catch (JOSEException e) {
                logger.error("Failed to create JWE token for user {}. Error: {}", request.getUsername(), e.getMessage(), e);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("{\"message\": \"An error occurred while generating authentication token.\"}");
            }

            ResponseCookie cookie = ResponseCookie.from("access_token", token)
                    .httpOnly(true)
                    .secure(false)
                    .path("/")
                    .sameSite("Lax")
                    .maxAge(Duration.ofHours(1))
                    .build();

            response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (RuntimeException e) {
            logger.error("User registration failed for user {}. Error: {}", request.getUsername(), e.getMessage(), e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"message\": \"An unexpected error occurred during registration.\"}");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody AuthenticationRequest request, HttpServletResponse response) {

        try{
            User user = userService.authenticateUser(request);
            if(user == null) {
                return new ResponseEntity<>(Map.of("message", "Email ou mot de passe incorrect"), HttpStatus.UNAUTHORIZED);
            }

            String token = null;
            try {
                token = jweService.createJWE(request.getMail());
                logger.info("JWE token successfully created for user: {}", user.getUsername());
            } catch (Exception e) {
                logger.error("Failed to create JWE token for user {}. Error: {}", request.getMail(), e.getMessage(), e);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("{\"message\": \"An error occurred while generating authentication token.\"}");
            }

            ResponseCookie cookie = ResponseCookie.from("access_token", token)
                    .httpOnly(true)
                    .secure(false)
                    .path("/")
                    .sameSite("Lax")
                    .maxAge(Duration.ofHours(1))
                    .build();

            response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());
            return ResponseEntity.ok().body(user);
        } catch (RuntimeException e) {
            logger.error("User login failed for email {}. Error: {}", request.getMail(), e.getMessage(), e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR) // 500 Internal Server Error
                    .body("{\"message\": \"An unexpected error occurred during login.\"}");
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(
            @AuthenticationPrincipal User authenticatedUser
    ) {
        return ResponseEntity.ok().body(authenticatedUser);
    }

    @GetMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("access_token", null);
        cookie.setPath("/");
        cookie.setHttpOnly(false);
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        return ResponseEntity.ok().build();
    }
}
