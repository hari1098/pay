package com.paisaads.service;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ConfigurationService {

    private final Map<String, String> configurations = new ConcurrentHashMap<>();

    public ConfigurationService() {
        // Default configuration values
        configurations.put("about-us", "PaisaAds is a leading classified ads platform connecting buyers and sellers across India. Post your ads for free and reach millions of potential customers.");
        configurations.put("contact-page", "Email: support@paisaads.com\nPhone: +91-XXXXXXXXXX\nAddress: PaisaAds HQ, India");
        configurations.put("faq", "Q: How do I post an ad?\nA: Register/Login, select category, fill details, and submit for review.\n\nQ: How long does review take?\nA: Usually within 24 hours.\n\nQ: How do I edit my ad?\nA: Go to My Ads, click edit on the ad you want to modify.");
        configurations.put("privacy-policy", "We value your privacy. Your personal information is stored securely and never shared with third parties without your consent. We use cookies to improve your experience.");
        configurations.put("terms-and-conditions", "By using PaisaAds, you agree to post only legitimate ads. Fake, misleading, or illegal content will be removed and accounts may be suspended. All ads are subject to review.");
        configurations.put("search-slogan", "Find anything, sell everything - India's favorite classifieds!");
        configurations.put("ad-pricing", "{\"lineAd\":{\"daily\":99,\"weekly\":499,\"monthly\":1499},\"posterAd\":{\"daily\":199,\"weekly\":999,\"monthly\":2999},\"videoAd\":{\"daily\":299,\"weekly\":1499,\"monthly\":4499}}");
    }

    public String getConfiguration(String key) {
        return configurations.getOrDefault(key, "Configuration not found for key: " + key);
    }

    public String updateConfiguration(String key, String value) {
        configurations.put(key, value);
        return value;
    }

    public Map<String, String> getAllConfigurations() {
        return new ConcurrentHashMap<>(configurations);
    }
}
