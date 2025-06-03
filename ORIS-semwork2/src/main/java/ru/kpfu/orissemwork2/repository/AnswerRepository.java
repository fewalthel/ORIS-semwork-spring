package ru.kpfu.orissemwork2.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ru.kpfu.orissemwork2.models.Answer;

import java.util.List;

public interface AnswerRepository extends JpaRepository<Answer, Long> {
    @Query("SELECT a FROM Answer a WHERE a.question.questionId = :questionId")
    List<Answer> findAllByQuestionId(@Param("questionId") Long questionId);
}
