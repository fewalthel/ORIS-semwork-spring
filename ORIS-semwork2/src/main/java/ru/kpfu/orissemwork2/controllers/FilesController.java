package ru.kpfu.orissemwork2.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.kpfu.orissemwork2.models.FileInfo;
import ru.kpfu.orissemwork2.models.User;
import ru.kpfu.orissemwork2.security.details.UserDetailsImpl;
import ru.kpfu.orissemwork2.services.FileStorageService;
import ru.kpfu.orissemwork2.services.RewardService;
import ru.kpfu.orissemwork2.services.UsersService;

@RestController
@RequestMapping("/files")
public class FilesController {
    @Autowired
    private FileStorageService fileStorageService;
    @Autowired
    private UsersService usersService;
    @Autowired
    private RewardService rewardService;

    @PostMapping("/save/avatar")
    public ResponseEntity<?> fileUpload(@RequestParam("file") MultipartFile file, @AuthenticationPrincipal UserDetailsImpl userDetails) {

        User currentUser = userDetails.getUser();

        FileInfo fileInfo = fileStorageService.saveFileToUser(file, currentUser);
        usersService.setAvatar(userDetails.getUser()
                .getAccountId(), fileInfo.getId());
        return ResponseEntity.status(HttpStatus.OK)
                .build();
    }

    @GetMapping("/get/avatar")
    public ResponseEntity<?> getFile(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        Long currentUserId = userDetails.getId();
        Resource fileResource = fileStorageService.loadUserAvatarAsResource(currentUserId);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileResource.getFilename() + "\"")
                .body(fileResource);
    }

    @PostMapping("/save/rewardImage/{id}")
    public ResponseEntity<?> rewardImageUpload(@RequestParam("file") MultipartFile file, @PathVariable("id") Long rewardId) {
        FileInfo fileInfo = fileStorageService.saveFileToReward(file, rewardId);
        rewardService.setImage(rewardId, fileInfo.getId());
        return ResponseEntity.status(HttpStatus.OK)
                .build();
    }

    @GetMapping("/get/rewardImage/{id}")
    public ResponseEntity<?> getRewardImage(@PathVariable("id") Long rewardId) {
        Resource fileResource = fileStorageService.loadRewardImageAsResource(rewardId);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileResource.getFilename() + "\"")
                .body(fileResource);
    }
}
