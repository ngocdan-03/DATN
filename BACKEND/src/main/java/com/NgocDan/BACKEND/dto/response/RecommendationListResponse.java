package com.NgocDan.BACKEND.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RecommendationListResponse {
    private List<PostResponse> posts;
    private boolean isTopView; // true: top view, false ai gợi ý cá nhân
}
