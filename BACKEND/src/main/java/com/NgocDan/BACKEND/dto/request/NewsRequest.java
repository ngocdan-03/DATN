package com.NgocDan.BACKEND.dto.request;

import com.NgocDan.BACKEND.enums.NewsCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NewsRequest {

    @NotBlank(message = "TITLE_REQUIRED")
    @Size(min = 10, max = 150, message = "TITLE_INVALID_SIZE")
    String title;

    @NotBlank(message = "DESCRIPTION_REQUIRED")
    String summary;

    @NotBlank(message = "INVALID_URL_FORMAT")
    @Size(max = 500, message = "INVALID_URL_FORMAT")
    @Pattern(regexp = "^(https?://).+", message = "INVALID_URL_FORMAT")
    String originalUrl;

    @Size(max = 100, message = "SOURCE_NAME_TOO_LONG")
    String sourceName;

    @NotNull(message = "NEWS_CATEGORY_REQUIRED")
    NewsCategory category;
}