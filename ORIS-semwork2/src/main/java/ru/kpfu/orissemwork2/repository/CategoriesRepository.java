package ru.kpfu.orissemwork2.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.kpfu.orissemwork2.models.Category;

import java.util.List;
import java.util.Optional;

public interface CategoriesRepository extends JpaRepository<Category, Long> {
    List<Category> findAll();

    Optional<Category> findByName(String name);
}
