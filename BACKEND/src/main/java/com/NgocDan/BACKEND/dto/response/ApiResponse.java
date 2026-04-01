package com.NgocDan.BACKEND.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL) // Chỉ hiện các trường không bị null
public class ApiResponse<T> {
    int code = 1000; // Mặc định 1000 là thành công
    String message;
    T result; // Dữ liệu trả về (có thể là User, List, Page...)
}
