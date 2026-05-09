package com.paisaads.controller;

import com.paisaads.service.ConfigurationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/configurations")
public class ConfigurationController {

    private final ConfigurationService configurationService;

    public ConfigurationController(ConfigurationService configurationService) {
        this.configurationService = configurationService;
    }

    @GetMapping("/{key}")
    public ResponseEntity<Map<String, String>> getConfiguration(@PathVariable String key) {
        String value = configurationService.getConfiguration(key);
        return ResponseEntity.ok(Map.of("key", key, "value", value));
    }

    @PostMapping("/{key}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ResponseEntity<Map<String, String>> updateConfiguration(@PathVariable String key,
                                                                    @RequestBody Map<String, String> body) {
        String value = body.get("value");
        String updated = configurationService.updateConfiguration(key, value);
        return ResponseEntity.ok(Map.of("key", key, "value", updated));
    }
}
