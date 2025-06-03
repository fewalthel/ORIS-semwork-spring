package ru.kpfu.orissemwork2.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.kpfu.orissemwork2.dto.UserDto;
import ru.kpfu.orissemwork2.models.Role;
import ru.kpfu.orissemwork2.services.UsersService;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private UsersService usersService;

    @PostMapping("/update/user/{role}/{user-id}")
    public ResponseEntity<String> updateUserRole(@PathVariable("user-id") Long userId, @PathVariable("role") Role role) {
        usersService.updateUserRoleById(userId, role);
        return ResponseEntity.ok("User successfully upgraded");
    }

    @PostMapping("/delete/user/{user-id}")
    public ResponseEntity<String> deleteUser(@PathVariable("user-id") Long userId) {
        usersService.deleteUserById(userId);
        return ResponseEntity.ok("User successfully deleted");
    }

    @GetMapping("/users/all")
    public List<UserDto> getAllUsers() {
        return usersService.getAll();
    }
}