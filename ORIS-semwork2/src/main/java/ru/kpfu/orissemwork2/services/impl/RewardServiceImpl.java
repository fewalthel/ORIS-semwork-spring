package ru.kpfu.orissemwork2.services.impl;

import jakarta.persistence.EntityNotFoundException;
import org.hibernate.Hibernate;
import org.hibernate.LazyInitializationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kpfu.orissemwork2.converters.RewardsConverter;
import ru.kpfu.orissemwork2.dto.RewardDto;
import ru.kpfu.orissemwork2.dto.RewardForm;
import ru.kpfu.orissemwork2.models.FileInfo;
import ru.kpfu.orissemwork2.models.Reward;
import ru.kpfu.orissemwork2.models.RewardType;
import ru.kpfu.orissemwork2.models.User;
import ru.kpfu.orissemwork2.repository.FilesInfoRepository;
import ru.kpfu.orissemwork2.repository.RewardRepository;
import ru.kpfu.orissemwork2.repository.UsersRepository;
import ru.kpfu.orissemwork2.services.LoggerService;
import ru.kpfu.orissemwork2.services.RewardService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class RewardServiceImpl implements RewardService {
    @Autowired
    private RewardRepository rewardRepository;
    @Autowired
    private UsersRepository usersRepository;
    @Autowired
    private FilesInfoRepository filesInfoRepository;
    @Autowired
    private RewardsConverter rewardsConverter;
    @Autowired
    private LoggerService loggerService;

    @Override
    public void addReward(RewardForm rewardForm) {
        try {
            if (rewardForm.getType() == null || rewardForm.getName() == null || rewardForm.getDescription() == null || rewardForm.getThreshold() == null) {
                throw new IllegalArgumentException("Inputs in reward form cannot be null");
            }

            Reward reward = Reward.builder()
                    .name(rewardForm.getName())
                    .description(rewardForm.getDescription())
                    .threshold(rewardForm.getThreshold())
                    .type(rewardForm.getType())
                    .build();

            rewardRepository.save(reward);
        } catch (Exception e) {
            loggerService.logRewardErrorToFIle(e);
            throw e;
        }
    }

    @Override
    public List<RewardDto> getAll() {
        try {
            return rewardsConverter.convert(rewardRepository.findAll());
        } catch (Exception e) {
            loggerService.logRewardErrorToFIle(e);
            throw e;
        }
    }

    @Override
    public void removeReward(User user, RewardType type) {
        try {
        if (type == RewardType.ANSWER) {
            Integer threshold = user.getAnswers().size();
            Optional<Reward> reward = rewardRepository.findByTypeAndThreshold(RewardType.ANSWER, threshold);
                   /* .orElseThrow(() -> new EntityNotFoundException("Reward not found"));*/

            if (reward.isPresent()) user.getRewards().remove(reward);
        }
        if (type == RewardType.QUESTION) {
            Integer threshold = user.getQuestions().size();
            Optional<Reward> reward = rewardRepository.findByTypeAndThreshold(RewardType.QUESTION, threshold);
                    /*.orElseThrow(() -> new EntityNotFoundException("Reward not found"));*/

            if (reward.isPresent())  user.getRewards().remove(reward);
        }
        } catch (Exception e) {
            loggerService.logRewardErrorToFIle(e);
            throw e;
        }
    }

    @Override
    public Optional<Reward> giveReward(Long userId, Integer threshold, RewardType type) {
        try {
            User user = usersRepository.findById(userId)
                    .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));

            Optional<Reward> givenReward = Optional.empty();

            if (type == RewardType.ANSWER) {
                givenReward = rewardRepository.findByTypeAndThreshold(RewardType.ANSWER, threshold);
                givenReward.ifPresent(reward -> user.getRewards()
                        .add(reward));
            } else if (type == RewardType.QUESTION) {
                givenReward = rewardRepository.findByTypeAndThreshold(RewardType.QUESTION, threshold);
                givenReward.ifPresent(reward -> user.getRewards()
                        .add(reward));
            }

            if (givenReward.isPresent()) {
                usersRepository.save(user);
            }

            return givenReward;
        } catch (Exception e) {
            loggerService.logRewardErrorToFIle(e);
            throw e;
        }
    }

    @Override
    public void setImage(Long rewardId, Long fileInfoId) {
        try {
            Reward reward = rewardRepository.findByRewardId(rewardId)
                    .orElseThrow(() -> new EntityNotFoundException("Reward not found with id: " + rewardId));

            FileInfo image = filesInfoRepository.findById(fileInfoId)
                    .orElseThrow(() -> new EntityNotFoundException("File not found with id: " + fileInfoId));

            reward.setImage(image);
            rewardRepository.save(reward);
        } catch (Exception e) {
            loggerService.logRewardErrorToFIle(e);
            throw e;
        }
    }

    @Transactional
    @Override
    public List<RewardDto> getAllForUser(Long userId) {
        try {
            User user = usersRepository.findById(userId)
                    .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

            Hibernate.initialize(user.getRewards());

            List<Reward> rewards = user.getRewards();
            if (rewards == null || rewards.isEmpty()) {
                return new ArrayList<>();
            }

            return rewardsConverter.convert(rewards);
        } catch (LazyInitializationException e) {
            throw e;
        } catch (ConversionException e) {
            throw e;
        } catch (Exception e) {
            loggerService.logRewardErrorToFIle(e);
            throw e;
        }
    }
}