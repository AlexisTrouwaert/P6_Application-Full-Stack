package com.mddapi.service;

import com.mddapi.dto.request.AuthenticationRequest;
import com.mddapi.dto.request.RegistrationRequest;
import com.mddapi.model.User;
import com.mddapi.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            BCryptPasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
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
        Optional<User> userOptional = userRepository.findByMail(request.getMail());
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                return user;
            }
        }
        return null;
    }
}
