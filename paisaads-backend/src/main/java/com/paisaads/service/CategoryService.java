package com.paisaads.service;

import com.paisaads.dto.CategoryTreeDto;
import com.paisaads.entity.CategoryOne;
import com.paisaads.entity.CategoryThree;
import com.paisaads.entity.CategoryTwo;
import com.paisaads.entity.MainCategory;
import com.paisaads.repository.CategoryOneRepository;
import com.paisaads.repository.CategoryThreeRepository;
import com.paisaads.repository.CategoryTwoRepository;
import com.paisaads.repository.MainCategoryRepository;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final MainCategoryRepository mainCategoryRepository;
    private final CategoryOneRepository categoryOneRepository;
    private final CategoryTwoRepository categoryTwoRepository;
    private final CategoryThreeRepository categoryThreeRepository;

    public List<CategoryTreeDto> getCategoryTree() {
        List<MainCategory> mainCategories = mainCategoryRepository.findByIsActiveTrue();

        return mainCategories.stream().map(mainCat -> {
            CategoryTreeDto mainDto = new CategoryTreeDto();
            mainDto.setId(mainCat.getId());
            mainDto.setName(mainCat.getName());

            List<CategoryOne> categoryOnes = categoryOneRepository.findByParentId(mainCat.getId());
            List<CategoryTreeDto> oneDtos = categoryOnes.stream().map(catOne -> {
                CategoryTreeDto oneDto = new CategoryTreeDto();
                oneDto.setId(catOne.getId());
                oneDto.setName(catOne.getName());

                List<CategoryTwo> categoryTwos = categoryTwoRepository.findByParentId(catOne.getId());
                List<CategoryTreeDto> twoDtos = categoryTwos.stream().map(catTwo -> {
                    CategoryTreeDto twoDto = new CategoryTreeDto();
                    twoDto.setId(catTwo.getId());
                    twoDto.setName(catTwo.getName());

                    List<CategoryThree> categoryThrees = categoryThreeRepository.findByParentId(catTwo.getId());
                    List<CategoryTreeDto> threeDtos = categoryThrees.stream().map(catThree -> {
                        CategoryTreeDto threeDto = new CategoryTreeDto();
                        threeDto.setId(catThree.getId());
                        threeDto.setName(catThree.getName());
                        return threeDto;
                    }).collect(Collectors.toList());
                    twoDto.setChildren(threeDtos);
                    twoDto.setSubCategories(threeDtos);

                    return twoDto;
                }).collect(Collectors.toList());
                oneDto.setChildren(twoDtos);
                oneDto.setSubCategories(twoDtos);

                return oneDto;
            }).collect(Collectors.toList());
            mainDto.setChildren(oneDtos);
            mainDto.setSubCategories(oneDtos);

            return mainDto;
        }).collect(Collectors.toList());
    }
}
