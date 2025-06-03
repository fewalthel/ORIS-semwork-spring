package ru.kpfu.orissemwork2.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ru.kpfu.orissemwork2.converters.RewardsConverter;
import ru.kpfu.orissemwork2.dto.QuestionDto;
import ru.kpfu.orissemwork2.dto.QuestionForm;
import ru.kpfu.orissemwork2.dto.RewardDto;
import ru.kpfu.orissemwork2.models.Reward;
import ru.kpfu.orissemwork2.security.details.UserDetailsImpl;
import ru.kpfu.orissemwork2.services.QuestionService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/questions")
public class QuestionsController {

    @Autowired
    private QuestionService questionService;

    @Autowired
    private RewardsConverter rewardsConverter;

    @PostMapping("/delete/{question-id}")
    public ResponseEntity<String> deleteQuestion(@AuthenticationPrincipal UserDetailsImpl userDetails, @PathVariable("question-id") Long questionId) {
        questionService.delete(questionId, userDetails.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Question successfully deleted");
    }

    @PostMapping("/create")
    public ResponseEntity<?> createQuestion(@RequestBody QuestionForm questionForm,
                                            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Optional<Reward> reward = questionService.add(questionForm, userDetails.getId());

        if (reward.isPresent()) {
            RewardDto rewardDto = rewardsConverter.convert(reward.get());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(rewardDto);
        }

        return ResponseEntity.ok(null);
    }


    @GetMapping("/all")
    public List<QuestionDto> getAllQuestions() {
        return questionService.getAll();
    }

    @GetMapping("/byAuthorId/{user-id}")
    public List<QuestionDto> getQuestionsByAuthor(@PathVariable("user-id") Long userId) {
        return questionService.getAllByAuthorId(userId);
    }

    @GetMapping("/byCategory/{category-name}")
    public List<QuestionDto> getQuestionsByCategoryName(@PathVariable("category-name") String category) {
        return questionService.getByCategoryName(category);
    }

    @GetMapping("/byId/{id}")
    public QuestionDto getById(@PathVariable("id") Long id) {
        return questionService.getById(id);
    }

    @PostMapping("/incrementCountViews/{id}")
    public ResponseEntity<?> incrementCountViews(@PathVariable("id") Long id) {
        questionService.incrementCountViewsById(id);
        return ResponseEntity.ok()
                .build();
    }
}