package com.paisaads.service;

import com.paisaads.entity.Image;
import com.paisaads.repository.ImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ImageService {

    private final ImageRepository imageRepository;

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    @Transactional
    public Image uploadImage(MultipartFile file, UUID userId) {
        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFileName = file.getOriginalFilename();
            String fileName = UUID.randomUUID() + "_" + originalFileName;
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);

            Image image = new Image();
            image.setFileName(originalFileName);
            image.setFilePath("/" + uploadDir + "/" + fileName);
            image.setIsTemp(true);
            return imageRepository.save(image);
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image: " + e.getMessage());
        }
    }

    @Transactional
    public Image confirmImage(UUID imageId) {
        Image image = imageRepository.findById(imageId)
            .orElseThrow(() -> new RuntimeException("Image not found"));
        image.setIsTemp(false);
        return imageRepository.save(image);
    }

    public Image getImageById(UUID id) {
        return imageRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Image not found"));
    }

    @Transactional
    public void deleteImage(UUID id) {
        Image image = imageRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Image not found"));
        try {
            Path filePath = Paths.get(image.getFilePath().substring(1));
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            // File may not exist on disk, ignore
        }
        imageRepository.deleteById(id);
    }
}
