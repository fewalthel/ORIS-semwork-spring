package ru.kpfu.orissemwork2.services.impl;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kpfu.orissemwork2.converters.RewardsConverter;
import ru.kpfu.orissemwork2.converters.UsersConverter;
import ru.kpfu.orissemwork2.dto.ChangePasswordForm;
import ru.kpfu.orissemwork2.dto.ChangeUsernameForm;
import ru.kpfu.orissemwork2.dto.UserDto;
import ru.kpfu.orissemwork2.models.Role;
import ru.kpfu.orissemwork2.models.User;
import ru.kpfu.orissemwork2.repository.UsersRepository;
import ru.kpfu.orissemwork2.security.details.UserDetailsImpl;
import ru.kpfu.orissemwork2.security.jwt.JwtTokenProvider;
import ru.kpfu.orissemwork2.services.LoggerService;
import ru.kpfu.orissemwork2.services.UsersService;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsersServiceImpl implements UsersService {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private LoggerService loggerService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UsersConverter usersConverter;

    @Autowired
    private RewardsConverter rewardsConverter;

    @Transactional
    @Override
    public void deleteUserById(Long id) {
        try {
            User user = usersRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));

            usersRepository.delete(user);
        } catch (Exception e) {
            loggerService.logUserErrorToFile(e);
            throw e;
        }
    }

    @Transactional
    @Override
    public void updateUserRoleById(Long id, Role role) {
        try {
            User user = usersRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));

            user.setRole(role);
            usersRepository.save(user);

        } catch (Exception e) {
            loggerService.logUserErrorToFile(e);
            throw e;
        }

    }

    @Override
    public List<UserDto> getAll() {
        try {
            List<User> users = usersRepository.findAll();
            return usersConverter.convert(users);
        } catch (Exception e) {
            loggerService.logUserErrorToFile(e);
            throw e;
        }
    }

    @Override
    public void setAvatar(Long userId, Long avatarId) {
        try {
            usersRepository.saveAvatarId(userId, avatarId);
        } catch (Exception e) {
            loggerService.logUserErrorToFile(e);
            throw e;
        }
    }

    @Override
    public void confirmUser(String code) {
        try {
            User user = usersRepository.findByConfirmCode(code)
                    .orElseThrow(() -> new EntityNotFoundException("User not found with confirm code: " + code));

            user.setIsConfirmed(Boolean.TRUE);
            user.setConfirmCode(null);
            usersRepository.save(user);
        } catch (Exception e) {
            loggerService.logUserErrorToFile(e);
            throw e;
        }
    }

    @Override
    public void changePassword(ChangePasswordForm changePasswordForm, UserDetailsImpl userDetails) {
        try {
            User user = usersRepository.findById(userDetails.getId())
                    .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userDetails.getId()));

            String oldPassword = changePasswordForm.getOldPassword();
            String newPassword = changePasswordForm.getNewPassword();

            if (passwordEncoder.matches(oldPassword, user.getPassword())) {
                user.setPassword(passwordEncoder.encode(newPassword));
                usersRepository.save(user);
            } else {
                throw new IllegalArgumentException("Invalid old password");
            }
        } catch (Exception e) {
            loggerService.logUserErrorToFile(e);
            throw e;
        }
    }

    @Override
    public String changeUsername(ChangeUsernameForm changeUsernameForm, UserDetailsImpl userDetails) {
        try {
            User user = usersRepository.findById(userDetails.getId())
                    .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userDetails.getId()));

            String newUsername = changeUsernameForm.getNewUsername();

            if (usersRepository.findByUsername(newUsername)
                    .isPresent()) {
                throw new IllegalArgumentException("Username already taken");
            }

            user.setUsername(newUsername);
            usersRepository.save(user);

            String newToken = jwtTokenProvider.generateToken(newUsername);
            return newToken;
        } catch (Exception e) {
            loggerService.logUserErrorToFile(e);
            throw e;
        }
    }

    @Override
    public List<UserDto> getAllUsersSortedByRewards() {
        try {
            List<User> users = usersRepository.findAllOrderByRewardsDesc();
            return users.stream()
                    .map(user -> UserDto.builder()
                            .id(user.getAccountId())
                            .username(user.getUsername())
                            .email(user.getEmail())
                            .role(user.getRole())
                            .rewards(rewardsConverter.convert(user.getRewards()))
                            .build())
                    .collect(Collectors.toList());
        } catch (Exception e) {
            loggerService.logUserErrorToFile(e);
            throw e;
        }
    }
}