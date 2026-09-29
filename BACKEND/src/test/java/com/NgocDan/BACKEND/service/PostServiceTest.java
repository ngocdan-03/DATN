package com.NgocDan.BACKEND.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import com.NgocDan.BACKEND.dto.response.PageResponse;
import com.NgocDan.BACKEND.dto.response.PostDetailResponse;
import com.NgocDan.BACKEND.dto.response.PostResponse;
import com.NgocDan.BACKEND.enums.InteractionType;
import com.NgocDan.BACKEND.enums.LegalStatus;
import com.NgocDan.BACKEND.enums.ListingType;
import com.NgocDan.BACKEND.enums.PostStatus;
import com.NgocDan.BACKEND.enums.PropertyType;
import com.NgocDan.BACKEND.exception.AppException;
import com.NgocDan.BACKEND.exception.ErrorCode;
import com.NgocDan.BACKEND.mapper.PostMapper;
import com.NgocDan.BACKEND.model.Post;
import com.NgocDan.BACKEND.repository.PostRepository;
import com.NgocDan.BACKEND.repository.TransactionRepository;
import com.NgocDan.BACKEND.repository.UserInteractionRepository;
import com.NgocDan.BACKEND.repository.UserRepository;
import com.NgocDan.BACKEND.repository.WardRepository;
import com.NgocDan.BACKEND.service.kafka.InteractionKafkaProducer;
import com.NgocDan.BACKEND.service.kafka.PostDeletedKafkaProducer;
import com.NgocDan.BACKEND.service.redis.InteractionRedisService;
import com.NgocDan.BACKEND.service.redis.PostRedisService;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
public class PostServiceTest {

    @Mock
    TransactionRepository transactionRepository;

    @Mock
    PostRepository postRepository;

    @Mock
    UserInteractionRepository userInteractionRepository;

    @Mock
    WardRepository wardRepository;

    @Mock
    UserRepository userRepository;

    @Mock
    InteractionRedisService interactionRedisService;

    @Mock
    PostRedisService postRedisService;

    @Mock
    CloudinaryService cloudinaryService;

    @Mock
    PostMapper postMapper;

    @Mock
    InteractionKafkaProducer interactionKafkaProducer;

    @Mock
    PostDeletedKafkaProducer postDeletedKafkaProducer;

    @InjectMocks
    PostService postService;

    private Authentication authentication;
    private SecurityContext securityContext;

    @BeforeEach
    void setUp() {
        authentication = mock(Authentication.class);
        securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
    }

    // ============================================================
    // 1. TEST LẤY TẤT CẢ BÀI ĐĂNG THEO BỘ LỌC (SEARCH & FILTER)
    // ============================================================
    @Test
    @DisplayName("Lấy danh sách bài đăng có bộ lọc (keyword, khoảng giá, diện tích...) thành công")
    void getFilteredPosts_Success() {
        // GIVEN: Giả lập repository trả về 1 trang chứa bài viết
        Post mockPost = Post.builder().id(1L).title("Bán nhà Cầu Giấy 5 tầng").build();
        Page<Post> mockPage = new PageImpl<>(List.of(mockPost), PageRequest.of(0, 6), 1);

        PostResponse mockResponse = PostResponse.builder()
                .id(1L)
                .title("Bán nhà Cầu Giấy 5 tầng")
                .price(new BigDecimal("3000000000"))
                .area(new BigDecimal("50"))
                .build();

        when(postRepository.searchPostsAdvanced(
                eq(PostStatus.APPROVED),
                eq("Cầu Giấy"),
                eq(10), // wardId
                eq(PropertyType.HOUSE),
                eq(ListingType.SALE),
                eq(LegalStatus.SO_DO),
                any(BigDecimal.class),
                any(BigDecimal.class),
                any(BigDecimal.class),
                any(BigDecimal.class),
                eq(3),
                eq(2),
                any(Pageable.class)))
                .thenReturn(mockPage);

        when(postMapper.toPostResponseList(anyList())).thenReturn(List.of(mockResponse));

        // WHEN: Thực hiện gọi hàm lọc
        PageResponse<PostResponse> result = postService.getFilteredPosts(
                "Cầu Giấy", 10, PropertyType.HOUSE, ListingType.SALE, LegalStatus.SO_DO,
                new BigDecimal("2000000000"), new BigDecimal("5000000000"),
                new BigDecimal("40"), new BigDecimal("80"),
                3, 2, 1, 6
        );

        // THEN: Kiểm tra kết quả
        assertNotNull(result);
        assertEquals(1, result.getCurrentPage());
        assertEquals(1, result.getTotalElements());
        assertEquals(1, result.getData().size());
        assertEquals("Bán nhà Cầu Giấy 5 tầng", result.getData().get(0).getTitle());
    }

