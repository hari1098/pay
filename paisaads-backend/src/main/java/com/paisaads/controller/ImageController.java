package com.paisaads.controller;

import com.paisaads.entity.Image;
import com.paisaads.service.ImageService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/images")
public class ImageController {

    private final ImageService imageService;

    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String userId = auth.getPrincipal().toString();

            Image image = imageService.uploadImage(file, UUID.fromString(userId));
            return ResponseEntity.ok(Map.of(
                    "id", image.getId().toString(),
                    "fileName", image.getFileName(),
                    "filePath", image.getFilePath()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getImage(@PathVariable UUID id) {
        Image image = imageService.getImageById(id);
        return ResponseEntity.ok(Map.of(
                "id", image.getId().toString(),
                "fileName", image.getFileName(),
                "filePath", image.getFilePath(),
                "isTemp", image.getIsTemp()
        ));
    }
}
