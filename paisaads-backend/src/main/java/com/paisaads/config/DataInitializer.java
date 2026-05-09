package com.paisaads.config;

import com.paisaads.entity.*;
import com.paisaads.enums.*;
import com.paisaads.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final AdminRepository adminRepository;
    private final MainCategoryRepository mainCategoryRepository;
    private final CategoryOneRepository categoryOneRepository;
    private final CategoryTwoRepository categoryTwoRepository;
    private final CategoryThreeRepository categoryThreeRepository;
    private final LineAdRepository lineAdRepository;
    private final PosterAdRepository posterAdRepository;
    private final VideoAdRepository videoAdRepository;
    private final PaymentRepository paymentRepository;
    private final ImageRepository imageRepository;
    private final AdPositionRepository adPositionRepository;
    private final AdCommentRepository adCommentRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) return;

        String hash = passwordEncoder.encode("password123");

        // Create users
        User superAdmin = createUser("Super Admin", "admin@paisaads.com", "9999999999", hash, Role.SUPER_ADMIN, true, true);
        User testUser = createUser("Test User", "user@paisaads.com", "8888888888", hash, Role.USER, true, true);
        User editorUser = createUser("Editor User", "editor@paisaads.com", "7777777777", hash, Role.EDITOR, true, true);
        User reviewerUser = createUser("Reviewer User", "reviewer@paisaads.com", "6666666666", hash, Role.REVIEWER, true, true);

        // Create admins
        Admin admin1 = new Admin(); admin1.setUser(superAdmin);
        Admin admin2 = new Admin(); admin2.setUser(editorUser);
        Admin admin3 = new Admin(); admin3.setUser(reviewerUser);
        adminRepository.saveAll(java.util.List.of(admin1, admin2, admin3));

        // Create customer for test user
        Customer customer = new Customer();
        customer.setUser(testUser);
        customer.setCountry("India"); customer.setCountryId("IN");
        customer.setState("Karnataka"); customer.setStateId("KA");
        customer.setCity("Bangalore"); customer.setCityId("BLR");
        customer.setGender(Gender.MALE);
        customerRepository.save(customer);

        // Create categories
        MainCategory realEstate = createMainCategory("Real Estate", "#2196F3", "#E3F2FD", "#1565C0");
        MainCategory vehicles = createMainCategory("Vehicles", "#4CAF50", "#E8F5E9", "#2E7D32");
        MainCategory electronics = createMainCategory("Electronics", "#FF9800", "#FFF3E0", "#E65100");
        MainCategory jobs = createMainCategory("Jobs", "#9C27B0", "#F3E5F5", "#6A1B9A");
        MainCategory services = createMainCategory("Services", "#F44336", "#FFEBEE", "#B71C1C");

        // Category Ones
        CategoryOne apartments = createCategoryOne("Apartments", "#1565C0", realEstate);
        CategoryOne houses = createCategoryOne("Houses", "#1565C0", realEstate);
        CategoryOne cars = createCategoryOne("Cars", "#2E7D32", vehicles);
        CategoryOne mobiles = createCategoryOne("Mobiles", "#E65100", electronics);
        CategoryOne itJobs = createCategoryOne("IT Jobs", "#6A1B9A", jobs);
        CategoryOne homeRepair = createCategoryOne("Home Repair", "#B71C1C", services);

        // Category Twos
        CategoryTwo twoBhk = createCategoryTwo("2 BHK", "#1565C0", apartments);
        CategoryTwo sedan = createCategoryTwo("Sedan", "#2E7D32", cars);
        CategoryTwo smartphones = createCategoryTwo("Smartphones", "#E65100", mobiles);

        // Category Threes
        CategoryThree semiFurnished = createCategoryThree("Semi-Furnished", "#1565C0", twoBhk);
        CategoryThree automatic = createCategoryThree("Automatic", "#2E7D32", sedan);
        CategoryThree android = createCategoryThree("Android", "#E65100", smartphones);

        // Create images
        Image img1 = createImage("poster_ad_1.jpg", "/uploads/poster_ad_1.jpg");
        Image img2 = createImage("poster_ad_2.jpg", "/uploads/poster_ad_2.jpg");
        Image img3 = createImage("video_ad_1.jpg", "/uploads/video_ad_1.jpg");

        // Create payments
        Payment pay1 = createPayment("razorpay", new BigDecimal("499"), "Payment for line ad");
        Payment pay2 = createPayment("razorpay", new BigDecimal("999"), "Payment for poster ad");
        Payment pay3 = createPayment("razorpay", new BigDecimal("4499"), "Payment for video ad");
        pay1.setProof(img1); pay1.setCustomer(customer);
        pay2.setProof(img2); pay2.setCustomer(customer);
        pay3.setProof(img3); pay3.setCustomer(customer);
        paymentRepository.saveAll(java.util.List.of(pay1, pay2, pay3));

        // Create line ads
        String today = LocalDateTime.now().toString().substring(0, 10);
        LineAd lineAd1 = new LineAd();
        lineAd1.setSequenceNumber(1); lineAd1.setOrderId(1L);
        lineAd1.setContent("Spacious 2 BHK apartment for rent in Koramangala, Bangalore. Semi-furnished.");
        lineAd1.setState("Karnataka"); lineAd1.setSid(1);
        lineAd1.setCity("Bangalore"); lineAd1.setCid(1);
        lineAd1.setDates(today); lineAd1.setPostedBy("Test User");
        lineAd1.setContactOne(9876543210L); lineAd1.setContactTwo(9876543211L);
        lineAd1.setBackgroundColor("#FFFFFF"); lineAd1.setTextColor("#000000");
        lineAd1.setStatus(AdStatus.PUBLISHED); lineAd1.setIsActive(true);
        lineAd1.setMainCategory(realEstate); lineAd1.setCategoryOne(apartments);
        lineAd1.setCategoryTwo(twoBhk); lineAd1.setCategoryThree(semiFurnished);
        lineAd1.setPayment(pay1); lineAd1.setCustomer(customer);
        lineAdRepository.save(lineAd1);

        // Create poster ad
        PosterAd posterAd1 = new PosterAd();
        posterAd1.setSequenceNumber(1); posterAd1.setOrderId(2L);
        posterAd1.setState("Maharashtra"); posterAd1.setSid(2);
        posterAd1.setCity("Mumbai"); posterAd1.setCid(2);
        posterAd1.setDates(today); posterAd1.setPostedBy("Test User");
        posterAd1.setStatus(AdStatus.PUBLISHED); posterAd1.setIsActive(true);
        posterAd1.setMainCategory(vehicles); posterAd1.setCategoryOne(cars);
        posterAd1.setCategoryTwo(sedan); posterAd1.setImage(img1);
        posterAd1.setPayment(pay2); posterAd1.setCustomer(customer);
        posterAdRepository.save(posterAd1);

        // Create video ad
        VideoAd videoAd1 = new VideoAd();
        videoAd1.setSequenceNumber(1); videoAd1.setOrderId(3L);
        videoAd1.setState("Karnataka"); videoAd1.setSid(1);
        videoAd1.setCity("Bangalore"); videoAd1.setCid(1);
        videoAd1.setDates(today); videoAd1.setPostedBy("Test User");
        videoAd1.setStatus(AdStatus.PUBLISHED); videoAd1.setIsActive(true);
        videoAd1.setMainCategory(electronics); videoAd1.setCategoryOne(mobiles);
        videoAd1.setCategoryTwo(smartphones); videoAd1.setCategoryThree(android);
        videoAd1.setImage(img3);
        videoAd1.setPayment(pay3); videoAd1.setCustomer(customer);
        videoAdRepository.save(videoAd1);

        // Create ad positions
        AdPosition pos1 = new AdPosition();
        pos1.setAdType(AdType.LINE); pos1.setPageType(PageType.HOME);
        pos1.setSide(PositionType.LEFT_SIDE); pos1.setPosition(1); pos1.setLineAd(lineAd1);
        adPositionRepository.save(pos1);

        AdPosition pos2 = new AdPosition();
        pos2.setAdType(AdType.POSTER); pos2.setPageType(PageType.HOME);
        pos2.setSide(PositionType.RIGHT_SIDE); pos2.setPosition(1); pos2.setPosterAd(posterAd1);
        adPositionRepository.save(pos2);

        AdPosition pos3 = new AdPosition();
        pos3.setAdType(AdType.VIDEO); pos3.setPageType(PageType.HOME);
        pos3.setSide(PositionType.CENTER_TOP); pos3.setPosition(0); pos3.setVideoAd(videoAd1);
        adPositionRepository.save(pos3);

        log.info("Data initialization complete");
    }

    private User createUser(String name, String email, String phone, String hash, Role role, boolean emailVerified, boolean phoneVerified) {
        User user = new User();
        user.setName(name); user.setEmail(email); user.setPhoneNumber(phone);
        user.setPassword(hash); user.setRole(role);
        user.setEmailVerified(emailVerified); user.setPhoneVerified(phoneVerified);
        return userRepository.save(user);
    }

    private MainCategory createMainCategory(String name, String headingColor, String catColor, String fontColor) {
        MainCategory mc = new MainCategory();
        mc.setName(name); mc.setCategoryHeadingFontColor(headingColor);
        mc.setCategoriesColor(catColor); mc.setFontColor(fontColor);
        return mainCategoryRepository.save(mc);
    }

    private CategoryOne createCategoryOne(String name, String color, MainCategory parent) {
        CategoryOne c = new CategoryOne();
        c.setName(name); c.setCategoryHeadingFontColor(color); c.setParent(parent);
        return categoryOneRepository.save(c);
    }

    private CategoryTwo createCategoryTwo(String name, String color, CategoryOne parent) {
        CategoryTwo c = new CategoryTwo();
        c.setName(name); c.setCategoryHeadingFontColor(color); c.setParent(parent);
        return categoryTwoRepository.save(c);
    }

    private CategoryThree createCategoryThree(String name, String color, CategoryTwo parent) {
        CategoryThree c = new CategoryThree();
        c.setName(name); c.setCategoryHeadingFontColor(color); c.setParent(parent);
        return categoryThreeRepository.save(c);
    }

    private Image createImage(String fileName, String filePath) {
        Image img = new Image();
        img.setFileName(fileName); img.setFilePath(filePath); img.setIsTemp(false);
        return imageRepository.save(img);
    }

    private Payment createPayment(String method, BigDecimal amount, String details) {
        Payment p = new Payment();
        p.setMethod(method); p.setAmount(amount); p.setDetails(details);
        return paymentRepository.save(p);
    }
}
