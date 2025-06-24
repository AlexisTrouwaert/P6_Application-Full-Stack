package com.mddapi.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

@Entity
@Data
@Table(name = "user")
@AllArgsConstructor
@NoArgsConstructor
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "username", nullable = false)
    private String username;

    @Column(name = "mail", nullable = false)
    private String mail;

    @Column(name = "password", nullable = false)
    @NotNull(message = "Le mot de passe doit contenir au moins 8 caractères")
    @Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caractères")
    @Pattern(regexp = ".*[0-9].*", message = "Le mot de passe doit contenir au moins un chiffre")
    @Pattern(regexp = ".*[a-z].*", message = "Le mot de passe doit contenir au moins une lettre minuscule")
    @Pattern(regexp = ".*[A-Z].*", message = "Le mot de passe doit contenir au moins une lettre majuscule")
    @Pattern(regexp = ".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?`~].*", message = "Le mot de passe doit contenir au moins un caractère spécial")
    private String password;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
    }
}
