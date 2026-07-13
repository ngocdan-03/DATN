package com.NgocDan.BACKEND.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.NgocDan.BACKEND.dto.response.PostResponse;
import com.NgocDan.BACKEND.dto.response.RecommendationListResponse;
import com.NgocDan.BACKEND.enums.InteractionType;
import com.NgocDan.BACKEND.enums.PostStatus;
import com.NgocDan.BACKEND.mapper.PostMapper;
import com.NgocDan.BACKEND.model.Post;
import com.NgocDan.BACKEND.repository.PostRepository;
import com.NgocDan.BACKEND.repository.UserInteractionRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class RecommendService {

    PostRepository postRepository;
    UserInteractionRepository userInteractionRepository;
    PostMapper postMapper;

    @Value("${ai.server.url:http://localhost:8000}")
    @lombok.experimental.NonFinal
    String aiServerUrl;

    @lombok.experimental.NonFinal
    RestTemplate restTemplate = new RestTemplate();

    /**
     * API 1: Gợi ý theo sở thích cá nhân
     */
    public RecommendationListResponse getPersonalRecommendations() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // 1. Khách vãng lai chưa đăng nhập -> Chắc chắn trả về Top View
        if (authentication == null
                || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getName())) {
            return RecommendationListResponse.builder()
                    .posts(getFallbackTopViewPosts())
                    .isTopView(true) //  Đánh dấu là Top View
                    .build();
        }

        try {
            Long userId = Long.parseLong(authentication.getName());
            Map<String, Object> requestBody = Map.of("userId", userId, "limit", 3);

            ResponseEntity<Map> response =
                    restTemplate.postForEntity(aiServerUrl + "/recommend/personal", requestBody, Map.class);

            Map<String, Object> body = response.getBody();
            boolean fallback = (boolean) body.get("fallback");

            // 2. AI báo Fallback vì user chưa có lịch sử tương tác -> Trả về Top View
            if (fallback) {
                return RecommendationListResponse.builder()
                        .posts(getFallbackTopViewPosts())
                        .isTopView(true) //  Đánh dấu là Top View
                        .build();
            }

            // 3. AI tính toán thành công trả về đúng gu -> Trả về Personalized
            return RecommendationListResponse.builder()
                    .posts(fetchPostsFromIds(body))
                    .isTopView(false) //  Đánh dấu là Gu AI chuẩn chỉ
                    .build();

        } catch (Exception e) {
            log.error("[Recommend] Lỗi kết nối Server AI personal: {}. Trả về top View.", e.getMessage());
            return RecommendationListResponse.builder()
                    .posts(getFallbackTopViewPosts())
                    .isTopView(true) //  Lỗi kết nối cũng coi là Top View
                    .build();
        }
    }

    /**
     * API 2: Gợi ý bài viết tương tự bđs đang xem
     */
    public RecommendationListResponse getSimilarPosts(Long postId) {
        try {
            Map<String, Object> requestBody = Map.of("postId", postId, "limit", 3);

            ResponseEntity<Map> response =
                    restTemplate.postForEntity(aiServerUrl + "/recommend/similar", requestBody, Map.class);

            Map<String, Object> body = response.getBody();
            boolean fallback = (boolean) body.get("fallback");

            if (fallback) {
                log.info("[Recommend] Server AI báo Fallback cho Post {}. Trả về top View.", postId);
                return RecommendationListResponse.builder()
                        .posts(getFallbackTopViewPosts())
                        .isTopView(true) // 👈 Đánh dấu hiển thị danh sách dạng Fallback Top View
                        .build();
            }

            return RecommendationListResponse.builder()
                    .posts(fetchPostsFromIds(body))
                    .isTopView(false) // 👈 Gợi ý chuẩn AI tương đồng ngữ nghĩa
                    .build();

        } catch (Exception e) {
            log.error("[Recommend] Lỗi kết nối Server AI similar: {}. Trả về top View.", e.getMessage());
            return RecommendationListResponse.builder()
                    .posts(getFallbackTopViewPosts())
                    .isTopView(true) // 👈 Lỗi kết nối dính fallback
                    .build();
        }
    }

    private List<PostResponse> fetchPostsFromIds(Map<String, Object> body) {
        List<Integer> postIds = (List<Integer>) body.get("postIds");
        if (postIds == null || postIds.isEmpty()) {
            return getFallbackTopViewPosts();
        }

        List<Long> ids = postIds.stream().map(Long::valueOf).toList();
        return postRepository.findAllById(ids).stream()
                .map(postMapper::toPostResponse)
                .toList();
    }

    private List<PostResponse> getFallbackTopViewPosts() {
        // Lấy top 3 bản ghi dùng PageRequest
        List<Post> topPosts = userInteractionRepository.findTopPostsByInteractionTypeAndStatus(
                InteractionType.VIEW, PostStatus.APPROVED, PageRequest.of(0, 3));

        // Trường hợp hệ thống mới tinh chưa có ai bấm VIEW bài nào hết -> Quay về fallback gốc lấy bài mới nhất
        if (topPosts.isEmpty()) {
            topPosts = postRepository.findTop3ByStatusOrderByCreatedAtDesc(PostStatus.APPROVED);
        }

        return topPosts.stream().map(postMapper::toPostResponse).toList();
    }
}
