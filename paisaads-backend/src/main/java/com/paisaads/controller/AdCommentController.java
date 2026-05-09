package com.paisaads.controller;

import com.paisaads.entity.AdComment;
import com.paisaads.entity.User;
import com.paisaads.repository.AdCommentRepository;
import com.paisaads.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/ad-comments")
public class AdCommentController {

    private final AdCommentRepository adCommentRepository;
    private final UserRepository userRepository;

    public AdCommentController(AdCommentRepository adCommentRepository,
                               UserRepository userRepository) {
        this.adCommentRepository = adCommentRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/{adId}/{adType}")
    public ResponseEntity<List<AdComment>> getComments(@PathVariable UUID adId,
                                                        @PathVariable String adType) {
        return ResponseEntity.ok(adCommentRepository.findByAdIdAndAdTypeOrderByCreatedAtDesc(adId, adType));
    }

    @PostMapping
    public ResponseEntity<AdComment> addComment(@RequestBody Map<String, String> body) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = (String) auth.getPrincipal();
        User user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new RuntimeException("User not found"));

        AdComment comment = new AdComment();
        comment.setComment(body.get("comment"));
        comment.setAdType(body.get("adType"));
        comment.setAdId(UUID.fromString(body.get("adId")));
        comment.setUser(user);

        return ResponseEntity.ok(adCommentRepository.save(comment));
    }
}
