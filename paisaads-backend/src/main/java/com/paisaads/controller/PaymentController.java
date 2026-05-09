package com.paisaads.controller;

import com.paisaads.dto.CreatePaymentDto;
import com.paisaads.entity.Payment;
import com.paisaads.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<Payment> create(
            @CurrentSecurityContext(expression = "authentication.principal") Object principal,
            @RequestBody CreatePaymentDto dto) {
        UUID userId = extractUserId(principal);
        return ResponseEntity.ok(paymentService.create(userId, dto));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAnyRole('EDITOR','SUPER_ADMIN','REVIEWER')")
    public ResponseEntity<Payment> update(
            @PathVariable UUID id,
            @RequestBody CreatePaymentDto dto) {
        return ResponseEntity.ok(paymentService.updatePayment(id, dto));
    }

    @SuppressWarnings("unchecked")
    private UUID extractUserId(Object principal) {
        if (principal instanceof Map) {
            Map<String, Object> map = (Map<String, Object>) principal;
            return UUID.fromString(map.get("sub").toString());
        }
        throw new RuntimeException("Unable to extract user ID");
    }
}
