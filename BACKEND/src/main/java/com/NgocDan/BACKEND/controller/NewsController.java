package com.NgocDan.BACKEND.controller;

import org.springframework.web.bind.annotation.*;

import com.NgocDan.BACKEND.dto.response.ApiResponse;
import com.NgocDan.BACKEND.dto.response.NewsDetailResponse;
import com.NgocDan.BACKEND.dto.response.NewsResponse;
import com.NgocDan.BACKEND.dto.response.PageResponse;
import com.NgocDan.BACKEND.enums.NewsCategory;
import com.NgocDan.BACKEND.service.NewsService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/news")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NewsController {
    NewsService newsService;

    @GetMapping("/all")
    public ApiResponse<PageResponse<NewsResponse>> getAllNews(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "category", required = false) NewsCategory category, // Thêm dòng này
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "9") int size) {
        return ApiResponse.<PageResponse<NewsResponse>>builder()
                .code(1000)
                .result(newsService.getAllNews(keyword, category, page, size))
                .message("Lấy danh sách tin tức thành công!")
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<NewsDetailResponse> getNewsDetail(@PathVariable Long id) {
        return ApiResponse.<NewsDetailResponse>builder()
                .code(1000)
                .message("Lấy chi tiết tin tức thành công!")
                .result(newsService.getNewsById(id))
                .build();
    }
}
