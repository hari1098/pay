package com.paisaads.controller;

import com.paisaads.entity.Image;
import com.paisaads.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/images")
@RequiredArgsConstructor
public class ImageController {

    private final ImageService imageService;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadImage(
            @RequestParam("file") MultipartFile file,
            @CurrentSecurityContext(expression = "authentication.principal") Object principal) {
        try {
            UUID userId = extractUserId(principal);
            Image image = imageService.uploadImage(file, userId);
            return ResponseEntity.ok(Map.of(
                "id", image.getId().toString(),
                "fileName", image.getFileName(),
                "filePath", image.getFilePath()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteImage(@PathVariable UUID id) {
        imageService.deleteImage(id);
        return ResponseEntity.ok(Map.of("message", "Image deleted successfully"));
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
