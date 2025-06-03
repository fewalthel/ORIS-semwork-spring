package ru.kpfu.orissemwork2.converters;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;
import ru.kpfu.orissemwork2.dto.AnswerDto;
import ru.kpfu.orissemwork2.dto.UserDto;
import ru.kpfu.orissemwork2.models.Answer;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class AnswersConverter implements Converter<Answer, AnswerDto> {
    @Autowired
    private QuestionsConverter questionsConverter;

    @Autowired
    private UsersConverter usersConverter;

    @Override
    public AnswerDto convert(Answer answer) {
        return AnswerDto.builder()
                .id(answer.getAnswerId())
                .content(answer.getContent())
                .author(usersConverter.convert(answer.getUser()))
                .question(questionsConverter.convert(answer.getQuestion()))
                .publishedAt(answer.getPublishedAt())
                .isEdited(answer.getIsEdited())
                .build();
    }

    public List<AnswerDto> convert(List<Answer> answers) {
        return answers.stream()
                .map(this::convert)
                .collect(Collectors.toList());
    }
}
