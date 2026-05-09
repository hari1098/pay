package com.paisaads.service;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ConfigurationService {

    private final Map<String, Object> store = new ConcurrentHashMap<>();

    public Object createTermsAndConditions(Map<String, Object> dto) {
        Map<String, Object> data = new HashMap<>(dto);
        data.put("lastUpdated", new Date());
        store.put("termsAndConditions", data);
        return data;
    }

    public Object getTermsAndConditions() { return store.getOrDefault("termsAndConditions", null); }

    public Object createOrUpdateAdPricing(Map<String, Object> dto) {
        Map<String, Object> data = new HashMap<>(dto);
        data.put("lastUpdated", new Date());
        data.put("isActive", true);
        store.put("adPricing", data);
        return data;
    }

    public Object getAdPricing() { return store.getOrDefault("adPricing", null); }
    public Object getAdPricingHistory() { return List.of(store.getOrDefault("adPricing", null)); }

    public Object createOrUpdatePrivacyPolicy(Map<String, Object> dto) {
        Map<String, Object> data = new HashMap<>(dto);
        data.put("lastUpdated", new Date()); data.put("isActive", true);
        store.put("privacyPolicy", data);
        return data;
    }

    public Object getPrivacyPolicy() { return store.getOrDefault("privacyPolicy", null); }
    public Object getPrivacyPolicyHistory() { return List.of(store.getOrDefault("privacyPolicy", null)); }

    public Object createOrUpdateSearchSlogan(Map<String, Object> dto) {
        Map<String, Object> data = new HashMap<>(dto);
        data.put("lastUpdated", new Date()); data.put("isActive", true);
        store.put("searchSlogan", data);
        return data;
    }

    public Object getSearchSlogan() { return store.getOrDefault("searchSlogan", null); }

    public Object createOrUpdateAboutUs(Map<String, Object> dto) {
        Map<String, Object> data = new HashMap<>(dto);
        data.put("lastUpdated", new Date()); data.put("isActive", true);
        store.put("aboutUs", data);
        return data;
    }

    public Object getAboutUs() { return store.getOrDefault("aboutUs", null); }

    public Object createOrUpdateFaq(Map<String, Object> dto) {
        Map<String, Object> data = new HashMap<>(dto);
        data.put("lastUpdated", new Date()); data.put("isActive", true);
        store.put("faq", data);
        return data;
    }

    public Object getFaq() { return store.getOrDefault("faq", null); }

    public Object getFaqByCategory(String category) {
        Object faq = store.get("faq");
        if (faq == null) return null;
        return faq; // Simplified - would filter questions by category
    }

    public Object addFaqQuestion(String question, String answer, String category) {
        Map<String, Object> faq = (Map<String, Object>) store.getOrDefault("faq", new HashMap<>());
        List<Map<String, Object>> questions = (List<Map<String, Object>>) faq.getOrDefault("questions", new ArrayList<>());
        Map<String, Object> q = new HashMap<>();
        q.put("question", question); q.put("answer", answer); q.put("category", category);
        q.put("order", questions.size() + 1); q.put("isActive", true);
        questions.add(q); faq.put("questions", questions);
        faq.put("lastUpdated", new Date());
        store.put("faq", faq);
        return faq;
    }

    @SuppressWarnings("unchecked")
    public Object updateFaqQuestion(int index, Map<String, Object> updates) {
        Map<String, Object> faq = (Map<String, Object>) store.getOrDefault("faq", new HashMap<>());
        List<Map<String, Object>> questions = (List<Map<String, Object>>) faq.getOrDefault("questions", new ArrayList<>());
        if (index >= 0 && index < questions.size()) {
            Map<String, Object> q = questions.get(index);
            if (updates.containsKey("question")) q.put("question", updates.get("question"));
            if (updates.containsKey("answer")) q.put("answer", updates.get("answer"));
            if (updates.containsKey("category")) q.put("category", updates.get("category"));
            if (updates.containsKey("order")) q.put("order", updates.get("order"));
            if (updates.containsKey("isActive")) q.put("isActive", updates.get("isActive"));
            faq.put("lastUpdated", new Date());
            store.put("faq", faq);
        }
        return faq;
    }

    public Object createOrUpdateContactPage(Map<String, Object> dto) {
        Map<String, Object> data = new HashMap<>(dto);
        data.put("lastUpdated", new Date()); data.put("isActive", true);
        store.put("contactPage", data);
        return data;
    }

    public Object getContactPage() { return store.getOrDefault("contactPage", null); }

    public Map<String, Object> getAllConfigurations() {
        Map<String, Object> result = new HashMap<>();
        result.put("termsAndConditions", getTermsAndConditions());
        result.put("adPricing", getAdPricing());
        result.put("privacyPolicy", getPrivacyPolicy());
        result.put("searchSlogan", getSearchSlogan());
        result.put("aboutUs", getAboutUs());
        result.put("faq", getFaq());
        result.put("contactPage", getContactPage());
        return result;
    }
}
