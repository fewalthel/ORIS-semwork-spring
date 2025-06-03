package ru.kpfu.orissemwork2.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.kpfu.orissemwork2.dto.CategoryDto;
import ru.kpfu.orissemwork2.dto.CategoryForm;
import ru.kpfu.orissemwork2.services.CategoriesService;

import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoriesController {

    @Autowired
    private CategoriesService categoriesService;

    @GetMapping("/all")
    public List<CategoryDto> getAllCategories() {
        return categoriesService.getAll();
    }

    @PostMapping("/add")
    public ResponseEntity<String> addNewCategory(@RequestBody CategoryForm categoryForm) {
        categoriesService.add(categoryForm);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Category successful created");
    }
}
