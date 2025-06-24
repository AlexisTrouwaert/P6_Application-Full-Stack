package com.mddapi.dto.request;

import lombok.Data;

@Data
public class SendPostRequest {
    private String title;
    private String content;
    private Long authorId;
    private Long topicId;
}
