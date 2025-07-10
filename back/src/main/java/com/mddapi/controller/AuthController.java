package com.mddapi.controller;

import com.mddapi.dto.request.AuthenticationRequest;
import com.mddapi.dto.request.RegistrationRequest;
import com.mddapi.dto.response.MeResponseDto;
import com.mddapi.model.User;
import com.mddapi.repository.UserRepository;
import com.mddapi.service.JweService;
import com.mddapi.service.UserService;
import com.nimbusds.jose.JOSEException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Map;

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
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegistrationRequest request, HttpServletResponse response) {

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

            MeResponseDto responseDto = new MeResponseDto();
            responseDto.setUsername(user.getUsername());
            responseDto.setId(user.getId());
            responseDto.setEmail(user.getMail());

            response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());
            return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
        } catch (RuntimeException e) {
            logger.error("User registration failed for user {}. Error: {}", request.getUsername(), e.getMessage(), e);
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", e.getMessage()));
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
                token = jweService.createJWE(user.getMail());
                logger.info("JWE token successfully created for user: {}", user.getUsername());
            } catch (Exception e) {
                logger.error("Failed to create JWE token for user {}. Error: {}", user.getMail(), e.getMessage(), e);
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

            MeResponseDto responseDto = new MeResponseDto();
            responseDto.setUsername(user.getUsername());
            responseDto.setId(user.getId());
            responseDto.setEmail(user.getMail());

            response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());
            return ResponseEntity.ok().body(responseDto);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<MeResponseDto> me(
            @AuthenticationPrincipal User authenticatedUser
    ) {
        MeResponseDto meResponseDto = new MeResponseDto();
        meResponseDto.setUsername(authenticatedUser.getUsername());
        meResponseDto.setId(authenticatedUser.getId());
        meResponseDto.setEmail(authenticatedUser.getMail());
        return ResponseEntity.ok(meResponseDto);
    }

    @GetMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("access_token", null)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .sameSite("Lax")
                .maxAge(Duration.ofHours(0))
                .build();
        response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.ok().build();
    }
}
