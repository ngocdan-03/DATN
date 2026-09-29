package com.NgocDan.BACKEND.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.Collections;
import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.NgocDan.BACKEND.configuration.JwtConfig;
import com.NgocDan.BACKEND.dto.request.LoginRequest;
import com.NgocDan.BACKEND.dto.request.UserRegisterRequest;
import com.NgocDan.BACKEND.dto.response.LoginResponse;
import com.NgocDan.BACKEND.dto.response.UserResponse;
import com.NgocDan.BACKEND.exception.AppException;
import com.NgocDan.BACKEND.exception.ErrorCode;
import com.NgocDan.BACKEND.mapper.UserMapper;
import com.NgocDan.BACKEND.model.Role;
import com.NgocDan.BACKEND.model.User;
import com.NgocDan.BACKEND.repository.RoleRepository;
import com.NgocDan.BACKEND.repository.UserRepository;
import com.NgocDan.BACKEND.service.kafka.EmailKafkaProducer;
import com.NgocDan.BACKEND.service.redis.InvalidatedTokenRedisService;
import com.NgocDan.BACKEND.service.redis.OtpRedisService;
import com.NgocDan.BACKEND.service.redis.RefreshTokenRedisService;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    UserRepository userRepository;

    @Mock
    RoleRepository roleRepository;

    @Mock
    PasswordEncoder passwordEncoder;

    @Mock
    JwtConfig jwtConfig;

    @Mock
    RefreshTokenRedisService refreshTokenRedisService;

    @Mock
    InvalidatedTokenRedisService invalidatedTokenRedisService;

    @Mock
    OtpRedisService otpRedisService;

    @Mock
    UserMapper userMapper;

    @Mock
    EmailService emailService;

    @Mock
    EmailKafkaProducer emailKafkaProducer;

    @InjectMocks
    AuthService authService;

    // ============================================================
    // 1. TEST ĐĂNG KÝ (REGISTER)
    // ============================================================
    @Test
    @DisplayName("Đăng ký thành công: Mã hóa password, gán Role USER và lưu xuống DB")
    void register_Success() {
        // GIVEN: Dữ liệu đăng ký mới hợp lệ
        UserRegisterRequest request = UserRegisterRequest.builder()
                .email("dan2003@gmail.com")
                .password("MatKhau@123")
                .fullName("Bùi Ngọc Dân")
                .phone("0987654321")
                .build();

        Role userRole = Role.builder().name("USER").build();

        when(userRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(userRepository.existsByPhone(request.getPhone())).thenReturn(false);
        when(roleRepository.findByName("USER")).thenReturn(Optional.of(userRole));
        when(passwordEncoder.encode(request.getPassword())).thenReturn("encoded_secret_pass");

        // WHEN: Gọi đăng ký
        authService.register(request);

        // THEN: Kiểm tra User đã được lưu với mật khẩu đã băm
        verify(userRepository).save(argThat(user ->
                user.getEmail().equals("dan2003@gmail.com") &&
                        user.getPassword().equals("encoded_secret_pass") &&
                        user.getFullName().equals("Bùi Ngọc Dân") &&
                        user.getPhone().equals("0987654321")
        ));
    }

    @Test
    @DisplayName("Đăng ký thất bại khi Email đã tồn tại")
    void register_EmailAlreadyExists_ThrowsException() {
        // GIVEN
        UserRegisterRequest request = UserRegisterRequest.builder()
                .email("existed@gmail.com")
                .build();

        when(userRepository.existsByEmail("existed@gmail.com")).thenReturn(true);

        // WHEN & THEN: Ném lỗi USER_EXISTED
        AppException exception = assertThrows(AppException.class, () -> {
            authService.register(request);
        });

        assertEquals(ErrorCode.USER_EXISTED, exception.getErrorCode());
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Đăng ký thất bại khi Số điện thoại đã được đăng ký trước đó")
    void register_PhoneAlreadyExists_ThrowsException() {
        // GIVEN
        UserRegisterRequest request = UserRegisterRequest.builder()
                .email("valid@gmail.com")
                .phone("0912345678")
                .build();

        when(userRepository.existsByEmail("valid@gmail.com")).thenReturn(false);
        when(userRepository.existsByPhone("0912345678")).thenReturn(true);

        // WHEN & THEN: Ném lỗi PHONE_EXISTED
        AppException exception = assertThrows(AppException.class, () -> {
            authService.register(request);
        });

        assertEquals(ErrorCode.PHONE_EXISTED, exception.getErrorCode());
        verify(userRepository, never()).save(any());
    }

    // ============================================================
    // 2. TEST ĐĂNG NHẬP (LOGIN)
    // ============================================================
    @Test
    @DisplayName("Đăng nhập thành công: Trả về cặp AT, RT và thông tin User")
    void login_Success() {
        // GIVEN: User hợp lệ, mật khẩu đúng, đã xác thực email, không bị khóa
        LoginRequest request = LoginRequest.builder()
                .email("dan@gmail.com")
                .password("MatKhau@123")
                .build();

        User mockUser = User.builder()
                .id(1L)
                .email("dan@gmail.com")
                .password("encoded_pass")
                .isLocked(false)
                .isVerified(true)
                .roles(Collections.emptySet())
                .build();

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches("MatKhau@123", "encoded_pass")).thenReturn(true);

        // Key bí mật 64 ký tự chuẩn HMAC-SHA512
        when(jwtConfig.getSignerKey()).thenReturn("1234567890123456789012345678901234567890123456789012345678901234");
        when(jwtConfig.getValidDuration()).thenReturn(1800L);
        when(jwtConfig.getRefreshDuration()).thenReturn(604800L);
        when(userMapper.toUserResponse(mockUser)).thenReturn(new UserResponse());

        // WHEN
        LoginResponse response = authService.login(request);

        // THEN: Phải có Access Token, Refresh Token và authenticated = true
        assertNotNull(response);
        assertTrue(response.isAuthenticated());
        assertNotNull(response.getAccessToken());
        assertNotNull(response.getRefreshToken());
        verify(refreshTokenRedisService).save(any(), eq(604800L));
    }

    @Test
    @DisplayName("Đăng nhập thất bại khi Email không tồn tại")
    void login_UserNotFound_ThrowsException() {
        // GIVEN
        LoginRequest request = LoginRequest.builder().email("notfound@gmail.com").password("Pass@123").build();
        when(userRepository.findByEmail("notfound@gmail.com")).thenReturn(Optional.empty());

        // WHEN & THEN: Ném lỗi USER_NOT_EXISTED
        AppException exception = assertThrows(AppException.class, () -> {
            authService.login(request);
        });

        assertEquals(ErrorCode.USER_NOT_EXISTED, exception.getErrorCode());
    }

    @Test
    @DisplayName("Đăng nhập thất bại khi Sai mật khẩu")
    void login_WrongPassword_ThrowsException() {
        // GIVEN
        LoginRequest request = LoginRequest.builder().email("dan@gmail.com").password("WrongPass").build();
        User mockUser = User.builder()
                .id(1L)
                .email("dan@gmail.com")
                .password("encoded_pass")
                .isLocked(false)
                .isVerified(true)
                .build();

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches("WrongPass", "encoded_pass")).thenReturn(false);

        // WHEN & THEN: Ném lỗi PASSWORD_INCORRECT
        AppException exception = assertThrows(AppException.class, () -> {
            authService.login(request);
        });

        assertEquals(ErrorCode.PASSWORD_INCORRECT, exception.getErrorCode());
    }

    @Test
    @DisplayName("Đăng nhập thất bại khi Tài khoản chưa xác thực Email")
    void login_UserNotVerified_ThrowsException() {
        // GIVEN: isVerified = false
        LoginRequest request = LoginRequest.builder().email("dan@gmail.com").password("Pass@123").build();
        User mockUser = User.builder()
                .id(1L)
                .email("dan@gmail.com")
                .isLocked(false)
                .isVerified(false)
                .build();

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(mockUser));

        // WHEN & THEN: Ném lỗi USER_NOT_VERIFIED
        AppException exception = assertThrows(AppException.class, () -> {
            authService.login(request);
        });

        assertEquals(ErrorCode.USER_NOT_VERIFIED, exception.getErrorCode());
    }

    @Test
    @DisplayName("Đăng nhập thất bại khi Tài khoản đang bị Admin Khóa")
    void login_UserLocked_ThrowsException() {
        // GIVEN: isLocked = true
        LoginRequest request = LoginRequest.builder().email("dan@gmail.com").password("Pass@123").build();
        User mockUser = User.builder()
                .id(1L)
                .email("dan@gmail.com")
                .isLocked(true)
                .build();

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(mockUser));

        // WHEN & THEN: Ném lỗi USER_LOCKED
        AppException exception = assertThrows(AppException.class, () -> {
            authService.login(request);
        });

        assertEquals(ErrorCode.USER_LOCKED, exception.getErrorCode());
    }
}
