package ru.kpfu.orissemwork2.converters;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;
import ru.kpfu.orissemwork2.dto.CategoryDto;
import ru.kpfu.orissemwork2.models.Category;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class CategoryConverter implements Converter<CategoryDto, Category> {
    @Override
    public Category convert(CategoryDto categoryDto) {
        return Category.builder()
                .categoryId(categoryDto.getId())
                .name(categoryDto.getName())
                .build();
    }

    public CategoryDto convert(Category category) {
        return CategoryDto.builder()
                .id(category.getCategoryId())
                .name(category.getName())
                .build();
    }

    public List<CategoryDto> convert(List<Category> categories) {
        return categories.stream()
                .map(this::convert)
                .collect(Collectors.toList());
    }
}
