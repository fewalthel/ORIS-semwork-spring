package ru.kpfu.orissemwork2.services.impl;

import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.mail.MailException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ru.kpfu.orissemwork2.dto.SignUpForm;
import ru.kpfu.orissemwork2.exceptions.InvalidEmailException;
import ru.kpfu.orissemwork2.models.Role;
import ru.kpfu.orissemwork2.models.User;
import ru.kpfu.orissemwork2.repository.UsersRepository;
import ru.kpfu.orissemwork2.services.LoggerService;
import ru.kpfu.orissemwork2.services.MailService;
import ru.kpfu.orissemwork2.services.SignUpService;

@Service
public class SignUpServiceImpl implements SignUpService {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private MailService mailService;

    @Autowired
    private LoggerService loggerService;

    @Override
    public void addUser(SignUpForm userForm) {
        try {
            String code = RandomStringUtils.randomNumeric(6);

            User user = User.builder()
                    .email(userForm.getEmail())
                    .username(userForm.getUsername())
                    .password(passwordEncoder.encode(userForm.getPassword()))
                    .role(Role.USER)
                    .confirmCode(code)
                    .isConfirmed(Boolean.FALSE)
                    .build();

            if (!isValidEmail(userForm.getEmail())) {
                throw new InvalidEmailException("Invalid email.");
            }
            mailService.sendEmailForConfirm(userForm.getEmail(), code);
            usersRepository.save(user);
        } catch (Exception e) {
            loggerService.logUserErrorToFile(e);
            throw e;
        }
    }

    private boolean isValidEmail(String email) {
        return email != null && email.matches("^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$");
    }
}