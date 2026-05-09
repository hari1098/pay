package com.paisaads.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class CreateLineAdDto {
    @NotNull private String mainCategoryId;
    private String categoryOneId;
    private String categoryTwoId;
    private String categoryThreeId;
    @NotBlank private String content;
    private List<String> imageIds;
    @NotBlank private String state;
    private Integer sid;
    @NotBlank private String city;
    private Integer cid;
    private String postedBy;
    @NotNull private Long contactOne;
    private Long contactTwo;
    private String backgroundColor;
    private String textColor;
    private List<String> dates;
    private String pageType;
}
