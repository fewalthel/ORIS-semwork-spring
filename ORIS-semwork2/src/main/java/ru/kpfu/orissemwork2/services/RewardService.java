package ru.kpfu.orissemwork2.services;

import ru.kpfu.orissemwork2.dto.RewardDto;
import ru.kpfu.orissemwork2.dto.RewardForm;
import ru.kpfu.orissemwork2.models.Reward;
import ru.kpfu.orissemwork2.models.RewardType;
import ru.kpfu.orissemwork2.models.User;

import java.util.List;
import java.util.Optional;

public interface RewardService {

    void addReward(RewardForm rewardForm);

    List<RewardDto> getAll();

    Optional<Reward> giveReward(Long userId, Integer threshold, RewardType type);

    void setImage(Long rewardId, Long fileInfoId);

    List<RewardDto> getAllForUser(Long userId);

    void removeReward(User user, RewardType type);
}
