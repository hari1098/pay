package com.paisaads.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdStatusUpdateDto {

    @NotNull(message = "Status is required")
    private String status;

    private String comment;
}
