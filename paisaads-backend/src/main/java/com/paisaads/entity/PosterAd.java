package com.paisaads.entity;

import com.paisaads.enums.AdStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "poster_ads")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PosterAd {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(updatable = false, nullable = false)
    private UUID id;

    @Column(name = "sequence_number")
    private Integer sequenceNumber;

    @Column(name = "order_id")
    private Long orderId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "main_category_id")
    private MainCategory mainCategory;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_one_id")
    private CategoryOne categoryOne;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_two_id")
    private CategoryTwo categoryTwo;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_three_id")
    private CategoryThree categoryThree;

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "image_id")
    private Image image;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "payment_id")
    private Payment payment;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AdStatus status = AdStatus.DRAFT;

    @OneToMany(mappedBy = "posterAd", fetch = FetchType.LAZY)
    private List<AdComment> comments;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(columnDefinition = "TEXT")
    private String dates;

    @Column
    private String state;

    @Column(name = "sid")
    private Integer sid;

    @Column
    private String city;

    @Column(name = "cid")
    private Integer cid;

    @Column(name = "posted_by")
    private String postedBy;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "position_id")
    private AdPosition position;

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

    @Transient
    public List<String> getDatesList() {
        if (dates == null || dates.isBlank()) return List.of();
        return List.of(dates.split(","));
    }

    @Transient
    public void setDatesList(List<String> dateList) {
        this.dates = dateList == null || dateList.isEmpty() ? null : String.join(",", dateList);
    }
}
