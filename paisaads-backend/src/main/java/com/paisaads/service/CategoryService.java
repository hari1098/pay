package com.paisaads.service;

import com.paisaads.dto.CategoryTreeDto;
import com.paisaads.entity.*;
import com.paisaads.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final MainCategoryRepository mainCategoryRepository;
    private final CategoryOneRepository categoryOneRepository;
    private final CategoryTwoRepository categoryTwoRepository;
    private final CategoryThreeRepository categoryThreeRepository;

    public CategoryService(MainCategoryRepository mainCategoryRepository,
                            CategoryOneRepository categoryOneRepository,
                            CategoryTwoRepository categoryTwoRepository,
                            CategoryThreeRepository categoryThreeRepository) {
        this.mainCategoryRepository = mainCategoryRepository;
        this.categoryOneRepository = categoryOneRepository;
        this.categoryTwoRepository = categoryTwoRepository;
        this.categoryThreeRepository = categoryThreeRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoryTreeDto> getCategoriesTree() {
        List<MainCategory> mainCategories = mainCategoryRepository.findByIsActiveTrue();

        return mainCategories.stream()
                .map(this::toTreeDto)
                .collect(Collectors.toList());
    }

    private CategoryTreeDto toTreeDto(MainCategory mc) {
        CategoryTreeDto dto = new CategoryTreeDto();
        dto.setId(mc.getId());
        dto.setName(mc.getName());
        dto.setCategoryHeadingFontColor(mc.getCategoryHeadingFontColor());
        dto.setCategoriesColor(mc.getCategoriesColor());
        dto.setFontColor(mc.getFontColor());
        dto.setIsActive(mc.getIsActive());

        List<CategoryOne> catOnes = categoryOneRepository.findByParentIdAndIsActiveTrue(mc.getId());
        dto.setSubCategories(catOnes.stream()
                .map(this::toSubCategoryOneDto)
                .collect(Collectors.toList()));

        return dto;
    }

    private CategoryTreeDto.SubCategoryOneDto toSubCategoryOneDto(CategoryOne c1) {
        CategoryTreeDto.SubCategoryOneDto dto = new CategoryTreeDto.SubCategoryOneDto();
        dto.setId(c1.getId());
        dto.setName(c1.getName());
        dto.setCategoryHeadingFontColor(c1.getCategoryHeadingFontColor());
        dto.setIsActive(c1.getIsActive());

        List<CategoryTwo> catTwos = categoryTwoRepository.findByParentIdAndIsActiveTrue(c1.getId());
        dto.setSubCategories(catTwos.stream()
                .map(this::toSubCategoryTwoDto)
                .collect(Collectors.toList()));

        return dto;
    }

    private CategoryTreeDto.SubCategoryTwoDto toSubCategoryTwoDto(CategoryTwo c2) {
        CategoryTreeDto.SubCategoryTwoDto dto = new CategoryTreeDto.SubCategoryTwoDto();
        dto.setId(c2.getId());
        dto.setName(c2.getName());
        dto.setCategoryHeadingFontColor(c2.getCategoryHeadingFontColor());
        dto.setIsActive(c2.getIsActive());

        List<CategoryThree> catThrees = categoryThreeRepository.findByParentIdAndIsActiveTrue(c2.getId());
        dto.setSubCategories(catThrees.stream()
                .map(this::toSubCategoryThreeDto)
                .collect(Collectors.toList()));

        return dto;
    }

    private CategoryTreeDto.SubCategoryThreeDto toSubCategoryThreeDto(CategoryThree c3) {
        CategoryTreeDto.SubCategoryThreeDto dto = new CategoryTreeDto.SubCategoryThreeDto();
        dto.setId(c3.getId());
        dto.setName(c3.getName());
        dto.setCategoryHeadingFontColor(c3.getCategoryHeadingFontColor());
        dto.setIsActive(c3.getIsActive());
        return dto;
    }
}
