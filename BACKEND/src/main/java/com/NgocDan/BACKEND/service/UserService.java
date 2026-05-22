package com.NgocDan.BACKEND.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.NgocDan.BACKEND.dto.request.PasswordChangeRequest;
import com.NgocDan.BACKEND.dto.request.UserUpdateRequest;
import com.NgocDan.BACKEND.dto.response.UserDashboardResponse;
import com.NgocDan.BACKEND.exception.AppException;
import com.NgocDan.BACKEND.exception.ErrorCode;
import com.NgocDan.BACKEND.mapper.UserMapper;
import com.NgocDan.BACKEND.repository.UserRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {
    UserRepository userRepository;
    UserMapper userMapper;
    CloudinaryService cloudinaryService;
    PasswordEncoder passwordEncoder;

    public UserDashboardResponse getMyInfo() {
        // lấy id từ Security Context
        String sub = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = Long.parseLong(sub);

        // lấy user
        var user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return userMapper.toDashboardResponse(user);
    }

    // update
    // upload avatar
    public String uploadAvatar(MultipartFile file) {
        // lấy id từ Security Context
        String sub = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = Long.parseLong(sub);

        // lấy user
        var user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Xóa avatar cũ trên Cloudinary nếu có
        if (user.getAvatarUrl() != null && !user.getAvatarUrl().contains("default.jpg")) {
            cloudinaryService.deleteFileByUrl(user.getAvatarUrl());
        }
        // Upload ảnh mới
        String newUrl = cloudinaryService.uploadFile(file, "users");
        // Cập nhật URL mới vào user và lưu
        user.setAvatarUrl(newUrl);
        userRepository.save(user);
        return newUrl;
    }

    public UserDashboardResponse updateMyInfo(UserUpdateRequest request) {
        // lấy id từ Security Context
        String sub = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = Long.parseLong(sub);

        // lấy user
        var user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Kiểm tra nếu số điện thoại mới đã được người khác sử dụng
        if (userRepository.existsByPhoneAndIdNot(request.getPhone(), userId)) {
            throw new AppException(ErrorCode.PHONE_EXISTED); // Dan tạo thêm ErrorCode này nhé
        }

        // Map dữ liệu (Bao gồm cả avatarUrl mới)
        userMapper.updateUser(user, request);

        // Lưu vào DB và trả về kết quả
        return userMapper.toDashboardResponse(userRepository.save(user));
    }

    // Hàm đổi mật khẩu
    public void changePassword(PasswordChangeRequest request) {
        // lấy id từ Security Context
        String sub = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = Long.parseLong(sub);
        // lấy user
        var user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Kiểm tra mật khẩu cũ có đúng không
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.OLD_PASSWORD_INCORRECT);
        }

        // check nếu mật khẩu mới giống mật khẩu cũ
        if (request.getOldPassword().equals(request.getNewPassword())) {
            throw new AppException(ErrorCode.NEW_PASSWORD_SAME_AS_OLD);
        }

        // Mã hóa mật khẩu mới và lưu vào DB
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
