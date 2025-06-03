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
public class QuestionDto {
    Long id;
    String title;
    String content;
    CategoryDto category;
    UserDto author;
    Instant publishedAt;
    Long countViews;
}
