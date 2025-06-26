package com.mddapi.service;

import com.mddapi.dto.request.AuthenticationRequest;
import com.mddapi.dto.request.RegistrationRequest;
import com.mddapi.model.User;
import com.mddapi.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final Logger logger = LoggerFactory.getLogger(UserService.class);

    public UserService(
            UserRepository userRepository,
            BCryptPasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    public User register(RegistrationRequest request) {

        if(userRepository.existsByMail(request.getMail())){
            throw new RuntimeException("Mail already exists");
        }

        if(userRepository.existsByUsername(request.getUsername())){
            throw new RuntimeException("Username already exists");
        }

        User user = new User();
        user.setMail(request.getMail());
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);

        return user;
    }

    public User authenticateUser(AuthenticationRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getIdentifier(), request.getPassword()));
            return (User) authentication.getPrincipal();

        } catch (BadCredentialsException e) {
            logger.warn("Échec de l'authentification pour l'identifiant {}: Mauvaises identifiants.", request.getIdentifier());
            return null;
        } catch (Exception e) {
            logger.error("Échec inattendu lors de l'authentification pour l'identifiant {}: {}", request.getIdentifier(), e.getMessage(), e);
            throw new RuntimeException("Échec inattendu de l'authentification.");
        }
    }
}
