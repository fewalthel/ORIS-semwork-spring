package ru.kpfu.orissemwork2.services.impl;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kpfu.orissemwork2.converters.AnswersConverter;
import ru.kpfu.orissemwork2.dto.AnswerDto;
import ru.kpfu.orissemwork2.dto.AnswerForm;
import ru.kpfu.orissemwork2.exceptions.BadWordsInContentException;
import ru.kpfu.orissemwork2.models.*;
import ru.kpfu.orissemwork2.repository.AnswerRepository;
import ru.kpfu.orissemwork2.repository.QuestionRepository;
import ru.kpfu.orissemwork2.repository.UsersRepository;
import ru.kpfu.orissemwork2.services.AnswerService;
import ru.kpfu.orissemwork2.services.LoggerService;
import ru.kpfu.orissemwork2.services.ProfanityFilterService;
import ru.kpfu.orissemwork2.services.RewardService;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class AnswerServiceImpl implements AnswerService {
    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private ProfanityFilterService profanityFilterService;

    @Autowired
    private AnswersConverter answerConverter;

    @Autowired
    private LoggerService loggerService;

    @Autowired
    private RewardService rewardService;

    @Override
    public List<AnswerDto> getAllForQuestion(Long questionId) {
        try {
            List<Answer> answers = answerRepository.findAllByQuestionId(questionId);
            return answerConverter.convert(answers);
        } catch (Exception e) {
            loggerService.logAnswerErrorToFile(e);
            throw e;
        }
    }

    @Transactional
    @Override
    public Optional<Reward> add(AnswerForm answerForm, Long userId) {
        try {
            if (profanityFilterService.containsProfanity(answerForm.getContent())) {
                throw new BadWordsInContentException("Answer contains profanity content");
            }

            if (answerForm.getContent() == null) {
                throw new IllegalArgumentException("Inputs in answer form cannot be null");
            }

            Question question = questionRepository.findByQuestionId(answerForm.getQuestionId())
                    .orElseThrow(() -> new EntityNotFoundException("Question not found with ID: " + answerForm.getQuestionId()));

            User user = usersRepository.findById(userId)
                    .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));

            Answer answer = Answer.builder()
                    .content(answerForm.getContent())
                    .question(question)
                    .user(user)
                    .publishedAt(Instant.now())
                    .build();

            user.getAnswers().add(answer);
            answerRepository.save(answer);
            return rewardService.giveReward(userId, user.getAnswers().size(), RewardType.ANSWER);
        } catch (Exception e) {
            loggerService.logAnswerErrorToFile(e);
            throw e;
        }
    }

    @Transactional
    @Override
    public void delete(Long answerId, Long userId) {
        try {
            User user = usersRepository.findById(userId)
                    .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));

            Answer answer = answerRepository.findById(answerId)
                    .orElseThrow(() -> new EntityNotFoundException("Answer not found with ID: " + answerId));

            if (userId.equals(answer.getUser().getAccountId())
                    || user.getRole().equals(Role.ADMIN)) {

                rewardService.removeReward(user, RewardType.ANSWER);
                user.getAnswers().remove(answer);
                usersRepository.save(user);

            } else {
                throw new AccessDeniedException("User does not have permission to delete this answer");
            }
        } catch (Exception e) {
            loggerService.logAnswerErrorToFile(e);
            throw e;
        }
    }

    @Override
    public List<AnswerDto> getFavoritesForUser(Long userId) {
        try {

            User user = usersRepository.findById(userId)
                    .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));
            List<Answer> answers = user.getFavoritesAnswers();
            return answerConverter.convert(answers);
        } catch (Exception e) {
            loggerService.logAnswerErrorToFile(e);
            throw e;
        }
    }

    @Transactional
    @Override
    public void addToFavorites(Long answerId, Long userId) {
        try {
            User user = usersRepository.findById(userId)
                    .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));

            Answer answer = answerRepository.findById(answerId)
                    .orElseThrow(() -> new EntityNotFoundException("Answer not found with ID: " + answerId));

            Hibernate.initialize(user.getFavoritesAnswers());

            if (user.getFavoritesAnswers()
                    .contains(answer)) {
                throw new EntityExistsException("Answer already in favorites");
            }
            user.getFavoritesAnswers()
                    .add(answer);
            usersRepository.save(user);
        } catch (Exception e) {
            loggerService.logAnswerErrorToFile(e);
            throw e;
        }
    }

    @Transactional
    @Override
    public void deleteFromFavorites(Long answerId, Long userId) {
        try {
            User user = usersRepository.findById(userId)
                    .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));

            Answer answer = answerRepository.findById(answerId)
                    .orElseThrow(() -> new EntityNotFoundException("Answer not found with ID: " + answerId));

            Hibernate.initialize(user.getFavoritesAnswers());

            if (!user.getFavoritesAnswers()
                    .contains(answer)) {
                throw new EntityNotFoundException("Answer not in user's favorites");
            }
            user.getFavoritesAnswers()
                    .remove(answer);
            usersRepository.save(user);
        } catch (Exception e) {
            loggerService.logAnswerErrorToFile(e);
            throw e;
        }
    }

    @Override
    public AnswerDto getById(Long answerId) {
        try {
            Answer answer = answerRepository.findById(answerId)
                    .orElseThrow(() -> new EntityNotFoundException("Answer not found with ID: " + answerId));
            return answerConverter.convert(answer);
        } catch (Exception e) {
            loggerService.logAnswerErrorToFile(e);
            throw e;
        }
    }

    @Transactional
    @Override
    public void editAnswer(Long answerId, AnswerForm form, Long userId) {
        try {
            User user = usersRepository.findById(userId)
                    .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));

            Answer answer = answerRepository.findById(answerId)
                    .orElseThrow(() -> new EntityNotFoundException("Answer not found with ID: " + answerId));

            if (user.getRole()
                    .equals(Role.ADMIN) || answer.getUser()
                    .getAccountId() == userId) {

                answer.setContent(form.getContent());
                answer.setIsEdited(true);
                answerRepository.save(answer);
            } else {
                throw new AccessDeniedException("Edit answer cat only this author or admin");
            }
        } catch (Exception e) {
            loggerService.logAnswerErrorToFile(e);
            throw e;
        }
    }
}