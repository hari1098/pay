package com.paisaads.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank private String name;
    @Email private String email;
    @NotBlank private String phoneNumber;
    @NotBlank private String password;
    private String secondaryNumber;
    @NotBlank private String country;
    @NotBlank private String countryId;
    @NotBlank private String state;
    @NotBlank private String stateId;
    @NotBlank private String city;
    @NotBlank private String cityId;
    private String proof;
    @NotBlank private String gender;
}
