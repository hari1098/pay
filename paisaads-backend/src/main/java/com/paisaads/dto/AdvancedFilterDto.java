package com.paisaads.dto;

import lombok.Data;

import java.util.List;

@Data
public class AdvancedFilterDto {
    private String startDate;
    private String endDate;
    private String adType;
    private List<String> adTypes;
    private String userType;
    private List<String> userTypes;
    private String status;
    private List<String> statuses;
    private String state;
    private Integer stateId;
    private String city;
    private Integer cityId;
    private String mainCategoryId;
    private String categoryOneId;
    private String categoryTwoId;
    private String categoryThreeId;
    private String categoryId;
    private Integer page = 1;
    private Integer limit = 10;
    private String searchText;
    private String customerId;
    private String sortBy = "createdAt";
    private String sortOrder = "DESC";
    private Boolean isActive = true;
}
