package com.mddapi.dto.response;

import com.mddapi.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentResponse {

    private Long id;
    private String content;
    private LocalDateTime createdAt;

    private userInfo author;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class userInfo {
        private Long id;
        private String username;
    }
}
