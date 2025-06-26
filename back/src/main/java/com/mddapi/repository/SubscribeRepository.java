package com.mddapi.repository;

import com.mddapi.model.Subscribe;
import com.mddapi.model.Topic;
import com.mddapi.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubscribeRepository  extends JpaRepository<Subscribe, Long> {

    Optional<Subscribe> findByUserAndTopic(User user, Topic topic);

    List<Subscribe> findByUser(User user);
}
