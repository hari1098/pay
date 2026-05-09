package com.paisaads.controller;

import com.paisaads.dto.CategoryTreeDto;
import com.paisaads.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping("/tree")
    public ResponseEntity<List<CategoryTreeDto>> getCategoryTree() {
        return ResponseEntity.ok(categoryService.getCategoriesTree());
    }
}
