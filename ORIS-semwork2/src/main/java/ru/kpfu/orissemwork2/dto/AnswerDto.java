package ru.kpfu.orissemwork2.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnswerDto {
    private Long id;
    private String content;
    private UserDto author;
    private QuestionDto question;
    private Instant publishedAt;
    private Boolean isEdited;
}
