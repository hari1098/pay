package com.paisaads.dto;

import lombok.Data;

import java.util.List;

@Data
public class CategoryTreeDto {
    private String name;
    private String categoryHeadingFontColor;
    private String categoriesColor;
    private String fontColor;
    private List<CategoryOneDto> subCategories;

    @Data
    public static class CategoryOneDto {
        private String name;
        private String categoryHeadingFontColor;
        private List<CategoryTwoDto> subCategories;
    }

    @Data
    public static class CategoryTwoDto {
        private String name;
        private String categoryHeadingFontColor;
        private List<CategoryThreeDto> subCategories;
    }

    @Data
    public static class CategoryThreeDto {
        private String name;
        private String categoryHeadingFontColor;
    }
}
