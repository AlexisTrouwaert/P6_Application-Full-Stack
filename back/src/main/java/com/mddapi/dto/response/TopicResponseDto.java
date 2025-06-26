package com.mddapi.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TopicResponseDto {

    private Long id;
    private String topic;
    private String description;
    private int articleCount;
    private boolean isSubscribed;
}
