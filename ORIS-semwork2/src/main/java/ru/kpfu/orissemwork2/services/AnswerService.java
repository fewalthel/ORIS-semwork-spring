package ru.kpfu.orissemwork2.services;

import ru.kpfu.orissemwork2.dto.AnswerDto;
import ru.kpfu.orissemwork2.dto.AnswerForm;
import ru.kpfu.orissemwork2.models.Reward;

import java.util.List;
import java.util.Optional;

public interface AnswerService {

    List<AnswerDto> getAllForQuestion(Long questionId);

    Optional<Reward> add(AnswerForm answerForm, Long userId);

    void delete(Long answerId, Long userId);

    List<AnswerDto> getFavoritesForUser(Long userId);

    void addToFavorites(Long answerId, Long userId);

    void deleteFromFavorites(Long answerId, Long userId);

    AnswerDto getById(Long answerId);

    void editAnswer(Long answerId, AnswerForm form, Long userId);
}