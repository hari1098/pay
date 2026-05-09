package com.paisaads.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStats {

    private long totalAds;
    private long activeAds;
    private long pendingAds;
    private long totalViews;
}
