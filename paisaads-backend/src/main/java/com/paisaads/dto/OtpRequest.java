package com.paisaads.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OtpRequest {
    @NotBlank private String phone;
    private String otp;
}
