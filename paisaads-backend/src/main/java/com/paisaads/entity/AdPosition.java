package com.paisaads.entity;

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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PageType pageType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PositionType side;

    @Column(nullable = false)
    private Integer position;

    @Column(nullable = false)
    private String adType;

    @Column(nullable = false)
    private UUID adId;

    @Column(updatable = false)
    private LocalDateTime createdAt;

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
