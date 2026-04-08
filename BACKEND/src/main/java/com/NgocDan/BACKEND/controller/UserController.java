package com.NgocDan.BACKEND.controller;

import com.NgocDan.BACKEND.dto.request.PasswordChangeRequest;
import com.NgocDan.BACKEND.dto.request.UserUpdateRequest;
import com.NgocDan.BACKEND.dto.response.ApiResponse;
import com.NgocDan.BACKEND.dto.response.UserDashboardResponse;
import com.NgocDan.BACKEND.service.UserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {
    UserService userService;

    @GetMapping("/my-info")
    @PreAuthorize("hasAuthority('GET_MY_INFO')")
    public ApiResponse<UserDashboardResponse> getMyInfo() {
        return ApiResponse.<UserDashboardResponse>builder()
                .code(1000)
                .message("Lấy thông tin cá nhân thành công!")
                .result(userService.getMyInfo())
                .build();
    }

    @PutMapping("/update-myInfo")
    @PreAuthorize("hasAuthority('UPDATE_MY_INFO')")
    public ApiResponse<UserDashboardResponse> updateInfo(@RequestBody @Valid UserUpdateRequest request) {
        return ApiResponse.<UserDashboardResponse>builder()
                .code(1000)
                .message("Cập nhật thông tin thành công!")
                .result(userService.updateMyInfo(request))
                .build();
    }

    // change password
    @PostMapping("/change-password")
    @PreAuthorize("hasAuthority('CHANGE_MY_PASSWORD')")
    public ApiResponse<Void> changePassword(@Valid @RequestBody PasswordChangeRequest request) {
        userService.changePassword(request);
        return ApiResponse.<Void>builder()
                .code(1000)
                .message("Thay đổi mật khẩu thành công!")
                .build();
    }
}
