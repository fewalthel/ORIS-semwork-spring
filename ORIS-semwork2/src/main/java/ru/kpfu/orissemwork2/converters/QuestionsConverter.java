package ru.kpfu.orissemwork2.converters;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;
import ru.kpfu.orissemwork2.dto.CategoryDto;
import ru.kpfu.orissemwork2.dto.QuestionDto;
import ru.kpfu.orissemwork2.dto.UserDto;
import ru.kpfu.orissemwork2.models.Question;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class QuestionsConverter implements Converter<Question, QuestionDto> {
    @Autowired
    private UsersConverter usersConverter;

    @Autowired
    private CategoryConverter categoryConverter;

    @Override
    public QuestionDto convert(Question question) {
        return QuestionDto.builder()
                .id(question.getQuestionId())
                .title(question.getTitle())
                .content(question.getContent())
                .category(categoryConverter.convert(question.getCategory()))
                .author(usersConverter.convert(question.getUser()))
                .publishedAt(question.getPublishedAt())
                .countViews(question.getCountViews())
                .build();
    }

    public Question convert(QuestionDto questionDto) {
        return Question.builder()
                .questionId(questionDto.getId())
                .title(questionDto.getTitle())
                .content(questionDto.getContent())
                .category(categoryConverter.convert(questionDto.getCategory()))
                .user(usersConverter.convert(questionDto.getAuthor()))
                .publishedAt(questionDto.getPublishedAt())
                .countViews(questionDto.getCountViews())
                .build();
    }

    public List<QuestionDto> convert(List<Question> questions) {
        return questions.stream()
                .map(this::convert)
                .collect(Collectors.toList());
    }
}