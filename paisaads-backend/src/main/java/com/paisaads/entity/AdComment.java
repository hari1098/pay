package com.paisaads.entity;

import com.paisaads.enums.AdStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "ad_comments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdComment {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(updatable = false, nullable = false)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(name = "action_type")
    private AdStatus actionType;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(name = "action_timestamp")
    private LocalDateTime actionTimestamp;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "line_ad_id")
    private LineAd lineAd;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "poster_ad_id")
    private PosterAd posterAd;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "video_ad_id")
    private VideoAd videoAd;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (actionTimestamp == null) actionTimestamp = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