    // ============================================================
    // 2. TEST XEM CHI TIẾT BÀI ĐĂNG
    // ============================================================
    @Test
    @DisplayName("Lấy chi tiết bài đăng thành công cho người dùng đã đăng nhập (Có check Lưu & ghi nhận VIEW)")
    void getPostDetail_Success_AuthenticatedUser() {
        // GIVEN: Giả lập người dùng ID = 1 đang xem bài viết ID = 100
        when(authentication.getName()).thenReturn("1");

        Post mockPost = Post.builder().id(100L).title("Biệt thự Mỹ Đình").build();
        PostDetailResponse mockResponse = PostDetailResponse.builder().id(100L).title("Biệt thự Mỹ Đình").build();

        when(postRepository.findById(100L)).thenReturn(Optional.of(mockPost));
        when(postMapper.toPostDetailResponse(mockPost)).thenReturn(mockResponse);
        when(userInteractionRepository.existsByUserIdAndPostIdAndInteractionType(1L, 100L, InteractionType.SAVE))
                .thenReturn(true);
        when(interactionRedisService.isAllowedToInteract(1L, 100L, "VIEW", 1)).thenReturn(true);

        // WHEN
        PostDetailResponse result = postService.getPostDetail(100L);

        // THEN
        assertNotNull(result);
        assertEquals(100L, result.getId());
        assertTrue(result.isFavorite()); // Đã lưu yêu thích
        verify(interactionKafkaProducer).publishInteraction(any()); // Đã bắn event VIEW qua Kafka
    }

    @Test
    @DisplayName("Lấy chi tiết bài đăng thành công cho khách vãng lai (anonymousUser)")
    void getPostDetail_Success_AnonymousUser() {
        // GIVEN: Khách chưa đăng nhập
        when(authentication.getName()).thenReturn("anonymousUser");

        Post mockPost = Post.builder().id(100L).title("Nhà phố Đống Đa").build();
        PostDetailResponse mockResponse = PostDetailResponse.builder().id(100L).title("Nhà phố Đống Đa").build();

        when(postRepository.findById(100L)).thenReturn(Optional.of(mockPost));
        when(postMapper.toPostDetailResponse(mockPost)).thenReturn(mockResponse);

        // WHEN
        PostDetailResponse result = postService.getPostDetail(100L);

        // THEN
        assertNotNull(result);
        assertEquals(100L, result.getId());
        assertFalse(result.isFavorite());
        // Khách vãng lai thì không lưu tương tác VIEW của cá nhân
        verify(interactionKafkaProducer, never()).publishInteraction(any());
    }

    @Test
    @DisplayName("Lấy chi tiết thất bại khi ID bài đăng không tồn tại trong hệ thống")
    void getPostDetail_NotFound_ThrowsException() {
        // GIVEN
        when(postRepository.findById(999L)).thenReturn(Optional.empty());

        // WHEN & THEN: Ném lỗi POST_NOT_FOUND
        AppException exception = assertThrows(AppException.class, () -> {
            postService.getPostDetail(999L);
        });

        assertEquals(ErrorCode.POST_NOT_FOUND, exception.getErrorCode());
    }
}
