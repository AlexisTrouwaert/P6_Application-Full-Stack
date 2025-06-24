package com.mddapi.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostResponse {
    private Long id;
    private String title;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long commentCount;

    private userInfo user;

    private TopicInfo topic;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class userInfo{
        private Long id;
        private String username;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TopicInfo{
        private Long id;
        private String topic;
    }
}
