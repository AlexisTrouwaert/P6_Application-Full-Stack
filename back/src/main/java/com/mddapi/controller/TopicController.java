package com.mddapi.controller;

import com.mddapi.dto.response.TopicResponseDto;
import com.mddapi.model.Subscribe;
import com.mddapi.model.Topic;
import com.mddapi.model.User;
import com.mddapi.repository.SubscribeRepository;
import com.mddapi.repository.TopicRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/topic")
public class TopicController {

    private final TopicRepository topicRepository;
    private final SubscribeRepository subscribeRepository;

    public TopicController(
            TopicRepository topicRepository,
            SubscribeRepository subscribeRepository
    ) {
        this.topicRepository = topicRepository;
        this.subscribeRepository = subscribeRepository;
    }

    @GetMapping()
    public ResponseEntity<List<TopicResponseDto>> getAllTopics(
            @AuthenticationPrincipal User currentUser
    ) {
        List<Topic> topics = topicRepository.findAll();

        List<Subscribe> userSubscriptions = subscribeRepository.findByUser(currentUser);

        Set<Long> subscribedTopicIds = userSubscriptions.stream()
                .map(subscribe -> subscribe.getTopic().getId())
                .collect(Collectors.toSet());

        List<TopicResponseDto> response = topics.stream()
                .map(topic -> {
                    boolean isSubscribed = subscribedTopicIds.contains(topic.getId());

                    return new TopicResponseDto(
                            topic.getId(),
                            topic.getTopic(),
                            topic.getDescription(),
                            topic.getArticleCount(),
                            isSubscribed
                    );
                })
                .collect(Collectors.toList());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/subscribed")
    public ResponseEntity<List<TopicResponseDto>> getTopicByUserId(
            @AuthenticationPrincipal User currentUser
    ) {
        List<Subscribe> userSubscriptions = subscribeRepository.findByUser(currentUser);

        List<TopicResponseDto> response = userSubscriptions.stream()
                .map(subscribe -> {
                    Topic topic = subscribe.getTopic();

                    return new TopicResponseDto(
                            topic.getId(),
                            topic.getTopic(),
                            topic.getDescription(),
                            topic.getArticleCount(),
                            true
                    );
                })
                .collect(Collectors.toList());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
