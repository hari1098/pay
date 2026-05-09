package com.paisaads.dto;

import com.paisaads.enums.AdStatus;
import com.paisaads.enums.PageType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VideoAdDto {

    private UUID id;
    private Integer sequenceNumber;
    private String orderId;
    private AdStatus status;
    private Boolean isActive;
    private String dates;
    private String state;
    private String sid;
    private String city;
    private String cid;
    private String postedBy;
    private PageType pageType;

    private UUID mainCategoryId;
    private String mainCategoryName;

    private UUID categoryOneId;
    private String categoryOneName;

    private UUID categoryTwoId;
    private String categoryTwoName;

    private UUID categoryThreeId;
    private String categoryThreeName;

    private UUID imageId;
    private String imageFilePath;

    private UUID customerId;
    private String customerName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
