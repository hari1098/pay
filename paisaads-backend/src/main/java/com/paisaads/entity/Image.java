package com.paisaads.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "images")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Image {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(updatable = false, nullable = false)
    private UUID id;

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "file_path")
    private String filePath;

    @Column(name = "is_temp")
    private Boolean isTemp = true;

    @Column(name = "uploaded_on")
    private LocalDateTime uploadedOn;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "line_ad_id")
    private LineAd lineAd;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "poster_ad_id")
    private PosterAd posterAd;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "video_ad_id")
    private VideoAd videoAd;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_proof_id")
    private Payment paymentProof;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (uploadedOn == null) uploadedOn = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
