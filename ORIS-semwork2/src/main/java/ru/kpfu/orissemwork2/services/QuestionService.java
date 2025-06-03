package ru.kpfu.orissemwork2.services;

import ru.kpfu.orissemwork2.dto.QuestionDto;
import ru.kpfu.orissemwork2.dto.QuestionForm;
import ru.kpfu.orissemwork2.models.Reward;

import java.util.List;
import java.util.Optional;

public interface QuestionService {
    List<QuestionDto> getAll();

    Optional<Reward> add(QuestionForm questionForm, Long id);

    void delete(Long questionId, Long userId);

    QuestionDto getById(Long id);

    List<QuestionDto> getAllByAuthorId(Long userId);

    List<QuestionDto> getByCategoryName(String category);

    void incrementCountViewsById(Long id);
}
