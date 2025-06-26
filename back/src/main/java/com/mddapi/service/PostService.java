package com.mddapi.service;

import com.mddapi.dto.request.SendPostRequest;
import com.mddapi.dto.response.PostResponse;
import com.mddapi.mapper.PostMapper;
import com.mddapi.model.Comment;
import com.mddapi.model.Post;
import com.mddapi.model.Topic;
import com.mddapi.model.User;
import com.mddapi.repository.CommentRepository;
import com.mddapi.repository.PostRepository;
import com.mddapi.repository.TopicRepository;
import com.mddapi.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final TopicRepository topicRepository;
    private final PostMapper postMapper;
    private final CommentRepository commentRepository;

    public PostService(
            PostRepository postRepository,
            UserRepository userRepository,
            TopicRepository topicRepository,
            PostMapper postMapper,
            CommentRepository commentRepository
    ) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.topicRepository = topicRepository;
        this.postMapper = postMapper;
        this.commentRepository = commentRepository;
    }

    @Transactional
    public Post createPost(SendPostRequest request, Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Topic topic = topicRepository.findById(request.getTopicId())
                .orElseThrow(() -> new RuntimeException("Topic not found"));

        Post post = new Post();
        post.setUser(user);
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setTopic(topic);
        post.setCommentCount(0L);

        postRepository.save(post);
        topicRepository.incrementViewCount(topic.getId(), 1);
        return post;

    }

    public Page<PostResponse> getAllPosts(Pageable pageable, String sortOrder) {

        Sort.Direction direction = Sort.Direction.DESC;

        if ("oldest".equalsIgnoreCase(sortOrder)) {
            direction = Sort.Direction.ASC; // Si 'oldest', tri par plus anciens (ASC)
        }

        Pageable soartedPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(direction, "createdAt")
        );

        Page<Post> posts = postRepository.findAll(soartedPageable);

        return posts.map(
                postMapper::toDto
        );
    }

    @Transactional
    public void deletePost(Long postId, Long userId) throws Exception {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getUser().getId().equals(userId)) {
            throw new Exception("User not authorized to delete this post");
        }

        List<Comment> commentsToDelete = commentRepository.findAllByPostId(postId);

        if (commentsToDelete != null && !commentsToDelete.isEmpty()) {
            commentRepository.deleteAll(commentsToDelete);
        }
        topicRepository.incrementViewCount(post.getId(), -1);
        postRepository.delete(post);
    }
}
