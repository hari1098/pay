package com.paisaads.entity;

import com.paisaads.enums.AdStatus;
import com.paisaads.enums.PageType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "line_ads")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LineAd {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(updatable = false, nullable = false)
    private UUID id;

    private Integer sequenceNumber;

    private String orderId;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String state;

    private String sid;

    private String city;

    private String cid;

    @Column(columnDefinition = "TEXT")
    private String dates;

    private String postedBy;

    private String contactOne;

    private String contactTwo;

    private String backgroundColor;

    private String textColor;

    @Enumerated(EnumType.STRING)
    private AdStatus status;

    @Column(nullable = false)
    private Boolean isActive = true;

    @Enumerated(EnumType.STRING)
    private PageType pageType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "main_category_id")
    private MainCategory mainCategory;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_one_id")
    private CategoryOne categoryOne;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_two_id")
    private CategoryTwo categoryTwo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_three_id")
    private CategoryThree categoryThree;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_id")
    private Payment payment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

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
