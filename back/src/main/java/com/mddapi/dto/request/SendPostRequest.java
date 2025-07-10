package com.mddapi.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SendPostRequest {
    private String title;

    @Size(max = 5000, message = "Un post ne peux contenir que 5000 caractéres")
    @Size(min = 10, message = "Un poit doit contenir au moins 10 caratéres")
    private String content;
    private Long authorId;
    private Long topicId;
}
