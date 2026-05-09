package com.paisaads.dto;

import lombok.Data;

@Data
public class UpdateUserDto {
    private String name;
    private String email;
    private Boolean emailVerified;
    private Boolean phoneVerified;
}
