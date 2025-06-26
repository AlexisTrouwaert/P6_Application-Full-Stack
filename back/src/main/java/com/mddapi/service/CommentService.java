package com.mddapi.service;

import com.mddapi.dto.request.CommentRequestDto;
import com.mddapi.model.Comment;
import com.mddapi.model.Post;
import com.mddapi.model.User;
import com.mddapi.repository.CommentRepository;
import com.mddapi.repository.PostRepository;
import com.mddapi.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class CommentService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;

    public CommentService(
            UserRepository userRepository,
            PostRepository postRepository,
            CommentRepository commentRepository) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
    }

    @Transactional
    public Comment addComment(CommentRequestDto comment, Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = postRepository.findById(comment.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Comment commentP = new Comment();
        commentP.setUser(user);
        commentP.setPost(post);
        commentP.setComment(comment.getContent());

        commentRepository.save(commentP);
        postRepository.incrementCommentCount(post.getId(), 1);
        return commentP;
    }

    @Transactional
    public void deleteComment(Long commentId) {

        postRepository.incrementCommentCount(commentId, -1);
        commentRepository.deleteById(commentId);
    }
}
