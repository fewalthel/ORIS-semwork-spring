package ru.kpfu.orissemwork2.services.impl;

import jakarta.persistence.EntityNotFoundException;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartFile;
import ru.kpfu.orissemwork2.models.FileInfo;
import ru.kpfu.orissemwork2.models.Reward;
import ru.kpfu.orissemwork2.models.User;
import ru.kpfu.orissemwork2.repository.FilesInfoRepository;
import ru.kpfu.orissemwork2.repository.RewardRepository;
import ru.kpfu.orissemwork2.services.FileStorageService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import ru.kpfu.orissemwork2.services.LoggerService;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    @Autowired
    private FilesInfoRepository filesInfoRepository;

    @Autowired
    private RewardRepository rewardRepository;

    @Autowired
    private LoggerService loggerService;

    @Value("${storage.path}")
    private String storagePath;

    @Override
    public FileInfo saveFileToReward(MultipartFile uploadFile, Long rewardId) {
        try {
            Reward reward = rewardRepository.findByRewardId(rewardId)
                    .orElseThrow(() -> new EntityNotFoundException("Reward not found with id: " + rewardId));

            String storageName = String.valueOf(UUID.randomUUID());

            FileInfo file = FileInfo.builder()
                    .type(uploadFile.getContentType())
                    .originalFileName(uploadFile.getOriginalFilename())
                    .size(uploadFile.getSize())
                    .storageFileName(storageName)
                    .url(storagePath + "/" + storageName)
                    .reward(reward)
                    .build();

            Files.copy(uploadFile.getInputStream(), Paths.get(storagePath, storageName));
            filesInfoRepository.save(file);
            return filesInfoRepository.findByStorageFileName(storageName)
                    .get();
        } catch (IOException e) {
            throw new IllegalStateException(e);
        } catch (MaxUploadSizeExceededException e) {
            throw e;
        } catch (Exception e) {
            loggerService.logFileErrorToFile(e);
            throw e;
        }
    }

    @Override
    public FileInfo saveFileToUser(MultipartFile uploadFile, User user) {
        try {
            String storageName = String.valueOf(UUID.randomUUID());

            FileInfo file = FileInfo.builder()
                    .type(uploadFile.getContentType())
                    .originalFileName(uploadFile.getOriginalFilename())
                    .size(uploadFile.getSize())
                    .storageFileName(storageName)
                    .url(storagePath + "/" + storageName)
                    .user(user)
                    .build();

            Files.copy(uploadFile.getInputStream(), Paths.get(storagePath, storageName));

            filesInfoRepository.save(file);

            return filesInfoRepository.findByStorageFileName(storageName)
                    .orElseThrow(() -> new FileNotFoundException("Fle not found in database"));
        } catch (IOException e) {
            throw new IllegalStateException(e);
        } catch (MaxUploadSizeExceededException e) {
            throw e;
        } catch (Exception e) {
            loggerService.logFileErrorToFile(e);
            throw e;
        }
    }

    @SneakyThrows
    @Override
    public Resource loadUserAvatarAsResource(Long userId) {
        try {
            FileInfo fileInfo = filesInfoRepository.findByUserAccountId(userId)
                    .orElseThrow(() -> new FileNotFoundException("File not found in database"));

            Path filePath = Paths.get(fileInfo.getUrl())
                    .normalize();

            Resource resource = new UrlResource(filePath.toUri());

            return resource;
        } catch (MalformedURLException e) {
            throw new FileNotFoundException("File not found in storage");
        } catch (IOException e) {
            throw new FileNotFoundException("Error with outputing file");
        } catch (Exception e) {
            loggerService.logFileErrorToFile(e);
            throw e;
        }
    }

    @Override
    public Resource loadRewardImageAsResource(Long rewardId) {
        try {
            FileInfo fileInfo = filesInfoRepository.findByRewardId(rewardId)
                    .orElseThrow(() -> new FileNotFoundException("File not found in database"));

            Path filePath = Paths.get(fileInfo.getUrl())
                    .normalize();

            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new FileNotFoundException("File not found in storage");
            }
        } catch (IOException e) {
            throw new IllegalStateException(e);
        } catch (Exception e) {
            loggerService.logFileErrorToFile(e);
            throw e;
        }
    }
}