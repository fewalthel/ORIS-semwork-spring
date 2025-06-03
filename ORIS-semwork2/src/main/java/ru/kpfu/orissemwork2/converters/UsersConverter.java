package ru.kpfu.orissemwork2.converters;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;
import ru.kpfu.orissemwork2.dto.UserDto;
import ru.kpfu.orissemwork2.models.User;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class UsersConverter implements Converter<UserDto, User> {

    @Override
    public User convert(UserDto userDto) {
        return User.builder()
                .accountId(userDto.getId())
                .username(userDto.getUsername())
                .email(userDto.getEmail())
                .role(userDto.getRole())
                .build();
    }

    public UserDto convert(User user) {
        return UserDto.builder()
                .id(user.getAccountId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    public List<UserDto> convert(List<User> users) {
        return users.stream()
                .map(this::convert)
                .collect(Collectors.toList());
    }
}
