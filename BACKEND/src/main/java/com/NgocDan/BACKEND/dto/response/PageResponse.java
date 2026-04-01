package com.NgocDan.BACKEND.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL) // Chỉ hiện các trường không bị null
public class PageResponse<T> {
    int currentPage;
    int totalPages;
    int pageSize;
    long totalElements;
    List<T> data;
}
