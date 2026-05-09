package com.paisaads.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(updatable = false, nullable = false)
    private UUID id;

    @Column
    private String method;

    @Column(precision = 10, scale = 2)
    private BigDecimal amount;

    @Column
    private String details;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "proof_id")
    private Image proof;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "line_ad_id")
    private LineAd lineAd;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "poster_ad_id")
    private PosterAd posterAd;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "video_ad_id")
    private VideoAd videoAd;

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
