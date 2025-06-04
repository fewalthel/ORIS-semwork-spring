package ru.kpfu.orissemwork2.services.impl;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kpfu.orissemwork2.converters.QuestionsConverter;
import ru.kpfu.orissemwork2.dto.QuestionDto;
import ru.kpfu.orissemwork2.dto.QuestionForm;
import ru.kpfu.orissemwork2.exceptions.BadWordsInContentException;
import ru.kpfu.orissemwork2.models.*;
import ru.kpfu.orissemwork2.repository.CategoriesRepository;
import ru.kpfu.orissemwork2.repository.UsersRepository;
import ru.kpfu.orissemwork2.services.CategoriesService;
import ru.kpfu.orissemwork2.services.ProfanityFilterService;
import ru.kpfu.orissemwork2.services.QuestionService;
import ru.kpfu.orissemwork2.repository.QuestionRepository;
import ru.kpfu.orissemwork2.services.RewardService;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class QuestionServiceImpl implements QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private CategoriesService categoriesService;

    @Autowired
    private ProfanityFilterService profanityFilterService;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private CategoriesRepository categoriesRepository;

    @Autowired
    private LoggerServiceImpl loggerService;

    @Autowired
    private QuestionsConverter questionsConverter;

    @Autowired
    private RewardService rewardService;

    @Transactional
    @Override
    public Optional<Reward> add(QuestionForm questionForm, Long userId) {
        try {
            if (questionForm.getTitle() == null || questionForm.getContent() == null || questionForm.getCategory() == null) {
                throw new IllegalArgumentException("Inputs in question form cannot be null");
            }

            if (profanityFilterService.containsProfanity(questionForm.getTitle()) || profanityFilterService.containsProfanity(questionForm.getContent())) {
                throw new BadWordsInContentException("Answer contains profanity content");
            }

            Category category = categoriesService.getByName(questionForm.getCategory())
                    .orElseThrow(() -> new EntityNotFoundException("Category not found: " + questionForm.getCategory()));

            User user = usersRepository.findById(userId)
                    .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));

            Question question = Question.builder()
                    .title(questionForm.getTitle())
                    .content(questionForm.getContent())
                    .category(category)
                    .user(user)
                    .publishedAt(Instant.now())
                    .countViews(0L)
                    .build();

            user.getQuestions()
                    .add(question);
            questionRepository.save(question);
            return rewardService.giveReward(userId, user.getQuestions()
                    .size(), RewardType.QUESTION);
        } catch (Exception e) {
            loggerService.logQuestionErrorToFile(e);
            throw e;
        }
    }

    @Transactional
    @Override
    public void delete(Long questionId, Long userId) {
        try {
            User user = usersRepository.findById(userId)
                    .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));

            Question question = questionRepository.findById(questionId)
                    .orElseThrow(() -> new EntityNotFoundException("Question not found with ID: " + questionId));

            if (userId.equals(question.getUser()
                    .getAccountId()) || user.getRole()
                    .equals(Role.ADMIN)) {

                rewardService.removeReward(user, RewardType.QUESTION);
                user.getQuestions()
                        .remove(question);
                usersRepository.save(user);

            } else {
                throw new AccessDeniedException("User does not have permission to delete this question");
            }
        } catch (Exception e) {
            loggerService.logAnswerErrorToFile(e);
            throw e;
        }
    }

    @Override
    public List<QuestionDto> getAll() {
        try {
            List<Question> questions = questionRepository.findAll();
            return questionsConverter.convert(questions);
        } catch (Exception e) {
            loggerService.logQuestionErrorToFile(e);
            throw e;
        }
    }

    @Override
    public QuestionDto getById(Long id) {
        try {
            Question question = questionRepository.findByQuestionId(id)
                    .orElseThrow(() -> new EntityNotFoundException("Question not found with ID: " + id));
            return questionsConverter.convert(question);
        } catch (Exception e) {
            loggerService.logQuestionErrorToFile(e);
            throw e;
        }
    }

    @Transactional
    @Override
    public List<QuestionDto> getAllByAuthorId(Long userId) {
        try {
            User user = usersRepository.findById(userId)
                    .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));

            List<Question> questions = user.getQuestions();

            return questionsConverter.convert(questions);
        } catch (Exception e) {
            loggerService.logQuestionErrorToFile(e);
            throw e;
        }
    }

    @Override
    public List<QuestionDto> getByCategoryName(String categoryName) {
        try {
            Category category = categoriesRepository.findByName(categoryName)
                    .orElseThrow(() -> new EntityNotFoundException("Category not found: " + categoryName));

            List<Question> questions = questionRepository.findAllByCategory_Name(category.getName());

            return questionsConverter.convert(questions);
        } catch (Exception e) {
            loggerService.logQuestionErrorToFile(e);
            throw e;
        }
    }


    @Override
    public void incrementCountViewsById(Long id) {
        try {
            Question question = questionRepository.findByQuestionId(id)
                    .orElseThrow(() -> new EntityNotFoundException("Question not found with ID: " + id));

            Long newViews = question.getCountViews() + 1;

            question.setCountViews(newViews);

            questionRepository.save(question);
        } catch (Exception e) {
            loggerService.logQuestionErrorToFile(e);
            throw e;
        }
    }
}