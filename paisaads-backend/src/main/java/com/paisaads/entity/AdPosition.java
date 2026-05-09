package com.paisaads.entity;

import com.paisaads.enums.AdType;
import com.paisaads.enums.PageType;
import com.paisaads.enums.PositionType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "ad_positions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdPosition {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(updatable = false, nullable = false)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "video_ad_id")
    private VideoAd videoAd;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "poster_ad_id")
    private PosterAd posterAd;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "line_ad_id")
    private LineAd lineAd;

    @Enumerated(EnumType.STRING)
    @Column(name = "ad_type")
    private AdType adType;

    @Enumerated(EnumType.STRING)
    @Column(name = "page_type")
    private PageType pageType = PageType.HOME;

    @Enumerated(EnumType.STRING)
    @Column(name = "side")
    private PositionType side;

    @Column(name = "position")
    private Integer position = 0;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
