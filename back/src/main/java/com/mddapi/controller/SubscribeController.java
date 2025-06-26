package com.mddapi.controller;

import com.mddapi.model.Subscribe;
import com.mddapi.model.Topic;
import com.mddapi.model.User;
import com.mddapi.repository.SubscribeRepository;
import com.mddapi.repository.TopicRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/subscribe")
public class SubscribeController {

    private final SubscribeRepository subscribeRepository;
    private final TopicRepository topicRepository;

    public SubscribeController(
            SubscribeRepository subscribeRepository,
            TopicRepository topicRepository
    ) {
        this.subscribeRepository = subscribeRepository;
        this.topicRepository = topicRepository;
    }

    @PostMapping("/{id}")
    public ResponseEntity<?> subscribe(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser
    ) {
        Topic topic = topicRepository.findById(id).orElse(null);
        if (topic == null) {
            return ResponseEntity.notFound().build();
        }
        Optional<Subscribe> subscribe = subscribeRepository.findByUserAndTopic(currentUser, topic);

        if (subscribe.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        } else {
            Subscribe newSubscribe = new Subscribe();
                    newSubscribe.setUser(currentUser);
                    newSubscribe.setTopic(topic);
            subscribeRepository.save(newSubscribe);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> unsubscribe(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser
    ) {
        Topic topic = topicRepository.findById(id).orElse(null);
        if (topic == null) {
            return ResponseEntity.notFound().build();
        }
        Optional<Subscribe> subscribe = subscribeRepository.findByUserAndTopic(currentUser, topic);

        if (subscribe.isPresent()) {
            subscribeRepository.delete(subscribe.get());
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
