package com.NgocDan.BACKEND.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NewsResponse {
    Long id;
    String title;
//    String summary;
    String thumbnailUrl;
    String category;
    String sourceName;

    String displayDate;
}
