package com.paisaads.dto;

import com.paisaads.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDto {

    private UUID id;
    private String name;
    private String email;
    private String phoneNumber;
    private Role role;
    private Boolean isActive;
    private Boolean emailVerified;
    private Boolean phoneVerified;
}
