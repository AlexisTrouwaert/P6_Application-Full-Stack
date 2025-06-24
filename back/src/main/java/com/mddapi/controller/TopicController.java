package com.mddapi.controller;

import com.mddapi.model.Topic;
import com.mddapi.repository.TopicRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/topic")
public class TopicController {

    private final TopicRepository topicRepository;

    public TopicController(
            TopicRepository topicRepository
    ) {
        this.topicRepository = topicRepository;
    }

    @GetMapping()
    public ResponseEntity<List<Topic>> getAllTopics() {
        List<Topic> topics = topicRepository.findAll();

        return new ResponseEntity<>(topics, HttpStatus.OK);

    }
}
