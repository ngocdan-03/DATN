package com.NgocDan.BACKEND.controller;

import java.time.LocalDate;

import jakarta.validation.Valid;

import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.NgocDan.BACKEND.dto.request.NewsRequest;
import com.NgocDan.BACKEND.dto.response.*;
import com.NgocDan.BACKEND.enums.*;
import com.NgocDan.BACKEND.service.AdminService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminController {

    AdminService adminService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasAuthority('ADMIN_DASHBOARD_VIEW')")
    public ApiResponse<AdminDashboardResponse> getDashboard(@RequestParam(defaultValue = "0") int year) {

        // Nếu không truyền year thì lấy năm hiện tại
        int targetYear = year == 0 ? LocalDate.now().getYear() : year;

        return ApiResponse.<AdminDashboardResponse>builder()
                .code(1000)
                .message("Lấy dashboard thành công!")
                .result(adminService.getDashboard(targetYear))
                .build();
    }

    // ----------quản lý post----------

    // lấy danh sách
    @GetMapping("/posts")
    @PreAuthorize("hasAuthority('ADMIN_GETALL_POSTS')")
    public ApiResponse<PageResponse<AdminPostResponse>> getAllPosts(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "status", required = false) PostStatus status,
            @RequestParam(value = "wardId", required = false) Integer wardId,
            @RequestParam(value = "propertyType", required = false) PropertyType propertyType,
            @RequestParam(value = "listingType", required = false) ListingType listingType,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "6") int size) {

        return ApiResponse.<PageResponse<AdminPostResponse>>builder()
                .code(1000)
                .message("Lấy danh sách bài đăng thành công!")
                .result(adminService.getAllPosts(keyword, status, wardId, propertyType, listingType, page, size))
                .build();
    }

    // duyệt bài đăng
    @PostMapping("/posts/{postId}/approve")
    @PreAuthorize("hasAuthority('ADMIN_APPROVE_POST')")
    public ApiResponse<Void> approvePost(@PathVariable Long postId) {
        adminService.approvePost(postId);
        return ApiResponse.<Void>builder()
                .code(1000)
                .message("Duyệt bài đăng thành công!")
                .build();
    }

    // từ chối bài đăng
    @PostMapping("/posts/{postId}/reject")
    @PreAuthorize("hasAuthority('ADMIN_REJECT_POST')")
    public ApiResponse<Void> rejectPost(@PathVariable Long postId) {
        adminService.rejectPost(postId);
        return ApiResponse.<Void>builder()
                .code(1000)
                .message("Từ chối bài đăng thành công!")
                .build();
    }

    // xóa bài đăng
    @DeleteMapping("/posts/{postId}")
    @PreAuthorize("hasAuthority('ADMIN_DELETE_POST')")
    public ApiResponse<Void> deletePost(@PathVariable Long postId) {
        adminService.deletePost(postId);
        return ApiResponse.<Void>builder()
                .code(1000)
                .message("Xóa bài đăng thành công!")
                .build();
    }

    // ----------quản lý tài khoản----------

    // lấy all user với filter
    @GetMapping("/users")
    @PreAuthorize("hasAuthority('ADMIN_GETALL_USERS')")
    public ApiResponse<PageResponse<AdminUserResponse>> getAllUsers(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "isVerified", required = false) Boolean isVerified,
            @RequestParam(value = "isLocked", required = false) Boolean isLocked,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "6") int size) {

        return ApiResponse.<PageResponse<AdminUserResponse>>builder()
                .code(1000)
                .message("Lấy danh sách user thành công!")
                .result(adminService.getAllUsers(keyword, isVerified, isLocked, page, size))
                .build();
    }

    // laays chi tiết user
    @GetMapping("/users/{userId}")
    @PreAuthorize("hasAuthority('ADMIN_GET_USER_DETAIL')")
    public ApiResponse<AdminUserDetailResponse> getUserDetail(
            @PathVariable Long userId,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "5") int size) {
        return ApiResponse.<AdminUserDetailResponse>builder()
                .code(1000)
                .message("Lấy chi tiết user thành công!")
                .result(adminService.getUserDetail(userId, page, size))
                .build();
    }
    // khóa/mở khóa user
    @PostMapping("/users/{userId}/toggle-lock")
    @PreAuthorize("hasAuthority('ADMIN_TOGGLE_LOCK_USER')")
    public ApiResponse<Void> toggleLockUser(@PathVariable Long userId) {
        adminService.toggleLockUser(userId);
        return ApiResponse.<Void>builder()
                .code(1000)
                .message("Cập nhật trạng thái tài khoản thành công!")
                .build();
    }

    // ---------- quản lý news ----------
    // lấy danh sách tin tức cho admin
    @GetMapping("/news")
    @PreAuthorize("hasAuthority('ADMIN_GETALL_NEWS')")
    public ApiResponse<PageResponse<AdminNewsResponse>> getAllNewsForAdmin(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "category", required = false) NewsCategory category,
            @RequestParam(value = "status", required = false) NewsStatus status,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "6") int size) {

        return ApiResponse.<PageResponse<AdminNewsResponse>>builder()
                .code(1000)
                .message("Lấy danh sách tin tức thành công!")
                .result(adminService.getAllNewsForAdmin(keyword, category, status, page, size))
                .build();
    }

    // lấy chi tiết tin tức cho admin
    @GetMapping("/news/{newsId}")
    @PreAuthorize("hasAuthority('ADMIN_GET_NEWS_DETAIL')")
    public ApiResponse<AdminNewsDetailResponse> getNewsDetailForAdmin(@PathVariable Long newsId) {
        return ApiResponse.<AdminNewsDetailResponse>builder()
                .code(1000)
                .message("Lấy chi tiết tin tức thành công!")
                .result(adminService.getNewsDetailForAdmin(newsId))
                .build();
    }

    // tạo tin tức: gửi NewsRequest + file ảnh trong cùng request
    @PostMapping(value = "/news", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('ADMIN_CREATE_NEWS')")
    public ApiResponse<Void> createNews(
            @RequestPart("data") @Valid NewsRequest request, @RequestPart("thumbnail") MultipartFile thumbnailFile) {

        adminService.createNews(request, thumbnailFile);

        return ApiResponse.<Void>builder()
                .code(1000)
                .message("Tạo tin tức thành công!")
                .build();
    }

    // cập nhật nội dung tin tức, không cập nhật ảnh
    @PutMapping("/news/{newsId}")
    @PreAuthorize("hasAuthority('ADMIN_UPDATE_NEWS')")
    public ApiResponse<Void> updateNewsInfo(@PathVariable Long newsId, @RequestBody @Valid NewsRequest request) {

        adminService.updateNewsInfo(newsId, request);

        return ApiResponse.<Void>builder()
                .code(1000)
                .message("Cập nhật tin tức thành công!")
                .build();
    }

    // cập nhật riêng ảnh tin tức
    @PutMapping(value = "/news/{newsId}/thumbnail", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('ADMIN_UPDATE_NEWS')")
    public ApiResponse<String> updateNewsThumbnail(
            @PathVariable Long newsId, @RequestParam("file") MultipartFile file) {

        return ApiResponse.<String>builder()
                .code(1000)
                .message("Cập nhật ảnh tin tức thành công!")
                .result(adminService.updateNewsThumbnail(newsId, file))
                .build();
    }

    // ẩn tin tức
    @DeleteMapping("/news/{newsId}")
    @PreAuthorize("hasAuthority('ADMIN_UPDATE_STATUS_NEWS')")
    public ApiResponse<Void> hideNews(@PathVariable Long newsId) {
        adminService.hideNews(newsId);

        return ApiResponse.<Void>builder()
                .code(1000)
                .message("Ẩn tin tức thành công!")
                .build();
    }

    // hiện lại tin tức
    @PostMapping("/news/{newsId}/show")
    @PreAuthorize("hasAuthority('ADMIN_UPDATE_STATUS_NEWS')")
    public ApiResponse<Void> showNews(@PathVariable Long newsId) {
        adminService.showNews(newsId);

        return ApiResponse.<Void>builder()
                .code(1000)
                .message("Hiển thị tin tức thành công!")
                .build();
    }

    // ---------- quản lý tài chính----------
    @GetMapping("/revenue")
    @PreAuthorize("hasAuthority('ADMIN_VIEW_REVENUE')")
    public ApiResponse<AdminRevenueResponse> getRevenue(@RequestParam(value = "year", defaultValue = "0") int year) {

        int targetYear = year == 0 ? LocalDate.now().getYear() : year;

        return ApiResponse.<AdminRevenueResponse>builder()
                .code(1000)
                .message("Lấy thống kê doanh thu thành công!")
                .result(adminService.getRevenue(targetYear))
                .build();
    }

    // lấy all giao dịch
    @GetMapping("/transactions")
    @PreAuthorize("hasAuthority('ADMIN_GETALL_TRANSACTIONS')")
    public ApiResponse<PageResponse<AdminTransactionResponse>> getAllTransactions(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "type", required = false) TransactionType type,
            @RequestParam(value = "status", required = false) TransactionStatus status,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "5") int size) {

        return ApiResponse.<PageResponse<AdminTransactionResponse>>builder()
                .code(1000)
                .message("Lấy lịch sử giao dịch thành công!")
                .result(adminService.getAllTransactions(keyword, type, status, page, size))
                .build();
    }

    // lấy chi tiết giao dịch
    @GetMapping("/transactions/{id}")
    @PreAuthorize("hasAuthority('ADMIN_GET_TRANSACTION_DETAIL')")
    public ApiResponse<TransactionDetailResponse> getTransactionDetail(@PathVariable Long id) {
        return ApiResponse.<TransactionDetailResponse>builder()
                .code(1000)
                .message("Lấy chi tiết giao dịch thành công!")
                .result(adminService.getTransactionDetail(id))
                .build();
    }
}
