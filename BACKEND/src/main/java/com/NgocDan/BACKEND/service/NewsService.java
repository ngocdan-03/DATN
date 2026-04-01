package com.NgocDan.BACKEND.service;

import com.NgocDan.BACKEND.dto.response.NewsDetailResponse;
import com.NgocDan.BACKEND.dto.response.NewsResponse;
import com.NgocDan.BACKEND.dto.response.PageResponse;
import com.NgocDan.BACKEND.enums.NewsCategory;
import com.NgocDan.BACKEND.enums.NewsStatus;
import com.NgocDan.BACKEND.exception.AppException;
import com.NgocDan.BACKEND.exception.ErrorCode;
import com.NgocDan.BACKEND.mapper.NewsMapper;
import com.NgocDan.BACKEND.model.News;
import com.NgocDan.BACKEND.repository.NewsRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NewsService {
    NewsRepository newsRepository;
    NewsMapper newsMapper;

    public PageResponse<NewsResponse> getAllNews(String keyword, NewsCategory category, int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("createdAt").descending());

        log.info("Lọc tin tức với keyword: {} và category: {}", keyword, category);

        // Truyền thêm category vào hàm search
        Page<News> pageData = newsRepository.searchNewsCustom(keyword, category, NewsStatus.PUBLISHED, pageable);

        var listNews = pageData.getContent().stream()
                .map(newsMapper::toNewsResponse)
                .toList();

        return PageResponse.<NewsResponse>builder()
                .currentPage(page)
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .data(listNews)
                .build();
    }

    public NewsDetailResponse getNewsById(Long id) {
        News news = newsRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.NEWS_NOT_EXISTED));

        return newsMapper.toNewsDetailResponse(news);
    }
}
