package com.mddapi.mapper;

import com.mddapi.dto.response.CommentResponse;
import com.mddapi.model.Comment;
import org.springframework.stereotype.Component;

@Component
public class CommentMapper {

    public CommentResponse toDto(Comment comment) {
        CommentResponse.userInfo userInfo = new CommentResponse.userInfo();
    }
}
