package ru.kpfu.orissemwork2.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ru.kpfu.orissemwork2.converters.RewardsConverter;
import ru.kpfu.orissemwork2.dto.AnswerDto;
import ru.kpfu.orissemwork2.dto.AnswerForm;
import ru.kpfu.orissemwork2.dto.RewardDto;
import ru.kpfu.orissemwork2.security.details.UserDetailsImpl;
import ru.kpfu.orissemwork2.services.AnswerService;
import ru.kpfu.orissemwork2.models.Reward;

import java.util.Optional;
import java.util.List;

@RestController
@RequestMapping("/answers")
public class AnswersController {
    @Autowired
    private AnswerService answerService;

    @Autowired
    private RewardsConverter rewardsConverter;

    @PostMapping("/create")
    public ResponseEntity<?> createAnswer(@RequestBody AnswerForm answerForm, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Optional<Reward> reward = answerService.add(answerForm, userDetails.getId());

        if (reward.isPresent()) {
            RewardDto rewardDto = rewardsConverter.convert(reward.get());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(rewardDto);
        }

        return ResponseEntity.ok(null);
    }


    @GetMapping("/all/{question-id}")
    public List<AnswerDto> getAllForQuestion(@PathVariable("question-id") Long questionId) {
        return answerService.getAllForQuestion(questionId);
    }

    @PostMapping("/delete/{answerId}")
    public ResponseEntity<?> deleteAnswer(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                          @PathVariable("answerId") Long answerId) {
        answerService.delete(answerId, userDetails.getId());
        return ResponseEntity.status(HttpStatus.OK)
                .body("Answer successfully deleted");
    }

    @GetMapping("/favorites/all")
    public List<AnswerDto> getAllFavoritesForUser(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return answerService.getFavoritesForUser(userDetails.getId());
    }

    @PostMapping("/favorites/add/{answer-id}")
    public ResponseEntity<?> addToFavorites(@PathVariable("answer-id") Long answerId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        answerService.addToFavorites(answerId, userDetails.getId());
        return ResponseEntity.status(HttpStatus.OK)
                .body(answerService.getById(answerId));
    }

    @PostMapping("/favorites/delete/{answer-id}")
    public ResponseEntity<?> deleteFromFavorites(@PathVariable("answer-id") Long answerId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        answerService.deleteFromFavorites(answerId, userDetails.getId());
        return ResponseEntity.status(HttpStatus.OK)
                .body("Answer removed from favorites");
    }

    @PostMapping("/{id}/edit")
    public ResponseEntity<?> editAnswer(@PathVariable("id") Long id, @AuthenticationPrincipal UserDetailsImpl userDetails, @RequestBody AnswerForm form) {

        answerService.editAnswer(id, form, userDetails.getId());
        return ResponseEntity.ok()
                .build();
    }
}