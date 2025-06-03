package ru.kpfu.orissemwork2.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import ru.kpfu.orissemwork2.dto.SignUpForm;
import ru.kpfu.orissemwork2.services.SignUpService;

@RestController
public class SignUpController {
    @Autowired
    private SignUpService signUpService;

    @PostMapping("/signUp")
    public ResponseEntity<?> signUp(@RequestBody SignUpForm form) {
        signUpService.addUser(form);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body("User successfully signed up. Confirmation email sent.");
    }
}
