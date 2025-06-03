package ru.kpfu.orissemwork2.converters;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;
import ru.kpfu.orissemwork2.dto.QuestionDto;
import ru.kpfu.orissemwork2.dto.RewardDto;
import ru.kpfu.orissemwork2.models.Question;
import ru.kpfu.orissemwork2.models.Reward;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class RewardsConverter implements Converter<RewardDto, Reward> {
    @Override
    public Reward convert(RewardDto rewardDto) {
        return Reward.builder()
                .name(rewardDto.getName())
                .description(rewardDto.getDescription())
                .type(rewardDto.getType())
                .threshold(rewardDto.getThreshold())
                .build();
    }

    public RewardDto convert(Reward reward) {
        return RewardDto.builder()
                .id(reward.getRewardId())
                .name(reward.getName())
                .description(reward.getDescription())
                .threshold(reward.getThreshold())
                .type(reward.getType())
                .build();
    }

    public List<RewardDto> convert(List<Reward> rewards) {
        return rewards.stream()
                .map(this::convert)
                .collect(Collectors.toList());
    }
}
