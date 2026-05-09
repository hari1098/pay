package com.paisaads.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class CreatePosterAdDto {
    @NotNull private String mainCategoryId;
    private String categoryOneId;
    private String categoryTwoId;
    private String categoryThreeId;
    @NotBlank private String imageId;
    @NotBlank private String state;
    private Integer sid;
    @NotBlank private String city;
    private Integer cid;
    @NotBlank private String postedBy;
    @NotNull private List<String> dates;
    @NotNull private String pageType;
    @NotNull private String side;
    private Integer position;
}
