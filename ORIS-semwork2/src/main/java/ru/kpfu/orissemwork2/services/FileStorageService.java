package ru.kpfu.orissemwork2.services;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;
import ru.kpfu.orissemwork2.models.FileInfo;
import ru.kpfu.orissemwork2.models.User;

public interface FileStorageService {
    FileInfo saveFileToUser(MultipartFile uploadFile, User user);

    Resource loadUserAvatarAsResource(Long userId);

    Resource loadRewardImageAsResource(Long rewardId);

    FileInfo saveFileToReward(MultipartFile file, Long rewardId);
}