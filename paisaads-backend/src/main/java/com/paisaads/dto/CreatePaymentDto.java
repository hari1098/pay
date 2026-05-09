package com.paisaads.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreatePaymentDto {
    @NotBlank private String method;
    @NotNull private BigDecimal amount;
    @NotBlank private String details;
    private String proofImageId;
    private String lineAdId;
    private String posterAdId;
    private String videoAdId;
}
