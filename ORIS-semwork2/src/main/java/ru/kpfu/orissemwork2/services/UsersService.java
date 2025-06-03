package ru.kpfu.orissemwork2.services;

import ru.kpfu.orissemwork2.dto.ChangePasswordForm;
import ru.kpfu.orissemwork2.dto.ChangeUsernameForm;
import ru.kpfu.orissemwork2.dto.UserDto;
import ru.kpfu.orissemwork2.models.Role;
import ru.kpfu.orissemwork2.security.details.UserDetailsImpl;

import java.util.List;

public interface UsersService {
    void deleteUserById(Long id);

    void updateUserRoleById(Long id, Role role);

    List<UserDto> getAll();

    void setAvatar(Long userId, Long avatarId);

    void confirmUser(String code);

    void changePassword(ChangePasswordForm changePasswordForm, UserDetailsImpl userDetails);

    String changeUsername(ChangeUsernameForm changeUsernameForm, UserDetailsImpl userDetails);

    List<UserDto> getAllUsersSortedByRewards();
}
