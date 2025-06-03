package ru.kpfu.orissemwork2.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.kpfu.orissemwork2.models.Question;

import java.util.List;
import java.util.Optional;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    Optional<Question> findByQuestionId(Long id);

    List<Question> findAllByCategory_Name(String categoryName);
}