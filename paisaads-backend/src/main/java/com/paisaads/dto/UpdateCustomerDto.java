package com.paisaads.dto;

import lombok.Data;

@Data
public class UpdateCustomerDto {
    private String country;
    private String countryId;
    private String state;
    private String stateId;
    private String city;
    private String cityId;
}
