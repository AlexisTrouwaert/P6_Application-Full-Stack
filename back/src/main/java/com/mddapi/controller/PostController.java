package com.mddapi.controller;

import com.mddapi.dto.request.SendPostRequest;
import com.mddapi.dto.response.PostResponse;
import com.mddapi.mapper.PostMapper;
import com.mddapi.model.Post;
import com.mddapi.model.Topic;
import com.mddapi.model.User;
import com.mddapi.repository.PostRepository;
import com.mddapi.repository.TopicRepository;
import com.mddapi.service.PostService;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/post")
public class PostController {
    private final PostService postService;
    private final PostRepository postRepository;
    private final PostMapper postMapper;
    private final TopicRepository topicRepository;

    public PostController(
            PostService postService,
            PostRepository postRepository,
            PostMapper postMapper,
            TopicRepository topicRepository
            ) {
        this.postService = postService;
        this.postRepository = postRepository;
        this.postMapper = postMapper;
        this.topicRepository = topicRepository;
    }

    @Transactional
    @PostMapping()
    ResponseEntity<?> sendPost(
            @RequestBody SendPostRequest request,
            @AuthenticationPrincipal User currentUser
    ) {

        Post post = postService.createPost(request, currentUser.getId());

        return ResponseEntity.status(HttpStatus.CREATED).body(post);
    }

    @GetMapping()
    ResponseEntity<Page<PostResponse>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "newest") String sortOrder
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<PostResponse> posts = postService.getAllPosts(pageable, sortOrder);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/{id}")
    ResponseEntity<PostResponse> getPostById(@PathVariable Long id) {
        Optional<Post> response = postRepository.findById(id);
        if (response.isPresent()) {
            Post post = response.get();
            PostResponse postResponseDto = postMapper.toDto(post);

            return ResponseEntity.ok(postResponseDto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @Transactional
    @DeleteMapping("/{id}")
    ResponseEntity<?> deletePostById(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser
    ) {
        try {
            postService.deletePost(id, currentUser.getId());
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
}
