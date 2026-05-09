package com.paisaads.service;

import com.paisaads.dto.CategoryTreeDto;
import com.paisaads.entity.*;
import com.paisaads.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final MainCategoryRepository mainCategoryRepository;
    private final CategoryOneRepository categoryOneRepository;
    private final CategoryTwoRepository categoryTwoRepository;
    private final CategoryThreeRepository categoryThreeRepository;

    @Transactional
    public MainCategory createMainCategoryTree(CategoryTreeDto dto) {
        MainCategory main = new MainCategory();
        main.setName(dto.getName());
        main.setCategoryHeadingFontColor(dto.getCategoryHeadingFontColor());
        main.setCategoriesColor(dto.getCategoriesColor());
        main.setFontColor(dto.getFontColor());
        
        if (dto.getSubCategories() != null) {
            for (CategoryTreeDto.CategoryOneDto c1Dto : dto.getSubCategories()) {
                CategoryOne c1 = new CategoryOne();
                c1.setName(c1Dto.getName());
                c1.setCategoryHeadingFontColor(c1Dto.getCategoryHeadingFontColor());
                c1.setParent(main);
                if (c1Dto.getSubCategories() != null) {
                    for (CategoryTreeDto.CategoryTwoDto c2Dto : c1Dto.getSubCategories()) {
                        CategoryTwo c2 = new CategoryTwo();
                        c2.setName(c2Dto.getName());
                        c2.setCategoryHeadingFontColor(c2Dto.getCategoryHeadingFontColor());
                        c2.setParent(c1);
                        if (c2Dto.getSubCategories() != null) {
                            for (CategoryTreeDto.CategoryThreeDto c3Dto : c2Dto.getSubCategories()) {
                                CategoryThree c3 = new CategoryThree();
                                c3.setName(c3Dto.getName());
                                c3.setCategoryHeadingFontColor(c3Dto.getCategoryHeadingFontColor());
                                c3.setParent(c2);
                                c2.getSubCategories().add(c3);
                            }
                        }
                        c1.getSubCategories().add(c2);
                    }
                }
                main.getSubCategories().add(c1);
            }
        }
        return mainCategoryRepository.save(main);
    }

    public java.util.List<MainCategory> findAllTrees() {
        return mainCategoryRepository.findAllTrees();
    }

    public MainCategory findMainCategoryById(UUID id) {
        return mainCategoryRepository.findById(id).orElseThrow(() -> new RuntimeException("MainCategory not found"));
    }

    public CategoryOne findCategoryOneById(UUID id) {
        return categoryOneRepository.findById(id).orElse(null);
    }

    public CategoryTwo findCategoryTwoById(UUID id) {
        return categoryTwoRepository.findById(id).orElse(null);
    }

    public CategoryThree findCategoryThreeById(UUID id) {
        return categoryThreeRepository.findById(id).orElse(null);
    }

    @Transactional
    public MainCategory addMainCategory(Map<String, Object> dto) {
        MainCategory mc = new MainCategory();
        mc.setName((String) dto.get("name"));
        mc.setCategoryHeadingFontColor((String) dto.getOrDefault("category_heading_font_color", null));
        mc.setCategoriesColor((String) dto.getOrDefault("categories_color", null));
        mc.setFontColor((String) dto.getOrDefault("font_color", null));
        if (dto.containsKey("isActive")) mc.setIsActive((Boolean) dto.get("isActive"));
        return mainCategoryRepository.save(mc);
    }

    @Transactional
    public CategoryOne addCategoryOne(UUID mainId, Map<String, Object> dto) {
        MainCategory parent = mainCategoryRepository.findById(mainId).orElseThrow(() -> new RuntimeException("MainCategory not found"));
        CategoryOne c1 = new CategoryOne();
        c1.setName((String) dto.get("name"));
        c1.setCategoryHeadingFontColor((String) dto.getOrDefault("category_heading_font_color", null));
        c1.setParent(parent);
        if (dto.containsKey("isActive")) c1.setIsActive((Boolean) dto.get("isActive"));
        return categoryOneRepository.save(c1);
    }

    @Transactional
    public CategoryTwo addCategoryTwo(UUID oneId, Map<String, Object> dto) {
        CategoryOne parent = categoryOneRepository.findById(oneId).orElseThrow(() -> new RuntimeException("CategoryOne not found"));
        CategoryTwo c2 = new CategoryTwo();
        c2.setName((String) dto.get("name"));
        c2.setCategoryHeadingFontColor((String) dto.getOrDefault("category_heading_font_color", null));
        c2.setParent(parent);
        if (dto.containsKey("isActive")) c2.setIsActive((Boolean) dto.get("isActive"));
        return categoryTwoRepository.save(c2);
    }

    @Transactional
    public CategoryThree addCategoryThree(UUID twoId, Map<String, Object> dto) {
        CategoryTwo parent = categoryTwoRepository.findById(twoId).orElseThrow(() -> new RuntimeException("CategoryTwo not found"));
        CategoryThree c3 = new CategoryThree();
        c3.setName((String) dto.get("name"));
        c3.setCategoryHeadingFontColor((String) dto.getOrDefault("category_heading_font_color", null));
        c3.setParent(parent);
        if (dto.containsKey("isActive")) c3.setIsActive((Boolean) dto.get("isActive"));
        return categoryThreeRepository.save(c3);
    }

    @Transactional
    public MainCategory updateMainCategory(UUID id, Map<String, Object> dto) {
        MainCategory mc = mainCategoryRepository.findById(id).orElseThrow(() -> new RuntimeException("MainCategory not found"));
        if (dto.containsKey("name")) mc.setName((String) dto.get("name"));
        if (dto.containsKey("category_heading_font_color")) mc.setCategoryHeadingFontColor((String) dto.get("category_heading_font_color"));
        if (dto.containsKey("categories_color")) mc.setCategoriesColor((String) dto.get("categories_color"));
        if (dto.containsKey("font_color")) mc.setFontColor((String) dto.get("font_color"));
        if (dto.containsKey("isActive")) mc.setIsActive((Boolean) dto.get("isActive"));
        return mainCategoryRepository.save(mc);
    }

    @Transactional
    public CategoryOne updateCategoryOne(UUID id, Map<String, Object> dto) {
        CategoryOne c = categoryOneRepository.findById(id).orElseThrow(() -> new RuntimeException("CategoryOne not found"));
        if (dto.containsKey("name")) c.setName((String) dto.get("name"));
        if (dto.containsKey("category_heading_font_color")) c.setCategoryHeadingFontColor((String) dto.get("category_heading_font_color"));
        if (dto.containsKey("isActive")) c.setIsActive((Boolean) dto.get("isActive"));
        return categoryOneRepository.save(c);
    }

    @Transactional
    public CategoryTwo updateCategoryTwo(UUID id, Map<String, Object> dto) {
        CategoryTwo c = categoryTwoRepository.findById(id).orElseThrow(() -> new RuntimeException("CategoryTwo not found"));
        if (dto.containsKey("name")) c.setName((String) dto.get("name"));
        if (dto.containsKey("category_heading_font_color")) c.setCategoryHeadingFontColor((String) dto.get("category_heading_font_color"));
        if (dto.containsKey("isActive")) c.setIsActive((Boolean) dto.get("isActive"));
        return categoryTwoRepository.save(c);
    }

    @Transactional
    public CategoryThree updateCategoryThree(UUID id, Map<String, Object> dto) {
        CategoryThree c = categoryThreeRepository.findById(id).orElseThrow(() -> new RuntimeException("CategoryThree not found"));
        if (dto.containsKey("name")) c.setName((String) dto.get("name"));
        if (dto.containsKey("category_heading_font_color")) c.setCategoryHeadingFontColor((String) dto.get("category_heading_font_color"));
        if (dto.containsKey("isActive")) c.setIsActive((Boolean) dto.get("isActive"));
        return categoryThreeRepository.save(c);
    }

    @Transactional
    public Map<String, String> deleteMainCategory(UUID id) {
        MainCategory mc = mainCategoryRepository.findById(id).orElseThrow(() -> new RuntimeException("MainCategory not found"));
        mainCategoryRepository.delete(mc);
        return Map.of("message", "MainCategory deleted");
    }

    @Transactional
    public Map<String, String> deleteCategoryOne(UUID id) {
        CategoryOne c = categoryOneRepository.findById(id).orElseThrow(() -> new RuntimeException("CategoryOne not found"));
        categoryOneRepository.delete(c);
        return Map.of("message", "CategoryOne deleted");
    }

    @Transactional
    public Map<String, String> deleteCategoryTwo(UUID id) {
        CategoryTwo c = categoryTwoRepository.findById(id).orElseThrow(() -> new RuntimeException("CategoryTwo not found"));
        categoryTwoRepository.delete(c);
        return Map.of("message", "CategoryTwo deleted");
    }

    @Transactional
    public Map<String, String> deleteCategoryThree(UUID id) {
        CategoryThree c = categoryThreeRepository.findById(id).orElseThrow(() -> new RuntimeException("CategoryThree not found"));
        categoryThreeRepository.delete(c);
        return Map.of("message", "CategoryThree deleted");
    }
}
