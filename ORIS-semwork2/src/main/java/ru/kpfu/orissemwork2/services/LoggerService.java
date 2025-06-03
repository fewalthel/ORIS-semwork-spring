package ru.kpfu.orissemwork2.services;

public interface LoggerService {
    void log(Exception e, String filePath);

    void logAnswerErrorToFile(Exception e);

    void logQuestionErrorToFile(Exception e);

    void logUserErrorToFile(Exception e);

    void logRewardErrorToFIle(Exception e);

    void logCategoryErrorToFile(Exception e);

    void logFileErrorToFile(Exception e);

}
