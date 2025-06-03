package ru.kpfu.orissemwork2.controllers;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import ru.kpfu.orissemwork2.dto.ChangePasswordForm;
import ru.kpfu.orissemwork2.dto.ChangeUsernameForm;
import ru.kpfu.orissemwork2.dto.UserDto;
import ru.kpfu.orissemwork2.security.details.UserDetailsImpl;
import ru.kpfu.orissemwork2.services.UsersService;

import java.util.List;

@RestController
public class UsersController {
    @Autowired
    private UsersService usersService;

    @PostMapping("/settings/changePassword")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordForm changePasswordForm, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        usersService.changePassword(changePasswordForm, userDetails);
        return ResponseEntity.ok()
                .build();
    }

    @PostMapping("/settings/changeUsername")
    public ResponseEntity<?> changeUsername(@RequestBody ChangeUsernameForm changeUsernameForm, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        String token = usersService.changeUsername(changeUsernameForm, userDetails);
        return ResponseEntity.status(HttpStatus.OK)
                .body(token);
    }

    @PostMapping("/settings/deleteAccount")
    public ResponseEntity<?> deleteAccount(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        usersService.deleteUserById(userDetails.getId());
        return ResponseEntity.ok()
                .build();
    }

    @GetMapping("/get/sorted-by-rewards")
    public List<UserDto> getUsersSortedByRewards() {
        return usersService.getAllUsersSortedByRewards();
    }
}
