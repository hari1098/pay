package com.paisaads.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateAdPositionDto {
    @NotNull private String adType;
    private String pageType;
    private String side;
    private Integer position;
}
