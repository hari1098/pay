package com.paisaads.config;

import com.paisaads.entity.*;
import com.paisaads.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final MainCategoryRepository mainCategoryRepository;
    private final CategoryOneRepository categoryOneRepository;
    private final LineAdRepository lineAdRepository;
    private final PosterAdRepository posterAdRepository;
    private final VideoAdRepository videoAdRepository;
    private final PaymentRepository paymentRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) return;

        // Create admin user
        User admin = new User();
        admin.setName("Super Admin");
        admin.setPhoneNumber("9999999999");
        admin.setPassword(passwordEncoder.encode("password123"));
        admin.setRole(UserRole.SUPER_ADMIN);
        admin.setIsActive(true);
        admin.setPhoneVerified(true);
        admin.setEmailVerified(true);
        userRepository.save(admin);

        // Create customer user
        User customerUser = new User();
        customerUser.setName("Test Customer");
        customerUser.setPhoneNumber("8888888888");
        customerUser.setPassword(passwordEncoder.encode("password123"));
        customerUser.setRole(UserRole.USER);
        customerUser.setIsActive(true);
        customerUser.setPhoneVerified(true);
        customerUser.setEmailVerified(true);
        userRepository.save(customerUser);

        Customer customer = new Customer();
        customer.setUser(customerUser);
        customerRepository.save(customer);

        // Create categories
        MainCategory realEstate = createCategory("Real Estate");
        MainCategory vehicles = createCategory("Vehicles");
        MainCategory electronics = createCategory("Electronics");
        MainCategory jobs = createCategory("Jobs");
        MainCategory services = createCategory("Services");

        createSubCategory("Apartments", realEstate);
        createSubCategory("Houses", realEstate);
        createSubCategory("Cars", vehicles);
        createSubCategory("Motorcycles", vehicles);
        createSubCategory("Mobiles", electronics);
        createSubCategory("Laptops", electronics);
        createSubCategory("IT Jobs", jobs);
        createSubCategory("Home Services", services);

        // Create sample line ads
        createLineAd("2BHK Apartment for rent in Andheri West, fully furnished, near metro station. Rent 25000/month.",
            "Maharashtra", "Mumbai", "Test Customer", "9876543210", customer, realEstate);
        createLineAd("Honda City 2022 model, silver color, 35000km driven, single owner. Price 12 lakhs negotiable.",
            "Maharashtra", "Pune", "Test Customer", "9876543210", customer, vehicles);
        createLineAd("iPhone 15 Pro Max 256GB, Natural Titanium, with bill and warranty. Price 1,35,000.",
            "Karnataka", "Bangalore", "Test Customer", "9876543210", customer, electronics);
        createLineAd("Software Developer position at MNC, 3-5 years experience, React/Node.js. Salary 15-25 LPA.",
            "Karnataka", "Bangalore", "Test Customer", "9876543210", customer, jobs);
        createLineAd("Plumbing and electrical services at your doorstep. Expert technicians. Call now!",
            "Maharashtra", "Mumbai", "Test Customer", "9876543210", customer, services);

        // Create sample poster ads
        createPosterAd("Electronics Sale - Up to 50% off on all gadgets!", "Maharashtra", "Mumbai",
            "Test Customer", "9876543210", customer, electronics);
        createPosterAd("New Housing Project - 2/3 BHK starting 45 lakhs", "Maharashtra", "Pune",
            "Test Customer", "9876543210", customer, realEstate);
        createPosterAd("Car Service Special - Full service at just 999", "Karnataka", "Bangalore",
            "Test Customer", "9876543210", customer, vehicles);

        // Create sample video ad
        createVideoAd("Watch our latest property tour video!", "Maharashtra", "Mumbai",
            "Test Customer", "9876543210", customer, realEstate);

        System.out.println("Database seeded with sample data!");
    }

    private MainCategory createCategory(String name) {
        MainCategory cat = new MainCategory();
        cat.setName(name);
        cat.setIsActive(true);
        return mainCategoryRepository.save(cat);
    }

    private void createSubCategory(String name, MainCategory parent) {
        CategoryOne sub = new CategoryOne();
        sub.setName(name);
        sub.setParent(parent);
        sub.setIsActive(true);
        categoryOneRepository.save(sub);
    }

    private void createLineAd(String content, String state, String city, String postedBy,
                               String contact, Customer customer, MainCategory category) {
        LineAd ad = new LineAd();
        ad.setContent(content);
        ad.setState(state);
        ad.setCity(city);
        ad.setPostedBy(postedBy);
        ad.setContactOne(contact);
        ad.setCustomer(customer);
        ad.setMainCategory(category);
        ad.setStatus(AdStatus.PUBLISHED);
        ad.setIsActive(true);
        ad.setDates(List.of("2024-12-01", "2025-12-31"));
        lineAdRepository.save(ad);
    }

    private void createPosterAd(String content, String state, String city, String postedBy,
                                 String contact, Customer customer, MainCategory category) {
        PosterAd ad = new PosterAd();
        ad.setContent(content);
        ad.setState(state);
        ad.setCity(city);
        ad.setPostedBy(postedBy);
        ad.setContactOne(contact);
        ad.setCustomer(customer);
        ad.setMainCategory(category);
        ad.setStatus(AdStatus.PUBLISHED);
        ad.setIsActive(true);
        ad.setDates(List.of("2024-12-01", "2025-12-31"));
        posterAdRepository.save(ad);
    }

    private void createVideoAd(String content, String state, String city, String postedBy,
                                String contact, Customer customer, MainCategory category) {
        VideoAd ad = new VideoAd();
        ad.setContent(content);
        ad.setState(state);
        ad.setCity(city);
        ad.setPostedBy(postedBy);
        ad.setContactOne(contact);
        ad.setCustomer(customer);
        ad.setMainCategory(category);
        ad.setStatus(AdStatus.PUBLISHED);
        ad.setIsActive(true);
        ad.setDates(List.of("2024-12-01", "2025-12-31"));
        videoAdRepository.save(ad);
    }
}
