package com.NgocDan.BACKEND.configuration;

import javax.crypto.spec.SecretKeySpec;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Component;

import com.NgocDan.BACKEND.repository.UserRepository;
import com.NgocDan.BACKEND.service.redis.InvalidatedTokenRedisService;

import lombok.RequiredArgsConstructor;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class CustomJwtDecoder implements JwtDecoder {

    @Value("${jwt.signerKey}")
    @NonFinal
    private String signerKey;

    private final InvalidatedTokenRedisService invalidatedTokenRedisService;
    private final UserRepository userRepository;

    // 🌟 BỔ SUNG: Tiêm Request hiện tại vào để đính kèm thông điệp lỗi vượt rào Filter
    @Autowired
    private HttpServletRequest request;

    private NimbusJwtDecoder nimbusJwtDecoder = null;

    @Override
    public Jwt decode(String token) throws JwtException {
        if (nimbusJwtDecoder == null) {
            SecretKeySpec secretKeySpec = new SecretKeySpec(signerKey.getBytes(), "HS512");
            nimbusJwtDecoder = NimbusJwtDecoder.withSecretKey(secretKeySpec)
                    .macAlgorithm(MacAlgorithm.HS512)
                    .build();
        }

        try {
            // 1. Check Signature & Expiration (Hết hạn sẽ ném lỗi "Jwt expired")
            Jwt jwt = nimbusJwtDecoder.decode(token);
            String jti = jwt.getId();

            // 2. Check Blacklist (Logout)
            if (invalidatedTokenRedisService.isExists(jti)) {
                throw new JwtException("TOKEN_REVOKED");
            }

            // 3. Check Real-time User Status
            String userId = jwt.getSubject();
            var user = userRepository
                    .findById(Long.parseLong(userId))
                    .orElseThrow(() -> new JwtException("USER_NOT_EXISTED"));

            if (user.getIsLocked()) {
                throw new JwtException("USER_LOCKED");
            }

            if (!user.getIsVerified()) {
                throw new JwtException("USER_NOT_VERIFIED");
            }

            return jwt;

        } catch (JwtException e) {
            // 🌟 BỔ SUNG: Lưu lại nguyên nhân thực tế vào Request Attribute trước khi ném ra ngoài
            request.setAttribute("jwt_exception_cause", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Lỗi hệ thống khi decode JWT: ", e);
            request.setAttribute("jwt_exception_cause", "INVALID_TOKEN");
            throw new JwtException("INVALID_TOKEN");
        }
    }
}
