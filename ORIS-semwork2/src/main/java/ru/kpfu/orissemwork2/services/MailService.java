package ru.kpfu.orissemwork2.services;

public interface MailService {
    void sendEmailForConfirm(String email, String code);
}