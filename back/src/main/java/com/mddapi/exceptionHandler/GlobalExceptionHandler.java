package com.mddapi.exceptionHandler;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationErrors(MethodArgumentNotValidException ex) {
        String message = "Les données fournies sont invalides.";
        boolean passwordError = ex.getBindingResult().getFieldErrors().stream()
                .anyMatch(fieldError -> "password".equals(fieldError.getField()));
        if (passwordError) {
            message = "password_missmatch_pattern"; // Ou une clé comme "password_complexity_error"
        }

        return new ResponseEntity<>(Map.of("message", message), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        return new ResponseEntity<>(Map.of("message", ex.getMessage()), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneralException(Exception ex) {
        return new ResponseEntity<>(Map.of("message", "Une erreur inattendue est survenue."), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
