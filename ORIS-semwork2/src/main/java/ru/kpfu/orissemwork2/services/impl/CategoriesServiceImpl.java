package ru.kpfu.orissemwork2.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import ru.kpfu.orissemwork2.converters.CategoryConverter;
import ru.kpfu.orissemwork2.dto.CategoryDto;
import ru.kpfu.orissemwork2.dto.CategoryForm;
import ru.kpfu.orissemwork2.models.Category;
import ru.kpfu.orissemwork2.repository.CategoriesRepository;
import ru.kpfu.orissemwork2.services.CategoriesService;
import ru.kpfu.orissemwork2.services.LoggerService;

import java.util.List;
import java.util.Optional;

@Service
public class CategoriesServiceImpl implements CategoriesService {
    @Autowired
    private CategoriesRepository categoriesRepository;

    @Autowired
    private LoggerService loggerService;

    @Autowired
    private CategoryConverter categoryConverter;

    @Override
    public List<CategoryDto> getAll() {
        try {
            return categoryConverter.convert(categoriesRepository.findAll());
        } catch (Exception e) {
            loggerService.logCategoryErrorToFile(e);
            throw e;
        }
    }

    @Override
    public Optional<Category> getByName(String name) {
        try {
            return categoriesRepository.findByName(name);
        } catch (Exception e) {
            loggerService.logCategoryErrorToFile(e);
            throw e;
        }
    }

    @Override
    public void add(CategoryForm categoryForm) {
        try {
            Category category = Category.builder()
                    .name(categoryForm.getName())
                    .build();

            if (categoriesRepository.findByName(categoryForm.getName())
                    .isPresent()) {
                throw new DataIntegrityViolationException("Category with this name already exists");
            } else {
                categoriesRepository.save(category);
            }
        } catch (Exception e) {
            loggerService.logCategoryErrorToFile(e);
            throw e;
        }
    }
}