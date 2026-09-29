package com.NgocDan.BACKEND.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

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

@ExtendWith(MockitoExtension.class)
public class NewsServiceTest {

    @Mock
    NewsRepository newsRepository;

    @Mock
    NewsMapper newsMapper;

    @InjectMocks
    NewsService newsService;

    // ============================================================
    // 1. TEST LẤY TẤT CẢ TIN TỨC THEO BỘ LỌC (KEYWORD & CATEGORY)
    // ============================================================
    @Test
    @DisplayName("Lấy danh sách tin tức theo bộ lọc thành công")
    void getAllNews_Success() {
        // GIVEN: Giả lập 1 bài tin tức thuộc chuyên mục THI_TRUONG
        News mockNews = News.builder()
                .id(1L)
                .title("Giá đất nền phục hồi mạnh mẽ quý 3")
                .category(NewsCategory.LAW)
                .status(NewsStatus.PUBLISHED)
                .build();

        Page<News> mockPage = new PageImpl<>(List.of(mockNews), PageRequest.of(0, 9), 1);
        NewsResponse mockResponse = NewsResponse.builder()
                .id(1L)
                .title("Giá đất nền phục hồi mạnh mẽ quý 3")
                .build();

        when(newsRepository.searchNewsCustom(
                eq("đất nền"),
                eq(NewsCategory.LAW),
                eq(NewsStatus.PUBLISHED),
                any(Pageable.class)))
                .thenReturn(mockPage);

        when(newsMapper.toNewsResponse(mockNews)).thenReturn(mockResponse);

        // WHEN: Gọi hàm lọc tin tức
        PageResponse<NewsResponse> result = newsService.getAllNews("đất nền", NewsCategory.LAW, 1, 9);

        // THEN: Kiểm tra dữ liệu trả về
        assertNotNull(result);
        assertEquals(1, result.getCurrentPage());
        assertEquals(1, result.getTotalElements());
        assertEquals(1, result.getData().size());
        assertEquals("Giá đất nền phục hồi mạnh mẽ quý 3", result.getData().get(0).getTitle());
    }

    // ============================================================
    // 2. TEST XEM CHI TIẾT TIN TỨC
    // ============================================================
    @Test
    @DisplayName("Lấy chi tiết tin tức thành công khi ID tồn tại")
    void getNewsById_Success() {
        // GIVEN
        News mockNews = News.builder().id(10L).title("Thông tin quy hoạch Vành đai 4").build();
        NewsDetailResponse mockDetail = NewsDetailResponse.builder().id(10L).title("Thông tin quy hoạch Vành đai 4").build();

        when(newsRepository.findById(10L)).thenReturn(Optional.of(mockNews));
        when(newsMapper.toNewsDetailResponse(mockNews)).thenReturn(mockDetail);

        // WHEN
        NewsDetailResponse result = newsService.getNewsById(10L);

        // THEN
        assertNotNull(result);
        assertEquals(10L, result.getId());
        assertEquals("Thông tin quy hoạch Vành đai 4", result.getTitle());
        verify(newsRepository).findById(10L);
    }

    @Test
    @DisplayName("Lấy chi tiết tin tức thất bại khi ID không tồn tại")
    void getNewsById_NotFound_ThrowsException() {
        // GIVEN
        when(newsRepository.findById(999L)).thenReturn(Optional.empty());

        // WHEN & THEN: Ném lỗi NEWS_NOT_EXISTED
        AppException exception = assertThrows(AppException.class, () -> {
            newsService.getNewsById(999L);
        });

        assertEquals(ErrorCode.NEWS_NOT_EXISTED, exception.getErrorCode());
    }
}
