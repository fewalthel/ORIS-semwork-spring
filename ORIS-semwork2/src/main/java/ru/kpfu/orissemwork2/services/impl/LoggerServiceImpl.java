package ru.kpfu.orissemwork2.services.impl;

import org.springframework.stereotype.Service;
import ru.kpfu.orissemwork2.services.LoggerService;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDateTime;

@Service
public class LoggerServiceImpl implements LoggerService {
    @Override
    public void log(Exception e, String filePath) {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(filePath, true))) {
            writer.write("\n[" + LocalDateTime.now() + "] ERROR: ");
            writer.write(e.toString());

            for (StackTraceElement ste : e.getStackTrace()) {
                writer.write("\t" + ste.toString());
            }
        } catch (IOException ex) {
            System.err.println("Error with writing to errors logs file: " + ex.getMessage());
        }
    }

    @Override
    public void logAnswerErrorToFile(Exception e) {
        String filePath = "/home/fewalthel/Desktop/ORIS-semwork-spring/ORIS-semwork2/src/main/resources/static/errors/answers_error.txt";
        log(e, filePath);
    }

    @Override
    public void logQuestionErrorToFile(Exception e) {
        String filePath = "/home/fewalthel/Desktop/ORIS-semwork-spring/ORIS-semwork2/src/main/resources/static/errors/questions_error.txt";
        log(e, filePath);
    }

    @Override
    public void logUserErrorToFile(Exception e) {
        String filePath = "/home/fewalthel/Desktop/ORIS-semwork-spring/ORIS-semwork2/src/main/resources/static/errors/users_error.txt";
        log(e, filePath);
    }

    @Override
    public void logRewardErrorToFIle(Exception e) {
        String filePath = "/home/fewalthel/Desktop/ORIS-semwork-spring/ORIS-semwork2/src/main/resources/static/errors/rewards_error.txt";
        log(e, filePath);
    }

    @Override
    public void logCategoryErrorToFile(Exception e) {
        String filePath = "/home/fewalthel/Desktop/ORIS-semwork-spring/ORIS-semwork2/src/main/resources/static/errors/categories_error.txt";
        log(e, filePath);
    }

    @Override
    public void logFileErrorToFile(Exception e) {
        String filePath = "/home/fewalthel/Desktop/ORIS-semwork-spring/ORIS-semwork2/src/main/resources/static/errors/files_error.txt";
        log(e, filePath);
    }
}
