package com.paisaads.controller;

import com.paisaads.dto.CategoryTreeDto;
import com.paisaads.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping("/tree")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> createTree(@RequestBody CategoryTreeDto dto) {
        return ResponseEntity.ok(categoryService.createMainCategoryTree(dto));
    }

    @PostMapping("/main")
    public ResponseEntity<?> createMain(@RequestBody Map<String, Object> dto) {
        return ResponseEntity.ok(categoryService.addMainCategory(dto));
    }

    @PostMapping("/main/{mainId}/one")
    public ResponseEntity<?> createOne(@PathVariable UUID mainId, @RequestBody Map<String, Object> dto) {
        return ResponseEntity.ok(categoryService.addCategoryOne(mainId, dto));
    }

    @PostMapping("/one/{oneId}/two")
    public ResponseEntity<?> createTwo(@PathVariable UUID oneId, @RequestBody Map<String, Object> dto) {
        return ResponseEntity.ok(categoryService.addCategoryTwo(oneId, dto));
    }

    @PostMapping("/two/{twoId}/three")
    public ResponseEntity<?> createThree(@PathVariable UUID twoId, @RequestBody Map<String, Object> dto) {
        return ResponseEntity.ok(categoryService.addCategoryThree(twoId, dto));
    }

    @GetMapping("/tree")
    public ResponseEntity<?> getAllTrees() {
        return ResponseEntity.ok(categoryService.findAllTrees());
    }

    @GetMapping("/main/{id}")
    public ResponseEntity<?> getMain(@PathVariable UUID id) {
        return ResponseEntity.ok(categoryService.findMainCategoryById(id));
    }

    @PatchMapping("/main/{id}")
    public ResponseEntity<?> updateMain(@PathVariable UUID id, @RequestBody Map<String, Object> dto) {
        return ResponseEntity.ok(categoryService.updateMainCategory(id, dto));
    }

    @PatchMapping("/one/{id}")
    public ResponseEntity<?> updateOne(@PathVariable UUID id, @RequestBody Map<String, Object> dto) {
        return ResponseEntity.ok(categoryService.updateCategoryOne(id, dto));
    }

    @PatchMapping("/two/{id}")
    public ResponseEntity<?> updateTwo(@PathVariable UUID id, @RequestBody Map<String, Object> dto) {
        return ResponseEntity.ok(categoryService.updateCategoryTwo(id, dto));
    }

    @PatchMapping("/three/{id}")
    public ResponseEntity<?> updateThree(@PathVariable UUID id, @RequestBody Map<String, Object> dto) {
        return ResponseEntity.ok(categoryService.updateCategoryThree(id, dto));
    }

    @DeleteMapping("/main/{id}")
    public ResponseEntity<?> deleteMain(@PathVariable UUID id) {
        return ResponseEntity.ok(categoryService.deleteMainCategory(id));
    }

    @DeleteMapping("/one/{id}")
    public ResponseEntity<?> deleteOne(@PathVariable UUID id) {
        return ResponseEntity.ok(categoryService.deleteCategoryOne(id));
    }

    @DeleteMapping("/two/{id}")
    public ResponseEntity<?> deleteTwo(@PathVariable UUID id) {
        return ResponseEntity.ok(categoryService.deleteCategoryTwo(id));
    }

    @DeleteMapping("/three/{id}")
    public ResponseEntity<?> deleteThree(@PathVariable UUID id) {
        return ResponseEntity.ok(categoryService.deleteCategoryThree(id));
    }
}
