package com.NgocDan.BACKEND.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class PasswordEncoderConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        // Độ mạnh (strength) là 10 là mức chuẩn hiện nay
        return new BCryptPasswordEncoder(10);
    }
}
