package com.NgocDan.BACKEND.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import jakarta.transaction.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.NgocDan.BACKEND.dto.request.PostCreateRequest;
import com.NgocDan.BACKEND.dto.request.PostUpdateRequest;
import com.NgocDan.BACKEND.dto.response.*;
import com.NgocDan.BACKEND.enums.*;
import com.NgocDan.BACKEND.exception.AppException;
import com.NgocDan.BACKEND.exception.ErrorCode;
import com.NgocDan.BACKEND.mapper.PostMapper;
import com.NgocDan.BACKEND.model.*;
import com.NgocDan.BACKEND.model.kafka.InteractionEvent;
import com.NgocDan.BACKEND.model.kafka.PostDeletedEvent;
import com.NgocDan.BACKEND.repository.*;
import com.NgocDan.BACKEND.service.kafka.InteractionKafkaProducer;
import com.NgocDan.BACKEND.service.kafka.PostDeletedKafkaProducer;
import com.NgocDan.BACKEND.service.redis.InteractionRedisService;
import com.NgocDan.BACKEND.service.redis.PostRedisService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostService {
    TransactionRepository transactionRepository;
    PostRepository postRepository;
    UserInteractionRepository userInteractionRepository;
    WardRepository wardRepository;
    UserRepository userRepository;
    InteractionRedisService interactionRedisService;
    PostRedisService postRedisService;
    CloudinaryService cloudinaryService;
    PostMapper postMapper;

    InteractionKafkaProducer interactionKafkaProducer;
    PostDeletedKafkaProducer postDeletedKafkaProducer;

    // chi phí đằn tin
    BigDecimal POST_PRICE = new BigDecimal("23003");

    // get có bộ lọc
    public PageResponse<PostResponse> getFilteredPosts(
            String keyword,
            Integer wardId,
            PropertyType propertyType,
            ListingType listingType,
            LegalStatus legalStatus,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            BigDecimal minArea,
            BigDecimal maxArea,
            Integer minBedrooms,
            Integer minBathrooms,
            int page,
            int size) {

        Pageable pageable = PageRequest.of(page - 1, size);

        // Xử lý keyword rỗng
        String searchKey = (keyword != null && !keyword.trim().isEmpty()) ? keyword : null;

        Page<Post> pageData = postRepository.searchPostsAdvanced(
                PostStatus.APPROVED,
                searchKey,
                wardId,
                propertyType,
                listingType,
                legalStatus,
                minPrice,
                maxPrice,
                minArea,
                maxArea,
                minBedrooms,
                minBathrooms,
                pageable);

        return PageResponse.<PostResponse>builder()
                .currentPage(page)
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .pageSize(pageData.getSize())
                .data(postMapper.toPostResponseList(pageData.getContent()))
                .build();
    }

    // lấy chi tiết bài đăng
    public PostDetailResponse getPostDetail(Long postId) {
        // 1. Tìm bài đăng
        Post post = postRepository.findById(postId).orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));

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
                saveNewInteraction(currentUserId, postId, InteractionType.VIEW, "ADD");

            } catch (NumberFormatException e) {
                log.error("loi dinh dang userId trong token {}", sub);
            }
        }
        return response;
    }

    // thêm tương tác (dùng chung cho cả VIEW, SAVE, CONTACT)
    private void saveNewInteraction(Long userId, Long postId, InteractionType type, String action) {
        // Nếu là VIEW thì kiểm tra chống spam trước khi lưu
        if (type == InteractionType.VIEW) {
            boolean canInteract = interactionRedisService.isAllowedToInteract(userId, postId, type.name(), 1);

            if (!canInteract) {
                log.info("Hanh dong VIEW cua user {} vao post {} bi chan do spam.", userId, postId);
                return;
            }
        }
        InteractionEvent event = InteractionEvent.builder()
                .userId(userId)
                .postId(postId)
                .interactionType(type)
                .action(action)
                .timestamp(LocalDateTime.now().toString())
                .build();
        interactionKafkaProducer.publishInteraction(event);
    }

    // lưu bài đăng (tương tác SAVE)
    @Transactional
    public void toggleFavorite(Long postId) {

        String sub = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = Long.parseLong(sub);

        // check post
        if (!postRepository.existsById(postId)) {
            throw new AppException(ErrorCode.POST_NOT_FOUND);
        }

        // Kiểm tra xem đã lưu chưa
        Optional<UserInteraction> existing =
                userInteractionRepository.findByUserIdAndPostIdAndInteractionType(userId, postId, InteractionType.SAVE);
        if (existing.isPresent()) {
            // bỏ lưu
            userInteractionRepository.delete(existing.get());
            saveNewInteraction(userId, postId, InteractionType.SAVE, "REMOVE");
            log.info("user:{} da bo luu:{}", userId, postId);
        } else {
            saveNewInteraction(userId, postId, InteractionType.SAVE, "ADD");
        }
    }

    // liên lạc
    @Transactional
    public void recordContact(Long postId) {
        String sub = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = Long.parseLong(sub);

        // check post
        if (!postRepository.existsById(postId)) {
            throw new AppException(ErrorCode.POST_NOT_FOUND);
        }

        saveNewInteraction(userId, postId, InteractionType.CONTACT, "ADD");
    }

    // đăng tin
    @Transactional
    public void createPost(PostCreateRequest request, MultipartFile thumbnailFile, List<MultipartFile> imageFiles) {
        // 1. Lấy String ID từ SecurityContext (Token subject)
        String sub = SecurityContextHolder.getContext().getAuthentication().getName();
        // 2. Chuyển String ID sang Long và tìm User trong DB
        Long userId = Long.parseLong(sub);

        // check redis chống spam đăng tin
        boolean canPost = postRedisService.checkAndSetPostCooldown(userId, 30);
        if (!canPost) {
            throw new AppException(ErrorCode.POST_TOO_FREQUENT);
        }

        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // kiểm tra tài khoản có đủ tiền đăng tin không
        if (user.getBalance().compareTo(POST_PRICE) < 0) {
            throw new AppException(ErrorCode.INSUFFICIENT_BALANCE);
        }
        // trừ tiền đăng tin
        user.setBalance(user.getBalance().subtract(POST_PRICE));
        userRepository.save(user);

        // 3. Kiểm tra Phường/Xã (Ward) từ request
        Ward ward = wardRepository
                .findById(request.getWardId())
                .orElseThrow(() -> new AppException(ErrorCode.WARD_NOT_FOUND));

        // up ảnh lên Cloudinary
        String thumbnailUrl = cloudinaryService.uploadFile(thumbnailFile, "posts");
        List<String> uploadedGalleryUrls = imageFiles.parallelStream()
                .map(file -> cloudinaryService.uploadFile(file, "posts"))
                .toList();
        // map và lưu bài đăng
        Post post = postMapper.toPost(request);
        post.setUser(user);
        post.setWard(ward);
        post.setThumbnailUrl(thumbnailUrl);
        post.setStatus(PostStatus.PENDING);

        if (!uploadedGalleryUrls.isEmpty()) {
            List<PostImage> postImages = uploadedGalleryUrls.stream()
                    .map(url -> PostImage.builder().imageUrl(url).post(post).build())
                    .toList();
            post.setImages(postImages);
        }

        log.info("////////////////////////////////////////////////////////////");
        log.info("kinh do{}, vi do{}", post.getLongitude(), post.getLatitude());
        Post savePost = postRepository.save(post);
        // ghi lại transaction đăng tin
        Transaction transaction = Transaction.builder()
                .user(user)
                .post(savePost)
                .amount(POST_PRICE)
                .type(TransactionType.POST_FEE)
                .description("Phí đăng tin cho bài: " + post.getTitle())
                .status(TransactionStatus.SUCCESS)
                .build();
        transactionRepository.save(transaction);

        log.info("User {} da bi tru {} VNĐ de dang tin: {}", user.getFullName(), POST_PRICE, savePost.getTitle());
    }

    // lấy bài đăng của user theo form dashboard
    public PageResponse<PostDashboardResponse> getMyPosts(String keyword, PostStatus status, int page, int size) {
        // lấy id từ Security Context
        String sub = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = Long.parseLong(sub);

        // 2. Xử lý keyword: Nếu rỗng hoặc chỉ có khoảng trắng thì đưa về null
        String searchKeyword = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;

        // tạo Pageable
        Pageable pageable = PageRequest.of(page - 1, size);

        // lấy bài đăng của user
        Page<PostDashboardResponse> pageData =
                postRepository.findPostDashboardByUserId(userId, searchKeyword, status, pageable);

        return PageResponse.<PostDashboardResponse>builder()
                .currentPage(page)
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .pageSize(pageData.getSize())
                .data(pageData.getContent())
                .build();
    }

    // xoá bài đăng
    @Transactional
    public void deleteMyPost(Long postId) {
        // check post tồn tại không
        Post post = postRepository.findById(postId).orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));

        // lấy userId từ security context
        String sub = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = Long.parseLong(sub);

        // kiểm tra bài đăng này có thuộc về user không
        if (!post.getUser().getId().equals(userId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        // gửi event xóa vector nếu bài đang APPROVED
        if (post.getStatus() == PostStatus.APPROVED) {
            postDeletedKafkaProducer.publishPostDeleted(
                    PostDeletedEvent.builder().postId(postId).build());
            log.info("da gui event xoa vector cho bai: {}", post.getTitle());
        }

        // xoá bài đăng
        post.setStatus(PostStatus.DELETED);
        postRepository.save(post);

        log.info("User {} da xoa bai: {}", userId, post.getTitle());
    }

    // lấy bài đăng đã lưu
    public PageResponse<PostDashboardResponse> getSavedPosts(String keyword, int page, int size) {
        // 1. Lấy userId từ Token
        String sub = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = Long.parseLong(sub);

        // 2. Phân trang
        Pageable pageable = PageRequest.of(page - 1, size);

        String searchKeyword = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;

        // 3. Gọi Repo (Dữ liệu đã là PostDashboardResponse)
        Page<PostDashboardResponse> pageData =
                postRepository.findSavedPostsDashboardByUserId(userId, searchKeyword, pageable);

        // 4. Trả về PageResponse
        return PageResponse.<PostDashboardResponse>builder()
                .currentPage(page)
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .pageSize(pageData.getSize())
                .data(pageData.getContent())
                .build();
    }

    // lấy chi tiết để edit
    public PostEditResponse getPostForEdit(Long postId) {
        // 1. Lấy ID người dùng hiện tại từ Security Context
        String sub = SecurityContextHolder.getContext().getAuthentication().getName();
        Long currentUserId = Long.parseLong(sub);

        // 2. Tìm bài đăng, fetch thêm ảnh để tránh LazyInitializationException
        Post post = postRepository.findById(postId).orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));

        // 3. Bảo mật: Chỉ chủ nhân hoặc Admin mới được lấy dữ liệu để sửa
        if (!post.getUser().getId().equals(currentUserId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        return postMapper.toPostEditResponse(post);
    }

    // update post
    @Transactional
    public void updatePost(
            Long postId,
            PostUpdateRequest request,
            MultipartFile thumbnailFile,
            List<MultipartFile> imageFiles,
            List<String> imageUrls) {
        // lấy ID người dùng hiện tại từ Security Context
        String sub = SecurityContextHolder.getContext().getAuthentication().getName();
        Long currentUserId = Long.parseLong(sub);

        // tìm bài đăng
        Post post = postRepository.findById(postId).orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));

        // kiểm tra quyền: Chỉ chủ nhân mới được sửa
        if (!post.getUser().getId().equals(currentUserId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        // tìm Ward
        Ward ward = wardRepository
                .findById(request.getWardId())
                .orElseThrow(() -> new AppException(ErrorCode.WARD_NOT_FOUND));

        // xử lý thumbnail
        if (thumbnailFile != null && !thumbnailFile.isEmpty()) {
            if (post.getThumbnailUrl() != null) {
                cloudinaryService.deleteFileByUrl(post.getThumbnailUrl());
                log.info("da xoa thumbnail cu cho bai: {}", post.getTitle());
            }
            // up ảnh mới
            String newThumbnailUrl = cloudinaryService.uploadFile(thumbnailFile, "posts");
            post.setThumbnailUrl(newThumbnailUrl);
            log.info("da cap nhat thumbnail moi cho bai: {}", post.getTitle());
        }

        // xử lý gallery images — luôn rebuild từ trạng thái cuối của FE
        // Tìm các URL cũ bị xóa để dọn Cloudinary
        List<String> keepUrls = imageUrls != null ? imageUrls : List.of();
        if (post.getImages() != null) {
            post.getImages().stream()
                    .filter(img -> !keepUrls.contains(img.getImageUrl()))
                    .forEach(img -> cloudinaryService.deleteFileByUrl(img.getImageUrl()));
            post.getImages().clear();
        }

        List<PostImage> finalImages = new ArrayList<>();

        // Giữ lại các URL cũ user không xóa
        keepUrls.forEach(url ->
                finalImages.add(PostImage.builder().imageUrl(url).post(post).build()));

        // Upload và thêm ảnh mới
        if (imageFiles != null && !imageFiles.isEmpty()) {
            List<String> newImageUrls = imageFiles.parallelStream()
                    .map(file -> cloudinaryService.uploadFile(file, "posts"))
                    .toList();
            newImageUrls.forEach(url ->
                    finalImages.add(PostImage.builder().imageUrl(url).post(post).build()));
        }

        post.getImages().addAll(finalImages);
        log.info("da cap nhat gallery cho bai: {} - tong {} anh", post.getTitle(), finalImages.size());
        // mapper text

        postMapper.updatePost(post, request);

        // chuyển trạng thái về PENDING để chờ duyệt lại
        post.setStatus(PostStatus.PENDING);

        postRepository.save(post);
        log.info("User {} da cap nhat bai dang: {}", currentUserId, post.getTitle());

        postDeletedKafkaProducer.publishPostDeleted(
                PostDeletedEvent.builder().postId(postId).build());
    }
}
