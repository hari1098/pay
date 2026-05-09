package com.paisaads.service;

import jakarta.annotation.PostConstruct;
import java.util.HashMap;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class ConfigurationService {

    private final Map<String, String> configMap = new HashMap<>();

    @PostConstruct
    public void init() {
        configMap.put("about-us", "Welcome to PaisaAds - Your trusted classified ads platform.");
        configMap.put("contact-page", "Contact us at support@paisaads.com");
        configMap.put("faq", "Frequently Asked Questions about PaisaAds.");
        configMap.put("privacy-policy", "Your privacy is important to us. Read our privacy policy.");
        configMap.put("terms-and-conditions", "By using PaisaAds, you agree to our terms and conditions.");
        configMap.put("search-slogan", "Find what you need, sell what you don't.");
        configMap.put("ad-pricing", "Line Ad: Free, Poster Ad: $5, Video Ad: $10");
    }

    public String getConfig(String key) {
        return configMap.get(key);
    }

    public void updateConfig(String key, String value) {
        configMap.put(key, value);
    }
}
