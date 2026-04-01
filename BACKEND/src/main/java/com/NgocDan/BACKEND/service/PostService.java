package com.NgocDan.BACKEND.service;

import com.NgocDan.BACKEND.dto.request.PostCreateRequest;
import com.NgocDan.BACKEND.dto.response.*;
import com.NgocDan.BACKEND.enums.*;
import com.NgocDan.BACKEND.exception.AppException;
import com.NgocDan.BACKEND.exception.ErrorCode;
import com.NgocDan.BACKEND.mapper.NewsMapper;
import com.NgocDan.BACKEND.mapper.PostMapper;
import com.NgocDan.BACKEND.model.*;
import com.NgocDan.BACKEND.repository.*;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostService {
    PostRepository postRepository;
    UserInteractionRepository userInteractionRepository;
    WardRepository wardRepository;
    UserRepository userRepository;
    PostMapper postMapper;

    public PageResponse<PostResponse> getAllPosts(int page, int size) {
        // Phân trang đơn giản
        Pageable pageable = PageRequest.of(page - 1, size);

        // Truyền trạng thái APPROVED từ Service xuống Repository
        Page<Post> pageData = postRepository.findAllCustom(PostStatus.APPROVED, pageable);

        return PageResponse.<PostResponse>builder()
                .currentPage(page)
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .data(postMapper.toPostResponseList(pageData.getContent()))
                .build();
    }

    // get có bộ lọc
    public PageResponse<PostResponse> getFilteredPosts(
            String keyword, Integer wardId, PropertyType propertyType,
            ListingType listingType, LegalStatus legalStatus,
            BigDecimal minPrice, BigDecimal maxPrice,
            BigDecimal minArea, BigDecimal maxArea,
            Integer minBedrooms, Integer minBathrooms,
            int page, int size) {

        Pageable pageable = PageRequest.of(page - 1, size);

        // Xử lý keyword rỗng
        String searchKey = (keyword != null && !keyword.trim().isEmpty()) ? keyword : null;

        Page<Post> pageData = postRepository.searchPostsAdvanced(
                PostStatus.APPROVED, searchKey, wardId, propertyType,
                listingType, legalStatus, minPrice, maxPrice,
                minArea, maxArea, minBedrooms, minBathrooms, pageable);

        return PageResponse.<PostResponse>builder()
                .currentPage(page)
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .data(postMapper.toPostResponseList(pageData.getContent()))
                .build();
    }

    // lấy chi tiết bài đăng
    public PostDetailResponse getPostDetail(Long postId) {
        // 1. Tìm bài đăng (Nên dùng JOIN FETCH trong Repo để lấy User và Images nhanh hơn)
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));

        // 2. Map sang DTO
        PostDetailResponse response = postMapper.toPostDetailResponse(post);

        // 3. Logic Optional Auth: Kiểm tra xem ai đang xem bài
        String sub = SecurityContextHolder.getContext().getAuthentication().getName();

        // Nếu không phải khách vãng lai (Token hợp lệ)
        if (sub != null && !sub.equals("anonymousUser")) {
            try {
                Long currentUserId = Long.parseLong(sub);

                // Kiểm tra xem User này đã nhấn Lưu bài này chưa
                boolean isSaved = userInteractionRepository.existsByUserIdAndPostIdAndInteractionType(
                        currentUserId, postId, InteractionType.SAVE);

                response.setFavorite(isSaved);

                // Ghi lại tương tác VIEW của người dùng này vào DB
                userInteractionRepository.save(UserInteraction.builder()
                        .user(User.builder().id(currentUserId).build())
                        .post(post)
                        .interactionType(InteractionType.VIEW)
                        .build());

            } catch (NumberFormatException e) {
                log.error("loi dinh dang userId trong token {}", sub);
            }
        }
        return response;
    }

    // thêm tương tác(dùng chung)
    private void saveNewInteraction(Long userId, Long postId, InteractionType type){

        UserInteraction interaction = UserInteraction.builder()
                .user(User.builder().id(userId).build())
                .post(Post.builder().id(postId).build())
                .interactionType(type)
                .build();
        userInteractionRepository.save(interaction);
    }

    // lưu bài đăng (tương tác SAVE)
    @Transactional
    public void toggleFavorite(Long postId) {

        String sub = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = Long.parseLong(sub);

        // check post
        if(!postRepository.existsById(postId)){
            throw new AppException(ErrorCode.POST_NOT_FOUND);
        }

        // Kiểm tra xem đã lưu chưa
        Optional<UserInteraction> existing = userInteractionRepository
                .findByUserIdAndPostIdAndInteractionType(userId, postId, InteractionType.SAVE);
        if(existing.isPresent()){
            // bỏ lưu
            userInteractionRepository.delete(existing.get());
            log.info("user:{} da bo luu:{}", userId, postId);
        }else {
            saveNewInteraction(userId, postId, InteractionType.SAVE);
            log.info("user:{} da luu bai:{}", userId, postId);
        }
    }

    // liên lạc
    @Transactional
    public void recordContact(Long postId){
        String sub = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = Long.parseLong(sub);

        // check post
        if(!postRepository.existsById(postId)){
            throw new AppException(ErrorCode.POST_NOT_FOUND);
        }

        saveNewInteraction(userId, postId, InteractionType.CONTACT);
        log.info("user:{} da lien he:{}", userId, postId);
    }

    // đăng tin
    @Transactional
    public void createPost(PostCreateRequest request) {
        // 1. Lấy String ID từ SecurityContext (Token subject)
        String sub = SecurityContextHolder.getContext().getAuthentication().getName();

        // 2. Chuyển String ID sang Long và tìm User trong DB
        // Tìm theo ID (Primary Key) sẽ nhanh hơn tìm theo Email rất nhiều
        Long userId = Long.parseLong(sub);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // 3. Kiểm tra Phường/Xã (Ward) từ request
        Ward ward = wardRepository.findById(request.getWardId())
                .orElseThrow(() -> new AppException(ErrorCode.WARD_NOT_FOUND));

        // 4. Map dữ liệu từ DTO sang Entity Post (sử dụng Mapper cho sạch code)
        Post post = postMapper.toPost(request);

        // 5. Thiết lập các thông tin quan hệ và trạng thái
        post.setUser(user);
        post.setWard(ward);
        post.setStatus(PostStatus.PENDING); // Tin mới luôn ở trạng thái chờ duyệt

        // 6. Xử lý danh sách ảnh chi tiết (PostImage)
        // Nhờ có CascadeType.ALL, danh sách này sẽ tự động được lưu vào bảng post_images
        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            List<PostImage> postImages = request.getImageUrls().stream()
                    .map(url -> PostImage.builder()
                            .imageUrl(url)
                            .post(post)
                            .build())
                    .toList();
            post.setImages(postImages);
        }

        // 7. Lưu bài đăng vào Database
        postRepository.save(post);

        log.info("User ID {} da dang tin thanh cong bai: {}", userId, post.getTitle());
    }
}