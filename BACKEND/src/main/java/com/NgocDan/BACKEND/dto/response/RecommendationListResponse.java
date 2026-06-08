package com.NgocDan.BACKEND.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RecommendationListResponse {
    private List<PostResponse> posts;
    private boolean isTopView; //true: top view, false ai gợi ý cá nhân
}