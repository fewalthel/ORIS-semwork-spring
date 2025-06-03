package ru.kpfu.orissemwork2.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.kpfu.orissemwork2.dto.RewardForm;
import ru.kpfu.orissemwork2.services.RewardService;
import ru.kpfu.orissemwork2.dto.RewardDto;

import java.util.List;

@RestController
@RequestMapping("/rewards")
public class RewardsController {
    @Autowired
    private RewardService rewardService;

    @GetMapping("/all")
    public List<RewardDto> getAll() {
        return rewardService.getAll();
    }

    @PostMapping("/add")
    public ResponseEntity<?> addReward(@RequestBody RewardForm rewardForm) {
        rewardService.addReward(rewardForm);
        return ResponseEntity.ok("Reward successfully added");
    }

    @GetMapping("/all/forUser/{id}")
    public List<RewardDto> getAllForUser(@PathVariable("id") Long userId) {
        return rewardService.getAllForUser(userId);
    }
}
