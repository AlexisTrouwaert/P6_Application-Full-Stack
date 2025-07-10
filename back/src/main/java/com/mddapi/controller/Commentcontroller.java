package com.mddapi.controller;

import com.mddapi.dto.request.CommentRequestDto;
import com.mddapi.dto.request.SendPostRequest;
import com.mddapi.dto.response.CommentResponse;
import com.mddapi.mapper.CommentMapper;
import com.mddapi.model.Comment;
import com.mddapi.model.User;
import com.mddapi.repository.CommentRepository;
import com.mddapi.repository.PostRepository;
import com.mddapi.service.CommentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/comment")
public class Commentcontroller {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final CommentService commentService;
    private final CommentMapper commentMapper;

    public Commentcontroller(
            CommentRepository commentRepository,
            PostRepository postRepository,
            CommentService commentService,
            CommentMapper commentMapper
    ) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.commentService = commentService;
        this.commentMapper = commentMapper;
    }

    @PostMapping()
    public ResponseEntity<?> postComment(
            @RequestBody CommentRequestDto request,
            @AuthenticationPrincipal User currentUser
    ) {
        Comment comment = commentService.addComment(request, currentUser.getId());

        return ResponseEntity.status(HttpStatus.CREATED).body(comment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser
    ) {
        Optional<Comment> comment = commentRepository.findById(id);

        if (comment.isPresent()) {
            Comment commentToDelete = comment.get();
            if(commentToDelete.getUser().equals(currentUser)) {
                commentService.deleteComment(id);
                return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<List<CommentResponse>> getComment(
            @PathVariable("id") Long postId,
            @AuthenticationPrincipal User currentUser
    ) {
        if(currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<Comment> comments = commentRepository.findAllByPostIdOrderByCreatedAtDesc(postId);

        List<CommentResponse> commentResponses = commentMapper.toDtoList(comments);

        return ResponseEntity.ok(commentResponses);
    }
}
