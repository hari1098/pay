package com.paisaads.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateAdCommentDto {
    @NotNull private String actionType;
    @NotBlank private String comment;
    @NotNull private String adType;
    private String lineAdId;
    private String posterAdId;
    private String videoAdId;
}
