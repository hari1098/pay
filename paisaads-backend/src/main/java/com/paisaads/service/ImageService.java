package com.paisaads.service;

import com.paisaads.entity.Customer;
import com.paisaads.entity.Image;
import com.paisaads.repository.CustomerRepository;
import com.paisaads.repository.ImageRepository;
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
public class ImageService {

    private final ImageRepository imageRepository;
    private final CustomerRepository customerRepository;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    public ImageService(ImageRepository imageRepository, CustomerRepository customerRepository) {
        this.imageRepository = imageRepository;
        this.customerRepository = customerRepository;
    }

    @Transactional
    public Image uploadImage(MultipartFile file, UUID customerId) throws IOException {
        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique file name
        String originalFileName = file.getOriginalFilename();
        String fileName = UUID.randomUUID() + "_" + originalFileName;
        Path filePath = uploadPath.resolve(fileName);

        // Save file to disk
        Files.copy(file.getInputStream(), filePath);

        // Save image record to database
        Image image = new Image();
        image.setFileName(fileName);
        image.setFilePath("/uploads/" + fileName);
        image.setIsTemp(true);

        if (customerId != null) {
            Customer customer = customerRepository.findById(customerId).orElse(null);
            image.setCustomer(customer);
        }

        image = imageRepository.save(image);
        return image;
    }

    public Image getImageById(UUID id) {
        return imageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Image not found"));
    }

    @Transactional
    public void markImageAsPermanent(UUID imageId) {
        Image image = imageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found"));
        image.setIsTemp(false);
        imageRepository.save(image);
    }
}
