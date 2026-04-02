package com.NgocDan.BACKEND.configuration;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    // Mảng các Endpoint công khai cho Auth
    private final String[] PUBLIC_ENDPOINTS_AUTH = {
        "/auth/**"
    };

    // Mảng các Endpoint cho khách vãn lai (Chỉ xem, không sửa xóa)
    private final String[] PUBLIC_ENDPOINTS_GUEST = {
        "/posts/all",  "/posts/search", "/posts/{id}",
        "/news/all", "/news/{id}",
        "/hello",
            "/payment/vnpay-callback", "/payment/vnpay-ipn"   // Test hệ thống
    };

    private final CustomJwtDecoder customJwtDecoder; // Khai báo decoder

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.cors(cors -> cors.configurationSource(corsConfigurationSource())); // Kích hoạt CORS

        httpSecurity.authorizeHttpRequests(request -> request.requestMatchers(HttpMethod.POST, PUBLIC_ENDPOINTS_AUTH)
                .permitAll() // Cho phép POST vào Auth
                .requestMatchers(HttpMethod.GET, PUBLIC_ENDPOINTS_GUEST)
                .permitAll() // Cho phép khách xem (GET)

                .anyRequest()
                .authenticated()); // Các yêu cầu khác phải có Token

        // Cấu hình Resource Server để đọc JWT (Dân sẽ bổ sung CustomJwtDecoder sau)
        httpSecurity.oauth2ResourceServer(oauth2 -> oauth2.jwt(jwtConfigurer -> jwtConfigurer
                        .decoder(customJwtDecoder)
                        .jwtAuthenticationConverter(jwtAuthenticationConverter()))
                .authenticationEntryPoint(new JwtAuthenticationEntryPoint()));

        // Xử lý lỗi 403 (Đăng nhập rồi nhưng sai quyền hạn)
        httpSecurity.exceptionHandling(exception -> exception.accessDeniedHandler(new JwtAccessDeniedHandler()));

        httpSecurity.csrf(AbstractHttpConfigurer::disable); // Tắt CSRF vì dùng Stateless JWT

        return httpSecurity.build();
    }

    // Cấu hình CORS để Frontend (React/Vue) gọi được API
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();

        corsConfiguration.setAllowedOrigins(
                List.of("http://localhost:3000", "http://localhost:5173")); // Domain Frontend
        corsConfiguration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        corsConfiguration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Cache-Control"));
        corsConfiguration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration); // Áp dụng cho toàn bộ API
        return source;
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();

        jwtGrantedAuthoritiesConverter.setAuthorityPrefix("");

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);

        return jwtAuthenticationConverter;
    }
}
