package com.NgocDan.BACKEND.mapper;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.NgocDan.BACKEND.dto.response.NewsDetailResponse;
import com.NgocDan.BACKEND.dto.response.NewsResponse;
import com.NgocDan.BACKEND.model.News;

@Mapper(componentModel = "spring")
public interface NewsMapper {

    // Target là trường hiển thị trên giao diện (ví dụ đặt tên là displayDate)
    @Mapping(target = "displayDate", expression = "java(mapDisplayDate(news))")
    NewsResponse toNewsResponse(News news);

    @Mapping(target = "displayDate", expression = "java(mapDisplayDate(news))")
    NewsDetailResponse toNewsDetailResponse(News news);

    // Hàm logic bổ trợ để chọn ngày và format dd/MM/yyyy
    default String mapDisplayDate(News news) {
        if (news == null) return null;

        // Ưu tiên lấy updatedAt nếu nó tồn tại và mới hơn createdAt
        LocalDateTime dateToShow = news.getCreatedAt();
        if (news.getUpdatedAt() != null && news.getUpdatedAt().isAfter(news.getCreatedAt())) {
            dateToShow = news.getUpdatedAt();
        }

        // Định dạng ngày tháng năm
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        return dateToShow.format(formatter);
    }
}
