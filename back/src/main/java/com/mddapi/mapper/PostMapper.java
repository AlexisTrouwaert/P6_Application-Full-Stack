package com.mddapi.mapper;

import com.mddapi.dto.response.PostResponse;
import com.mddapi.model.Post;
import com.mddapi.model.User;
import com.mddapi.repository.UserRepository;
import org.springframework.stereotype.Component;

@Component
public class PostMapper {

    public PostResponse toDto(Post post) {

        PostResponse.userInfo userInfo = new PostResponse.userInfo();
        userInfo.setId(post.getUser().getId());
        userInfo.setUsername(post.getUser().getUsername());

        PostResponse.TopicInfo topicInfo = new PostResponse.TopicInfo();
        topicInfo.setId(post.getTopic().getId());
        topicInfo.setTopic(post.getTopic().getTopic());


        PostResponse dto = new PostResponse();
        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());
        dto.setUser(userInfo);
        dto.setTopic(topicInfo);

        return dto;
    }
}
