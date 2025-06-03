package ru.kpfu.orissemwork2.exceptions;

public class BadWordsInContentException extends RuntimeException {
    public BadWordsInContentException() {
        super();
    }

    public BadWordsInContentException(String message) {
        super(message);
    }
}
