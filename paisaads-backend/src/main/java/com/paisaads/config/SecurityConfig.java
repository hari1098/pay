package com.paisaads.config;

import com.paisaads.security.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/users/register-customer").permitAll()
                .requestMatchers("/categories/tree").permitAll()
                .requestMatchers("/categories/main/**").permitAll()
                .requestMatchers("/configurations/**").permitAll()
                .requestMatchers("/line-ad/today").permitAll()
                .requestMatchers("/line-ad").permitAll()
                .requestMatchers("/line-ad/search").permitAll()
                .requestMatchers("/line-ad/category/**").permitAll()
                .requestMatchers("/line-ad/*").permitAll()
                .requestMatchers("/poster-ad/today").permitAll()
                .requestMatchers("/poster-ad").permitAll()
                .requestMatchers("/poster-ad/search").permitAll()
                .requestMatchers("/poster-ad/category/**").permitAll()
                .requestMatchers("/poster-ad/*").permitAll()
                .requestMatchers("/video-ad/today").permitAll()
                .requestMatchers("/video-ad").permitAll()
                .requestMatchers("/video-ad/search").permitAll()
                .requestMatchers("/video-ad/category/**").permitAll()
                .requestMatchers("/video-ad/*").permitAll()
                .requestMatchers("/images/upload").permitAll()
                .requestMatchers("/ad-position/ad-slots/**").permitAll()
                .requestMatchers("/ad-comments/ad/**").permitAll()
                .requestMatchers("/h2-console/**").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        // Allow H2 console frames
        http.headers(headers -> headers.frameOptions(frameOptions -> frameOptions.sameOrigin()));

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
