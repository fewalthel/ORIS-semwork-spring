package ru.kpfu.orissemwork2.services;

import ru.kpfu.orissemwork2.dto.CategoryDto;
import ru.kpfu.orissemwork2.dto.CategoryForm;
import ru.kpfu.orissemwork2.models.Category;

import java.util.List;
import java.util.Optional;

public interface CategoriesService {
    List<CategoryDto> getAll();

    Optional<Category> getByName(String name);

    void add(CategoryForm categoryForm);
}
