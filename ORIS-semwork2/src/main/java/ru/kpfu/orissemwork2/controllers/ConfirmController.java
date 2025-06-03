package ru.kpfu.orissemwork2.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.kpfu.orissemwork2.services.UsersService;

@RestController
@RequestMapping("/confirm")
public class ConfirmController {

    @Autowired
    private UsersService usersService;

    @GetMapping("/{code}")
    public ResponseEntity<?> confirmUser(@PathVariable String code) {
        usersService.confirmUser(code);
            return ResponseEntity.status(HttpStatus.OK).body("Email successfully confirmed");
    }
}