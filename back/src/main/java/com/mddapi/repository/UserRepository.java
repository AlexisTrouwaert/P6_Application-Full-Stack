package com.mddapi.repository;

import com.mddapi.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByMail(String mail);
    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);
    boolean existsByMail(String mail);
}
