package com.paisaads.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryTreeDto {

    private UUID id;
    private String name;
    private String categoryHeadingFontColor;
    private String categoriesColor;
    private String fontColor;
    private Boolean isActive;
    private List<SubCategoryOneDto> subCategories = new ArrayList<>();

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubCategoryOneDto {
        private UUID id;
        private String name;
        private String categoryHeadingFontColor;
        private Boolean isActive;
        private List<SubCategoryTwoDto> subCategories = new ArrayList<>();
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubCategoryTwoDto {
        private UUID id;
        private String name;
        private String categoryHeadingFontColor;
        private Boolean isActive;
        private List<SubCategoryThreeDto> subCategories = new ArrayList<>();
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubCategoryThreeDto {
        private UUID id;
        private String name;
        private String categoryHeadingFontColor;
        private Boolean isActive;
    }
}
