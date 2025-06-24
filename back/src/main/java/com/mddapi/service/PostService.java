package com.mddapi.service;

import com.mddapi.dto.request.SendPostRequest;
import com.mddapi.dto.response.PostResponse;
import com.mddapi.mapper.PostMapper;
import com.mddapi.model.Post;
import com.mddapi.model.Topic;
import com.mddapi.model.User;
import com.mddapi.repository.PostRepository;
import com.mddapi.repository.TopicRepository;
import com.mddapi.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final TopicRepository topicRepository;
    private final PostMapper postMapper;

    public PostService(
            PostRepository postRepository,
            UserRepository userRepository,
            TopicRepository topicRepository,
            PostMapper postMapper
    ) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.topicRepository = topicRepository;
        this.postMapper = postMapper;
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

    public Page<PostResponse> getAllPosts(Pageable pageable) {
        Pageable soartedPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        Page<Post> posts = postRepository.findAll(soartedPageable);

        return posts.map(
                postMapper::toDto
        );
    }

}
