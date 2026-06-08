package com.NgocDan.BACKEND.controller;

import com.NgocDan.BACKEND.dto.response.ApiResponse;
import com.NgocDan.BACKEND.dto.response.PostResponse;
import com.NgocDan.BACKEND.dto.response.RecommendationListResponse;
import com.NgocDan.BACKEND.service.RecommendService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/recommend")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RecommendController {

    RecommendService recommendService;

    @PostMapping("/personal")
    public ApiResponse<RecommendationListResponse> getPersonalRecommendations() {
        return ApiResponse.<RecommendationListResponse>builder()
                .code(1000)
                .message("Lấy gợi ý cá nhân hóa thành công!")
                .result(recommendService.getPersonalRecommendations())
                .build();
    }

    @PostMapping("/similar/{postId}")
    public ApiResponse<RecommendationListResponse> getSimilarPosts(
            @PathVariable Long postId) {
        return ApiResponse.<RecommendationListResponse>builder()
                .code(1000)
                .message("Lấy danh sách bài viết tương tự thành công!")
                .result(recommendService.getSimilarPosts(postId))
                .build();
    }
}
