package com.mddapi.mapper;

import com.mddapi.dto.response.CommentResponse;
import com.mddapi.model.Comment;
import com.mddapi.model.User;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class CommentMapper {

    public CommentResponse toDto(Comment comment) {
        if (comment == null) {
            return null;
        }

        CommentResponse dto = new CommentResponse();
        dto.setId(comment.getId());
        dto.setContent(comment.getComment());
        dto.setCreatedAt(comment.getCreatedAt());

        User authorEntity = comment.getUser();
        if (authorEntity != null) {
            CommentResponse.userInfo authorInfo = new CommentResponse.userInfo();
            authorInfo.setId(authorEntity.getId());
            authorInfo.setUsername(authorEntity.getUsername());
            dto.setAuthor(authorInfo);
        }

        return dto;
    }

    public List<CommentResponse> toDtoList(List<Comment> comments) {
        if (comments == null) {
            return null;
        }
        return comments.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}
