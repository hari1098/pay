package com.paisaads.service;

import com.paisaads.dto.CreatePaymentDto;
import com.paisaads.entity.*;
import com.paisaads.enums.AdStatus;
import com.paisaads.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final UserService userService;
    private final ImageService imageService;
    private final LineAdService lineAdService;
    private final PosterAdService posterAdService;
    private final VideoAdService videoAdService;

    @Transactional
    public Payment create(UUID userId, CreatePaymentDto dto) {
        User user = userService.findOneById(userId);
        if (user.getCustomer() == null) throw new IllegalArgumentException("Customer data not found");

        Payment payment = new Payment();
        payment.setMethod(dto.getMethod()); payment.setAmount(dto.getAmount());
        payment.setDetails(dto.getDetails()); payment.setCustomer(user.getCustomer());

        if (dto.getProofImageId() != null) payment.setProof(imageService.confirmImage(UUID.fromString(dto.getProofImageId())));
        Payment savedPayment = paymentRepository.save(payment);

        if (dto.getLineAdId() != null) {
            savedPayment.setLineAd(lineAdService.findOne(dto.getLineAdId()));
            paymentRepository.save(savedPayment);
            lineAdService.updateAdStatus(dto.getLineAdId(), AdStatus.FOR_REVIEW);
        } else if (dto.getPosterAdId() != null) {
            savedPayment.setPosterAd(posterAdService.findOne(dto.getPosterAdId()));
            paymentRepository.save(savedPayment);
            posterAdService.updateAdStatus(dto.getPosterAdId(), AdStatus.FOR_REVIEW);
        } else if (dto.getVideoAdId() != null) {
            savedPayment.setVideoAd(videoAdService.findOne(dto.getVideoAdId()));
            paymentRepository.save(savedPayment);
            videoAdService.updateAdStatus(dto.getVideoAdId(), AdStatus.FOR_REVIEW);
        } else {
            throw new IllegalArgumentException("Either lineAdId or posterAdId or videoAdId must be provided");
        }
        return savedPayment;
    }

    public Payment findOne(UUID id) { return paymentRepository.findById(id).orElseThrow(() -> new RuntimeException("Payment not found")); }

    @Transactional
    public Payment updatePayment(UUID id, CreatePaymentDto dto) {
        Payment payment = findOne(id);
        if (dto.getMethod() != null) payment.setMethod(dto.getMethod());
        if (dto.getAmount() != null) payment.setAmount(dto.getAmount());
        if (dto.getDetails() != null) payment.setDetails(dto.getDetails());
        return paymentRepository.save(payment);
    }
}
