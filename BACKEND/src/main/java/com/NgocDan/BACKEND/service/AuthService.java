package com.NgocDan.BACKEND.service;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

import jakarta.transaction.Transactional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

import com.NgocDan.BACKEND.configuration.JwtConfig;
import com.NgocDan.BACKEND.dto.request.*;
import com.NgocDan.BACKEND.dto.response.LoginResponse;
import com.NgocDan.BACKEND.dto.response.RefreshResponse;
import com.NgocDan.BACKEND.exception.AppException;
import com.NgocDan.BACKEND.exception.ErrorCode;
import com.NgocDan.BACKEND.mapper.UserMapper;
import com.NgocDan.BACKEND.model.User;
import com.NgocDan.BACKEND.model.redis.InvalidatedToken;
import com.NgocDan.BACKEND.model.redis.OtpEmail;
import com.NgocDan.BACKEND.model.redis.RefreshToken;
import com.NgocDan.BACKEND.repository.RoleRepository;
import com.NgocDan.BACKEND.repository.UserRepository;
import com.NgocDan.BACKEND.service.redis.EmailStreamProducer;
import com.NgocDan.BACKEND.service.redis.InvalidatedTokenRedisService;
import com.NgocDan.BACKEND.service.redis.OtpRedisService;
import com.NgocDan.BACKEND.service.redis.RefreshTokenRedisService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthService {
    UserRepository userRepository;
    RoleRepository roleRepository;
    PasswordEncoder passwordEncoder;
    JwtConfig jwtConfig;

    RefreshTokenRedisService refreshTokenRedisService;
    InvalidatedTokenRedisService invalidatedTokenRedisService;
    OtpRedisService otpRedisService;
    UserMapper userMapper;

    EmailStreamProducer emailStreamProducer;

    SecureRandom secureRandom = new SecureRandom();

    // 1. Đăng ký tài khoản
    @Transactional
    public void register(UserRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) throw new AppException(ErrorCode.USER_EXISTED);
        if (userRepository.existsByPhone(request.getPhone())) throw new AppException(ErrorCode.PHONE_EXISTED);

        var role = roleRepository.findByName("USER").orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .roles(new HashSet<>(java.util.List.of(role)))
                .build();
        userRepository.save(user);
        sendOtp(user.getEmail(), "verify");
    }

    // 2. Đăng nhập
    public LoginResponse login(LoginRequest request) {
        var user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (user.getIsLocked()) throw new AppException(ErrorCode.USER_LOCKED);
        if (!user.getIsVerified()) throw new AppException(ErrorCode.USER_NOT_VERIFIED);
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword()))
            throw new AppException(ErrorCode.PASSWORD_INCORRECT);

        String jtiAT = UUID.randomUUID().toString();
        String jtiRT = UUID.randomUUID().toString();
        String familyId = UUID.randomUUID().toString();

        RefreshToken rt = RefreshToken.builder()
                .id(jtiRT)
                .userId(user.getId().toString())
                .familyId(familyId)
                .build();
        refreshTokenRedisService.save(rt, jwtConfig.getRefreshDuration());

        return LoginResponse.builder()
                .accessToken(generateAT(user, jtiAT, familyId))
                .refreshToken(generateRT(
                        user,
                        jtiRT,
                        familyId,
                        Instant.now()
                                .plus(jwtConfig.getRefreshDuration(), ChronoUnit.SECONDS)
                                .toEpochMilli()))
                .authenticated(true)
                .user(userMapper.toUserResponse(user))
                .build();
    }

    // 3. Làm mới Token (Refresh)
    public RefreshResponse refreshToken(RefreshRequest request) {
        var signedJWT = verifyToken(request.getRefreshToken());
        try {
            String jti = signedJWT.getJWTClaimsSet().getJWTID();
            String familyId = signedJWT.getJWTClaimsSet().getStringClaim("familyId");
            String userId = signedJWT.getJWTClaimsSet().getSubject();
            long fixedExp = signedJWT.getJWTClaimsSet().getLongClaim("fixed_exp");

            var storedToken = refreshTokenRedisService.findById(jti);
            if (storedToken == null) {
                refreshTokenRedisService.deleteFamily(familyId);
                throw new AppException(ErrorCode.TOKEN_REUSE_DETECTED);
            }

            refreshTokenRedisService.delete(jti);
            String newJtiAt = UUID.randomUUID().toString();
            String newJtiRt = UUID.randomUUID().toString();
            var user = userRepository
                    .findById(Long.parseLong(userId))
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

            long ttl = Math.max(1, (fixedExp - System.currentTimeMillis()) / 1000);
            refreshTokenRedisService.save(
                    RefreshToken.builder()
                            .id(newJtiRt)
                            .userId(userId)
                            .familyId(familyId)
                            .build(),
                    ttl);

            return RefreshResponse.builder()
                    .accessToken(generateAT(user, newJtiAt, familyId))
                    .refreshToken(generateRT(user, newJtiRt, familyId, fixedExp))
                    .authenticated(true)
                    .build();
        } catch (AppException e) {
            throw e;
        } catch (Exception e) {
            throw new AppException(ErrorCode.INVALID_TOKEN);
        }
    }

    // 4. Đăng xuất
    public void logout(LogoutRequest request) {
        try {
            var signedJWT = parseToken(request.getAccessToken());
            String jti = signedJWT.getJWTClaimsSet().getJWTID();
            Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();
            String familyId = signedJWT.getJWTClaimsSet().getStringClaim("familyId");

            if (familyId != null) refreshTokenRedisService.deleteFamily(familyId);

            long currentTime = System.currentTimeMillis();
            // Chỉ lưu Blacklist nếu AT chưa hết hạn
            if (expiryTime.getTime() > currentTime) {
                long ttl = (expiryTime.getTime() - currentTime) / 1000;
                invalidatedTokenRedisService.save(
                        InvalidatedToken.builder().id(jti).build(), ttl);
            }
        } catch (AppException e) {
            throw e;
        } catch (Exception e) {
            throw new AppException(ErrorCode.INVALID_TOKEN);
        }
    }

    // 5. Gửi mã OTP
    public void sendOtp(String email, String purpose) {
        if (otpRedisService.isCooldownExists(email, purpose)) throw new AppException(ErrorCode.OTP_TOO_FREQUENT);
        userRepository.findByEmail(email).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        String otp = String.format("%06d", secureRandom.nextInt(1000000));
        OtpEmail otpEmail =
                OtpEmail.builder().email(email).otp(otp).purpose(purpose).build();

        otpRedisService.save(otpEmail, 180L); // 3 phút
        otpRedisService.saveCooldown(email, purpose, 60);
        emailStreamProducer.publishOtpEmail(otpEmail);
    }

    // 6. Xác thực tài khoản
    @Transactional
    public void verifyAccount(VerifyAccountRequest request) {
        String savedOtp = otpRedisService.getOtp(request.getEmail(), "verify");
        if (savedOtp == null || !savedOtp.equals(request.getCode())) throw new AppException(ErrorCode.INVALID_OTP);

        var user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        user.setIsVerified(true);
        userRepository.save(user);
        otpRedisService.deleteOtp(request.getEmail(), "verify");
    }

    // 7. Đặt lại mật khẩu
    public void resetPassword(ResetPasswordRequest request) {
        String savedOtp = otpRedisService.getOtp(request.getEmail(), "forgot");
        if (savedOtp == null || !savedOtp.equals(request.getCode())) throw new AppException(ErrorCode.INVALID_OTP);

        var user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        otpRedisService.deleteOtp(request.getEmail(), "forgot");
    }

    // 8. XÁC THỰC VÀ GIẢI MÃ TOKEN
    private SignedJWT verifyToken(String token) {
        try {
            JWSVerifier verifier = new MACVerifier(jwtConfig.getSignerKey().getBytes());
            SignedJWT signedJWT = SignedJWT.parse(token);
            Date expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();
            boolean verified = signedJWT.verify(verifier);

            if (!(verified && expirationTime != null && expirationTime.after(new Date()))) {
                throw new AppException(ErrorCode.INVALID_TOKEN);
            }
            return signedJWT;
        } catch (AppException e) {
            throw e;
        } catch (java.text.ParseException | JOSEException e) {
            throw new AppException(ErrorCode.INVALID_TOKEN);
        }
    }

    // 9. parseToken
    private SignedJWT parseToken(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWSVerifier verifier = new MACVerifier(jwtConfig.getSignerKey().getBytes());

            // Chỉ kiểm tra chữ ký (Signature), không kiểm tra thời gian (Expiration)
            if (!signedJWT.verify(verifier)) {
                throw new AppException(ErrorCode.INVALID_TOKEN);
            }
            return signedJWT;
        } catch (Exception e) {
            throw new AppException(ErrorCode.INVALID_TOKEN);
        }
    }

    // 10. Ký Token
    private String signToken(JWTClaimsSet claims) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
        Payload payload = new Payload(claims.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);
        try {
            jwsObject.sign(new MACSigner(jwtConfig.getSignerKey().getBytes()));
            return jwsObject.serialize();
        } catch (AppException e) {
            throw e;
        } catch (JOSEException e) {
            throw new AppException(ErrorCode.TOKEN_SIGNING_FAILED);
        }
    }

    // 11. Tạo Access Token
    public String generateAT(User user, String jti, String familyId) {
        Instant now = Instant.now();
        JWTClaimsSet claims = new JWTClaimsSet.Builder()
                .subject(user.getId().toString())
                .issueTime(new Date(now.toEpochMilli()))
                .expirationTime(new Date(now.plus(jwtConfig.getValidDuration(), ChronoUnit.SECONDS)
                        .toEpochMilli()))
                .jwtID(jti)
                .claim("familyId", familyId)
                .claim("scope", buildScope(user))
                .build();
        return signToken(claims);
    }

    // 12. Tạo Refresh Token
    public String generateRT(User user, String jti, String familyId, long fixedExp) {
        JWTClaimsSet claims = new JWTClaimsSet.Builder()
                .subject(user.getId().toString())
                .issueTime(new Date())
                .expirationTime(new Date(fixedExp))
                .jwtID(jti)
                .claim("familyId", familyId)
                .claim("fixed_exp", fixedExp)
                .build();
        return signToken(claims);
    }

    // 13. Xây dựng Scope (Phân quyền)
    public String buildScope(User user) {
        StringJoiner sj = new StringJoiner(" ");
        if (!CollectionUtils.isEmpty(user.getRoles())) {
            user.getRoles().forEach(role -> {
                sj.add("ROLE_" + role.getName());
                if (!CollectionUtils.isEmpty(role.getPermissions()))
                    role.getPermissions().forEach(p -> sj.add(p.getName()));
            });
        }
        return sj.toString();
    }
}
