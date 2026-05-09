package com.paisaads.service;

import com.paisaads.dto.CreateAdCommentDto;
import com.paisaads.entity.*;
import com.paisaads.enums.AdStatus;
import com.paisaads.enums.AdType;
import com.paisaads.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AdCommentService {

    private final AdCommentRepository adCommentRepository;
    private final UserService userService;
    private final LineAdService lineAdService;
    private final PosterAdService posterAdService;
    private final VideoAdService videoAdService;

    @Transactional
    public AdComment create(CreateAdCommentDto dto, UUID userId) {
        User user = userService.findOneById(userId);
        AdType adType = AdType.valueOf(dto.getAdType());
        AdStatus actionType = AdStatus.valueOf(dto.getActionType());

        if (adType == AdType.LINE) {
            if (dto.getLineAdId() == null) throw new SecurityException("Missing lineAdId for LINE ad type");
            LineAd ad = lineAdService.findOne(dto.getLineAdId());
            if (ad.getStatus() == AdStatus.PAUSED) {
                AdComment comment = new AdComment();
                comment.setActionType(actionType); comment.setComment(dto.getComment());
                comment.setUser(user); comment.setLineAd(ad);
                adCommentRepository.save(comment);
                lineAdService.updateAdStatus(dto.getLineAdId(), actionType);
                return comment;
            }
            List<AdComment> existing = adCommentRepository.findByLineAdIdAndActionTypeAndIsActiveTrue(UUID.fromString(dto.getLineAdId()), actionType);
            if (!existing.isEmpty()) throw new SecurityException("You have already commented on this ad");
            if (ad.getStatus() == actionType) throw new SecurityException("Ad is already on " + actionType + " status");
            AdComment comment = new AdComment();
            comment.setActionType(actionType); comment.setComment(dto.getComment());
            comment.setUser(user); comment.setLineAd(ad);
            adCommentRepository.save(comment);
            lineAdService.updateAdStatus(dto.getLineAdId(), actionType);
            return comment;
        } else if (adType == AdType.POSTER) {
            if (dto.getPosterAdId() == null) throw new SecurityException("Missing posterAdId for POSTER ad type");
            PosterAd ad = posterAdService.findOne(dto.getPosterAdId());
            if (ad.getStatus() == AdStatus.PAUSED) {
                AdComment comment = new AdComment();
                comment.setActionType(actionType); comment.setComment(dto.getComment());
                comment.setUser(user); comment.setPosterAd(ad);
                adCommentRepository.save(comment);
                posterAdService.updateAdStatus(dto.getPosterAdId(), actionType);
                return comment;
            }
            List<AdComment> existing = adCommentRepository.findByPosterAdIdAndActionTypeAndIsActiveTrue(UUID.fromString(dto.getPosterAdId()), actionType);
            if (!existing.isEmpty()) throw new SecurityException("You have already commented on this ad");
            if (ad.getStatus() == actionType) throw new SecurityException("Ad is already on " + actionType + " status");
            AdComment comment = new AdComment();
            comment.setActionType(actionType); comment.setComment(dto.getComment());
            comment.setUser(user); comment.setPosterAd(ad);
            adCommentRepository.save(comment);
            posterAdService.updateAdStatus(dto.getPosterAdId(), actionType);
            return comment;
        } else if (adType == AdType.VIDEO) {
            if (dto.getVideoAdId() == null) throw new SecurityException("Missing videoAdId for VIDEO ad type");
            VideoAd ad = videoAdService.findOne(dto.getVideoAdId());
            if (ad.getStatus() == AdStatus.PAUSED) {
                AdComment comment = new AdComment();
                comment.setActionType(actionType); comment.setComment(dto.getComment());
                comment.setUser(user); comment.setVideoAd(ad);
                adCommentRepository.save(comment);
                videoAdService.updateAdStatus(dto.getVideoAdId(), actionType);
                return comment;
            }
            List<AdComment> existing = adCommentRepository.findByVideoAdIdAndActionTypeAndIsActiveTrue(UUID.fromString(dto.getVideoAdId()), actionType);
            if (!existing.isEmpty()) throw new SecurityException("You have already commented on this ad");
            if (ad.getStatus() == actionType) throw new SecurityException("Ad is already on " + actionType + " status");
            AdComment comment = new AdComment();
            comment.setActionType(actionType); comment.setComment(dto.getComment());
            comment.setUser(user); comment.setVideoAd(ad);
            adCommentRepository.save(comment);
            videoAdService.updateAdStatus(dto.getVideoAdId(), actionType);
            return comment;
        }
        throw new SecurityException("Invalid ad type");
    }

    public List<AdComment> findAllForAd(String adId, String actionType, String adType, boolean isActive) {
        UUID uuid = UUID.fromString(adId);
        AdType type = AdType.valueOf(adType);
        AdStatus status = actionType != null ? AdStatus.valueOf(actionType) : null;

        if (type == AdType.LINE) {
            if (status != null) return adCommentRepository.findByLineAdIdAndActionTypeAndIsActiveTrue(uuid, status);
            return isActive ? adCommentRepository.findByLineAdIdAndIsActiveTrueOrderByActionTimestampDesc(uuid) : adCommentRepository.findByLineAdIdAndIsActive(uuid, true);
        } else if (type == AdType.POSTER) {
            if (status != null) return adCommentRepository.findByPosterAdIdAndActionTypeAndIsActiveTrue(uuid, status);
            return isActive ? adCommentRepository.findByPosterAdIdAndIsActiveTrueOrderByActionTimestampDesc(uuid) : adCommentRepository.findByPosterAdIdAndIsActive(uuid, true);
        } else if (type == AdType.VIDEO) {
            if (status != null) return adCommentRepository.findByVideoAdIdAndActionTypeAndIsActiveTrue(uuid, status);
            return isActive ? adCommentRepository.findByVideoAdIdAndIsActiveTrueOrderByActionTimestampDesc(uuid) : adCommentRepository.findByVideoAdIdAndIsActive(uuid, true);
        }
        return List.of();
    }

    public AdComment findOne(String id) { return adCommentRepository.findById(UUID.fromString(id)).orElseThrow(() -> new RuntimeException("Comment not found")); }

    @Transactional
    public AdComment update(String id, CreateAdCommentDto dto) {
        AdComment comment = findOne(id);
        if (dto.getComment() != null) comment.setComment(dto.getComment());
        if (dto.getActionType() != null) comment.setActionType(AdStatus.valueOf(dto.getActionType()));
        return adCommentRepository.save(comment);
    }

    @Transactional
    public void remove(String id) {
        AdComment comment = findOne(id);
        comment.setIsActive(false);
        adCommentRepository.save(comment);
    }

    @Transactional
    public void sendForReview(String adId, String type) {
        AdType adType = AdType.valueOf(type);
        Object ad;
        switch (adType) {
            case LINE: ad = lineAdService.findOne(adId); break;
            case POSTER: ad = posterAdService.findOne(adId); break;
            case VIDEO: ad = videoAdService.findOne(adId); break;
            default: throw new SecurityException("Invalid ad type");
        }

        if (adType == AdType.LINE && ((LineAd) ad).getStatus() != AdStatus.HOLD) throw new SecurityException("Ad cannot be sent for review");
        if (adType == AdType.POSTER && ((PosterAd) ad).getStatus() != AdStatus.HOLD) throw new SecurityException("Ad cannot be sent for review");
        if (adType == AdType.VIDEO && ((VideoAd) ad).getStatus() != AdStatus.HOLD) throw new SecurityException("Ad cannot be sent for review");

        List<AdComment> comments = findAllForAd(adId, null, type, true);
        for (AdComment c : comments) { c.setIsActive(false); adCommentRepository.save(c); }

        switch (adType) {
            case LINE: lineAdService.updateAdStatus(adId, AdStatus.FOR_REVIEW); break;
            case POSTER: posterAdService.updateAdStatus(adId, AdStatus.FOR_REVIEW); break;
            case VIDEO: videoAdService.updateAdStatus(adId, AdStatus.FOR_REVIEW); break;
        }
    }
}
