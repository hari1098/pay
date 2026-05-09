package com.paisaads.controller;

import com.paisaads.service.ConfigurationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/configurations")
@RequiredArgsConstructor
public class ConfigurationController {

    private final ConfigurationService configurationService;

    @PostMapping("/terms-and-conditions")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Object> createTermsAndConditions(@RequestBody Map<String, Object> dto) {
        return ResponseEntity.ok(configurationService.createTermsAndConditions(dto));
    }

    @GetMapping("/terms-and-conditions")
    public ResponseEntity<Object> getTermsAndConditions() {
        return ResponseEntity.ok(configurationService.getTermsAndConditions());
    }

    @PostMapping("/ad-pricing")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Object> createOrUpdateAdPricing(@RequestBody Map<String, Object> dto) {
        return ResponseEntity.ok(configurationService.createOrUpdateAdPricing(dto));
    }

    @GetMapping("/ad-pricing")
    public ResponseEntity<Object> getAdPricing() {
        return ResponseEntity.ok(configurationService.getAdPricing());
    }

    @GetMapping("/ad-pricing/history")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ResponseEntity<Object> getAdPricingHistory() {
        return ResponseEntity.ok(configurationService.getAdPricingHistory());
    }

    @PostMapping("/privacy-policy")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Object> createOrUpdatePrivacyPolicy(@RequestBody Map<String, Object> dto) {
        return ResponseEntity.ok(configurationService.createOrUpdatePrivacyPolicy(dto));
    }

    @GetMapping("/privacy-policy")
    public ResponseEntity<Object> getPrivacyPolicy() {
        return ResponseEntity.ok(configurationService.getPrivacyPolicy());
    }

    @GetMapping("/privacy-policy/history")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ResponseEntity<Object> getPrivacyPolicyHistory() {
        return ResponseEntity.ok(configurationService.getPrivacyPolicyHistory());
    }

    @PostMapping("/search-slogan")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ResponseEntity<Object> createOrUpdateSearchSlogan(@RequestBody Map<String, Object> dto) {
        return ResponseEntity.ok(configurationService.createOrUpdateSearchSlogan(dto));
    }

    @GetMapping("/search-slogan")
    public ResponseEntity<Object> getSearchSlogan() {
        return ResponseEntity.ok(configurationService.getSearchSlogan());
    }

    @PostMapping("/about-us")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ResponseEntity<Object> createOrUpdateAboutUs(@RequestBody Map<String, Object> dto) {
        return ResponseEntity.ok(configurationService.createOrUpdateAboutUs(dto));
    }

    @GetMapping("/about-us")
    public ResponseEntity<Object> getAboutUs() {
        return ResponseEntity.ok(configurationService.getAboutUs());
    }

    @PostMapping("/faq")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ResponseEntity<Object> createOrUpdateFaq(@RequestBody Map<String, Object> dto) {
        return ResponseEntity.ok(configurationService.createOrUpdateFaq(dto));
    }

    @GetMapping("/faq")
    public ResponseEntity<Object> getFaq() {
        return ResponseEntity.ok(configurationService.getFaq());
    }

    @GetMapping("/faq/category/{category}")
    public ResponseEntity<Object> getFaqByCategory(@PathVariable String category) {
        return ResponseEntity.ok(configurationService.getFaqByCategory(category));
    }

    @PostMapping("/faq/question")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ResponseEntity<Object> addFaqQuestion(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(configurationService.addFaqQuestion(
            body.get("question"), body.get("answer"), body.get("category")));
    }

    @PatchMapping("/faq/question/{index}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ResponseEntity<Object> updateFaqQuestion(
            @PathVariable int index,
            @RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(configurationService.updateFaqQuestion(index, body));
    }

    @PostMapping("/contact-page")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ResponseEntity<Object> createOrUpdateContactPage(@RequestBody Map<String, Object> dto) {
        return ResponseEntity.ok(configurationService.createOrUpdateContactPage(dto));
    }

    @GetMapping("/contact-page")
    public ResponseEntity<Object> getContactPage() {
        return ResponseEntity.ok(configurationService.getContactPage());
    }

    @GetMapping("/all")
    public ResponseEntity<Map<String, Object>> getAllConfigurations() {
        return ResponseEntity.ok(configurationService.getAllConfigurations());
    }
}
