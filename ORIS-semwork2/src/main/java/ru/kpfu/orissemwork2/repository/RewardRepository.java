package ru.kpfu.orissemwork2.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.kpfu.orissemwork2.models.Reward;
import ru.kpfu.orissemwork2.models.RewardType;

import java.util.Optional;

public interface RewardRepository extends JpaRepository<Reward, Long> {
    Optional<Reward> findByRewardId(Long rewardId);

    Optional<Reward> findByTypeAndThreshold(RewardType type, Integer threshold);
}
