package com.mddapi.controller;

import com.mddapi.dto.request.EditRequest;
import com.mddapi.dto.response.MeResponseDto;
import com.mddapi.model.User;
import com.mddapi.repository.UserRepository;
import com.mddapi.service.JweService;
import com.nimbusds.jose.JOSEException;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
public class ProfilController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JweService jweService;

    public ProfilController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JweService jweService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jweService = jweService;
    }

    @PutMapping
    public ResponseEntity<?> editProfile (
            @Valid @RequestBody EditRequest request,
            @AuthenticationPrincipal User currentUser,
            HttpServletResponse response
    ) {

        Optional<User> OptionalUserToEdit = userRepository.findById(currentUser.getId());

        if(OptionalUserToEdit.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        User userToEdit = OptionalUserToEdit.get();

        if (request.getUsername() != null && !request.getUsername().trim().isEmpty()) {
            if (!request.getUsername().equals(userToEdit.getUsername()) && userRepository.existsByUsername(request.getUsername())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Ce nom d'utilisateur est déjà pris par un autre compte."));
            }
            userToEdit.setUsername(request.getUsername().trim());
        }

        if (request.getMail() != null && !request.getMail().trim().isEmpty()) {
            if (!request.getMail().equals(userToEdit.getMail()) && userRepository.existsByMail(request.getMail())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Cet e-mail est déjà utilisé par un autre compte."));
            }
            userToEdit.setMail(request.getMail().trim());
        }

        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            userToEdit.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        userRepository.save(userToEdit);

        String token = null;

        try {
            String newToken = jweService.createJWE(userToEdit.getMail());

            ResponseCookie cookie = ResponseCookie.from("access_token", newToken)
                    .httpOnly(true)
                    .secure(false)
                    .path("/")
                    .sameSite("Lax")
                    .maxAge(Duration.ofHours(1))
                    .build();

            MeResponseDto responseDto = new MeResponseDto();
            responseDto.setUsername(userToEdit.getUsername());
            responseDto.setId(userToEdit.getId());
            responseDto.setEmail(userToEdit.getMail());

            response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());
            return ResponseEntity.ok().body(responseDto);
        } catch (JOSEException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Une erreur est survenue lors de la mise à jour du jeton d'authentification."));
        }

    }
}
