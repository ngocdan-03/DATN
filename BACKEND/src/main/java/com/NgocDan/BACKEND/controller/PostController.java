package com.NgocDan.BACKEND.controller;

import com.NgocDan.BACKEND.dto.request.PostCreateRequest;
import com.NgocDan.BACKEND.dto.response.*;
import com.NgocDan.BACKEND.enums.LegalStatus;
import com.NgocDan.BACKEND.enums.ListingType;
import com.NgocDan.BACKEND.enums.PropertyType;
import com.NgocDan.BACKEND.service.NewsService;
import com.NgocDan.BACKEND.service.PostService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostController {
    PostService postService;

    @GetMapping("/all")
    public ApiResponse<PageResponse<PostResponse>> getAll(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "6") int size
    ) {
        return ApiResponse.<PageResponse<PostResponse>>builder()
                .code(1000)
                .message("Lấy danh sách bài viết thành công!")
                .result(postService.getAllPosts(page, size))
                .build();
    }

    // get với bộ lọc
    @GetMapping("/search")
    public ApiResponse<PageResponse<PostResponse>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer wardId,
            @RequestParam(required = false) PropertyType propertyType,
            @RequestParam(required = false) ListingType listingType,
            @RequestParam(required = false) LegalStatus legalStatus,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) BigDecimal minArea,
            @RequestParam(required = false) BigDecimal maxArea,
            @RequestParam(required = false) Integer minBedrooms,
            @RequestParam(required = false) Integer minBathrooms,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "6") int size
    ) {
        return ApiResponse.<PageResponse<PostResponse>>builder()
                .result(postService.getFilteredPosts(keyword, wardId, propertyType,
                        listingType, legalStatus, minPrice, maxPrice,
                        minArea, maxArea, minBedrooms, minBathrooms, page, size))
                .build();
    }

    // get chi tiết bài đăng
    @GetMapping("/{id}")
    public ApiResponse<PostDetailResponse> getDetail(@PathVariable Long id) {
        return ApiResponse.<PostDetailResponse>builder()
                .code(1000)
                .result(postService.getPostDetail(id))
                .message("Lấy chi tiết bài đăng thành công!")
                .build();
    }

    // lưu
    @PostMapping("/{id}/favorite")
    @PreAuthorize("hasAuthority('SAVE_POST')")
    public ApiResponse<Void> toggleFavorite(@PathVariable Long id){
        postService.toggleFavorite(id);
        return ApiResponse .<Void>builder()
                .code(1000)
                .message("Cập nhật trạng thái yêu thích thành công!")
                .build();
    }

    // liên lạc
    @PostMapping("/{id}/contact")
    @PreAuthorize("hasAuthority('CONTACT_OWNER')")
    public ApiResponse<Void> recordContact(@PathVariable Long id) {
        postService.recordContact(id);
        return ApiResponse.<Void>builder()
                .code(1000)
                .message("Đã ghi nhận hành động liên hệ")
                .build();
    }

    // đăng tin mới
    @PostMapping("/create")
    @PreAuthorize("hasAuthority('CREATE_POST')")
    public ApiResponse<Void> createPost(@RequestBody @Valid PostCreateRequest request) {

        // Gọi Service xử lý logic (Lấy UserId từ Token, Tìm Ward, Lưu Post & Images)
        postService.createPost(request);

        // Trả về code 1000 mặc định (Thành công)
        return ApiResponse.<Void>builder()
                .code(1000)
                .message("Dang tin thanh cong, vui long cho admin duyet!")
                .build();
    }
}
