package com.mddapi.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegistrationRequest {

    @NotNull(message = "L'email' ne peut pas être vide")
    @Email(message = "Le format de l'adresse e-mail est invalide si fournie.")
    private String mail;

    @NotNull(message = "Le mot de passe ne peut pas être vide")
    @Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caractères")
    @Pattern(regexp = ".*[0-9].*", message = "Le mot de passe doit contenir au moins un chiffre")
    @Pattern(regexp = ".*[a-z].*", message = "Le mot de passe doit contenir au moins une lettre minuscule")
    @Pattern(regexp = ".*[A-Z].*", message = "Le mot de passe doit contenir au moins une lettre majuscule")
    @Pattern(regexp = ".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?`~].*", message = "Le mot de passe doit contenir au moins un caractère spécial")
    private String password;

    @NotNull(message = "Le nom d'utilisateur ne peut pas être vide")
    @Size(min = 4, message = "Le nom d'utilisateur doit contenir au moins 4 caractères")
    private String username;
}
