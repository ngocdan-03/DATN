package com.NgocDan.BACKEND.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.NgocDan.BACKEND.dto.request.NewsRequest;
import com.NgocDan.BACKEND.dto.response.*;
import com.NgocDan.BACKEND.enums.*;
import com.NgocDan.BACKEND.exception.AppException;
import com.NgocDan.BACKEND.exception.ErrorCode;
import com.NgocDan.BACKEND.mapper.NewsMapper;
import com.NgocDan.BACKEND.mapper.PostMapper;
import com.NgocDan.BACKEND.mapper.TransactionMapper;
import com.NgocDan.BACKEND.mapper.UserMapper;
import com.NgocDan.BACKEND.model.News;
import com.NgocDan.BACKEND.model.Post;
import com.NgocDan.BACKEND.model.Transaction;
import com.NgocDan.BACKEND.model.User;
import com.NgocDan.BACKEND.model.kafka.PostDeletedEvent;
import com.NgocDan.BACKEND.model.kafka.PostStatusEmailEvent;
import com.NgocDan.BACKEND.repository.NewsRepository;
import com.NgocDan.BACKEND.repository.PostRepository;
import com.NgocDan.BACKEND.repository.TransactionRepository;
import com.NgocDan.BACKEND.repository.UserRepository;
import com.NgocDan.BACKEND.service.kafka.PostApprovedKafkaProducer;
import com.NgocDan.BACKEND.service.kafka.PostDeletedKafkaProducer;
import com.NgocDan.BACKEND.service.kafka.PostStatusEmailProducer;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminService {

    PostRepository postRepository;
    UserRepository userRepository;
    TransactionRepository transactionRepository;
    PostMapper postMapper;
    UserMapper userMapper;
    TransactionMapper transactionMapper;
    PostStatusEmailProducer postStatusEmailProducer;
    PostApprovedKafkaProducer postApprovedKafkaProducer;
    PostDeletedKafkaProducer postDeletedKafkaProducer;
    NewsRepository newsRepository;
    NewsMapper newsMapper;
    CloudinaryService cloudinaryService;

    public AdminDashboardResponse getDashboard(int year) {
        LocalDate now = LocalDate.now();
        int currentMonth = now.getMonthValue();
        int currentYear = now.getYear();

        // Tổng quan
        long totalUsers = userRepository.count();
        long totalPosts = postRepository.countActivePosts();
        long pendingPosts = postRepository.countByStatus(PostStatus.PENDING);
        long approvedPosts = postRepository.countByStatus(PostStatus.APPROVED);
        long rejectedPosts = postRepository.countByStatus(PostStatus.REJECTED);
        long deletedPosts = postRepository.countByStatus(PostStatus.DELETED);

        BigDecimal totalRevenue = transactionRepository.getTotalRevenue();
        BigDecimal revenueThisMonth = transactionRepository.getRevenueByMonth(currentYear, currentMonth);
        long newUsersThisMonth = userRepository.countNewUsersByMonth(currentYear, currentMonth);

        // Biểu đồ doanh thu 12 tháng
        List<Object[]> rawMonthly = transactionRepository.getMonthlyRevenueByYear(year);

        // Map month -> revenue
        Map<Integer, BigDecimal> revenueMap =
                rawMonthly.stream().collect(Collectors.toMap(row -> (Integer) row[0], row -> (BigDecimal) row[1]));

        // Đảm bảo đủ 12 tháng, tháng nào không có thì = 0
        List<MonthlyRevenueResponse> monthlyRevenue = new ArrayList<>();
        for (int m = 1; m <= 12; m++) {
            monthlyRevenue.add(MonthlyRevenueResponse.builder()
                    .month(m)
                    .revenue(revenueMap.getOrDefault(m, BigDecimal.ZERO))
                    .build());
        }

        return AdminDashboardResponse.builder()
                .totalUsers(totalUsers)
                .totalPosts(totalPosts)
                .pendingPosts(pendingPosts)
                .approvedPosts(approvedPosts)
                .rejectedPosts(rejectedPosts)
                .deletedPosts(deletedPosts)
                .totalRevenue(totalRevenue)
                .revenueThisMonth(revenueThisMonth)
                .newUsersThisMonth(newUsersThisMonth)
                .monthlyRevenue(monthlyRevenue)
                .build();
    }

    // --------------- QUẢN LÝ POST ---------------

    // get all posts với filter cho admin
    public PageResponse<AdminPostResponse> getAllPosts(
            String keyword,
            PostStatus status,
            Integer wardId,
            PropertyType propertyType,
            ListingType listingType,
            int page,
            int size) {
        String kw = (keyword != null && !keyword.isBlank()) ? keyword.trim() : null;
        Pageable pageable = PageRequest.of(page - 1, size);

        Page<Post> pageData = postRepository.findAllForAdmin(status, wardId, propertyType, listingType, kw, pageable);

        List<AdminPostResponse> data = pageData.getContent().stream()
                .map(postMapper::toAdminPostResponse)
                .toList();

        return PageResponse.<AdminPostResponse>builder()
                .currentPage(page)
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .pageSize(pageData.getSize())
                .data(data)
                .build();
    }

    // duyệt bài đăng
    @Transactional
    public void approvePost(Long postId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));

        if (post.getStatus() != PostStatus.PENDING) {
            throw new AppException(ErrorCode.INVALID_POST_STATUS);
        }
        post.setStatus(PostStatus.APPROVED);
        postRepository.save(post);
        // Gửi event để FastAPI index/update vector vào Qdrant
        postApprovedKafkaProducer.publishPostApproved(postMapper.toPostApprovedEvent(post));

        // gưửi thông báo
        publishPostStatusEmail(post);
        log.info("[Admin] Da duyet bai dang id: {}", postId);
    }

    // từ chối bài đăng
    @Transactional
    public void rejectPost(Long postId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));

        if (post.getStatus() != PostStatus.PENDING) {
            throw new AppException(ErrorCode.INVALID_POST_STATUS);
        }

        post.setStatus(PostStatus.REJECTED);
        postRepository.save(post);
        publishPostStatusEmail(post);
        log.info("[Admin] Da tu choi bai dang id: {}", postId);
    }

    // xóa bài đăng (chuyển trạng thái thành DELETED)
    @Transactional
    public void deletePost(Long postId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));

        if (post.getStatus() == PostStatus.DELETED) {
            throw new AppException(ErrorCode.INVALID_POST_STATUS);
        }

        post.setStatus(PostStatus.DELETED);
        postRepository.save(post);
        // Gửi event để FastAPI xóa vector khỏi Qdrant
        postDeletedKafkaProducer.publishPostDeleted(
                PostDeletedEvent.builder().postId(postId).build());

        // gửi mail thông báo
        publishPostStatusEmail(post);
        log.info("[Admin] Da xoa bai dang id: {}", postId);
    }

    // hàm bổ trợ
    private void publishPostStatusEmail(Post post) {
        PostStatusEmailEvent event = PostStatusEmailEvent.builder()
                .email(post.getUser().getEmail())
                .fullName(post.getUser().getFullName())
                .postTitle(post.getTitle())
                .postStatus(post.getStatus())
                .build();

        postStatusEmailProducer.publishPostStatusEmail(event);
    }

    // --------------- QUẢN LÝ TÀI KHOẢN  ---------------

    // get all users với filter cho admin
    public PageResponse<AdminUserResponse> getAllUsers(
            String keyword, Boolean isVerified, Boolean isLocked, int page, int size) {
        String kw = (keyword != null && !keyword.isBlank()) ? keyword.trim() : null;
        Pageable pageable = PageRequest.of(page - 1, size);

        Page<User> pageData = userRepository.findAllForAdmin(kw, isVerified, isLocked, pageable);

        return PageResponse.<AdminUserResponse>builder()
                .currentPage(page)
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .pageSize(pageData.getSize())
                .data(pageData.getContent().stream()
                        .map(userMapper::toAdminUserResponse)
                        .toList())
                .build();
    }

    // xem chi tiết user
    public AdminUserDetailResponse getUserDetail(Long userId, int page, int size) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("createdAt").descending());
        Page<Transaction> transactionPage = transactionRepository.findByUserId(userId, pageable);

        List<TransactionResponse> transactions =
                transactionMapper.toTransactionResponseList(transactionPage.getContent());
        PageResponse<TransactionResponse> transactionPageResponse = PageResponse.<TransactionResponse>builder()
                .currentPage(page)
                .totalPages(transactionPage.getTotalPages())
                .totalElements(transactionPage.getTotalElements())
                .pageSize(transactionPage.getSize())
                .data(transactions)
                .build();
        if (page > 1) {
            return AdminUserDetailResponse.builder()
                    .recentTransactions(transactionPageResponse)
                    .build();
        }

        return AdminUserDetailResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .balance(user.getBalance())
                .isVerified(user.getIsVerified())
                .isLocked(user.getIsLocked())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdateAt())
                .totalPosts(postRepository.countByUserId(userId))
                .approvedPosts(postRepository.countByUserIdAndStatus(userId, PostStatus.APPROVED))
                .pendingPosts(postRepository.countByUserIdAndStatus(userId, PostStatus.PENDING))
                .rejectedPosts(postRepository.countByUserIdAndStatus(userId, PostStatus.REJECTED))
                .recentTransactions(transactionPageResponse)
                .build();
    }

    // mở khóa / khóa user
    @Transactional
    public void toggleLockUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        user.setIsLocked(!user.getIsLocked());
        userRepository.save(user);

        log.info("[Admin] Da {} tai khoan user id: {}", user.getIsLocked() ? "khoa" : "mo khoa", userId);
    }

    // --------------- QUẢN LÝ NEWS ---------------
    // cập nhật ảnh
    public String uploadNewsThumbnail(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new AppException(ErrorCode.THUMBNAIL_REQUIRED);
        }

        return cloudinaryService.uploadFile(file, "news");
    }

    // lấy all news
    @Transactional(readOnly = true)
    public PageResponse<AdminNewsResponse> getAllNewsForAdmin(
            String keyword, NewsCategory category, NewsStatus status, int page, int size) {
        String kw = (keyword != null && !keyword.isBlank()) ? keyword.trim() : null;

        Pageable pageable = PageRequest.of(page - 1, size);
        Page<News> pageData = newsRepository.findAllForAdmin(kw, category, status, pageable);

        return PageResponse.<AdminNewsResponse>builder()
                .currentPage(page)
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .pageSize(pageData.getSize())
                .data(pageData.getContent().stream()
                        .map(newsMapper::toAdminNewsResponse)
                        .toList())
                .build();
    }

    // lấy chi tiết
    @Transactional(readOnly = true)
    public AdminNewsDetailResponse getNewsDetailForAdmin(Long newsId) {
        News news = newsRepository.findById(newsId).orElseThrow(() -> new AppException(ErrorCode.NEWS_NOT_EXISTED));

        return newsMapper.toAdminNewsDetailResponse(news);
    }

    // tạo news mới
    @Transactional
    public void createNews(NewsRequest request, MultipartFile thumbnailFile) {
        if (thumbnailFile == null || thumbnailFile.isEmpty()) {
            throw new AppException(ErrorCode.THUMBNAIL_REQUIRED);
        }

        String sub = SecurityContextHolder.getContext().getAuthentication().getName();
        Long adminId = Long.parseLong(sub);

        User author = userRepository.findById(adminId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        String thumbnailUrl = cloudinaryService.uploadFile(thumbnailFile, "news");

        News news = newsMapper.toNews(request);
        news.setAuthor(author);
        news.setThumbnailUrl(thumbnailUrl);
        news.setStatus(NewsStatus.PUBLISHED);

        newsRepository.save(news);

        log.info("[Admin] Da tao tin tuc moi: {}", news.getTitle());
    }

    // cập nhật news(khong ảnh)
    @Transactional
    public void updateNewsInfo(Long newsId, NewsRequest request) {
        News news = newsRepository.findById(newsId).orElseThrow(() -> new AppException(ErrorCode.NEWS_NOT_EXISTED));

        newsMapper.updateNews(news, request);
        newsRepository.save(news);

        log.info("[Admin] Da cap nhat noi dung tin tuc : {}", news.getTitle());
    }

    // cập nhật ảnh news
    @Transactional
    public String updateNewsThumbnail(Long newsId, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new AppException(ErrorCode.THUMBNAIL_REQUIRED);
        }

        News news = newsRepository.findById(newsId).orElseThrow(() -> new AppException(ErrorCode.NEWS_NOT_EXISTED));

        String oldThumbnailUrl = news.getThumbnailUrl();

        String newThumbnailUrl = cloudinaryService.uploadFile(file, "news");

        if (oldThumbnailUrl != null && !oldThumbnailUrl.isBlank()) {
            cloudinaryService.deleteFileByUrl(oldThumbnailUrl);
        }

        news.setThumbnailUrl(newThumbnailUrl);
        newsRepository.save(news);

        log.info("[Admin] Da cap nhat anh tin tuc : {}", news.getTitle());

        return newThumbnailUrl;
    }

    // cập nhật trạng thái news
    @Transactional
    public void hideNews(Long newsId) {
        News news = newsRepository.findById(newsId).orElseThrow(() -> new AppException(ErrorCode.NEWS_NOT_EXISTED));

        news.setStatus(NewsStatus.HIDDEN);
        newsRepository.save(news);

        log.info("[Admin] Da an tin tuc: {}", news.getTitle());
    }

    @Transactional
    public void showNews(Long newsId) {
        News news = newsRepository.findById(newsId).orElseThrow(() -> new AppException(ErrorCode.NEWS_NOT_EXISTED));

        news.setStatus(NewsStatus.PUBLISHED);
        newsRepository.save(news);

        log.info("[Admin] Da hien thi lai tin tuc: {}", news.getTitle());
    }

    // ----------------- QUẢN LÝ GIAO DỊCH ---------------
    // lấy tất cả giao dịch với filter cho admin
    public PageResponse<AdminTransactionResponse> getAllTransactions(
            String keyword, TransactionType type, TransactionStatus status, int page, int size) {

        String kw = (keyword != null && !keyword.isBlank()) ? keyword.trim() : null;
        Pageable pageable = PageRequest.of(page - 1, size);

        Page<Transaction> pageData = transactionRepository.findAllForAdmin(type, status, kw, pageable);

        return PageResponse.<AdminTransactionResponse>builder()
                .currentPage(page)
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .pageSize(pageData.getSize())
                .data(transactionMapper.toAdminTransactionResponseList(pageData.getContent()))
                .build();
    }

    // thống kê doanh thu theo các mốc thời gian + biểu đồ doanh thu 12 tháng
    public AdminRevenueResponse getRevenue(int year) {
        LocalDate now = LocalDate.now();

        // Doanh thu các mốc thời gian
        BigDecimal totalRevenue = transactionRepository.getTotalRevenue();
        BigDecimal revenueToday = transactionRepository.getRevenueByDate(now);
        BigDecimal revenueThisMonth = transactionRepository.getRevenueByMonth(now.getYear(), now.getMonthValue());
        BigDecimal revenueThisYear = transactionRepository.getRevenueByYear(now.getYear());

        // Thống kê số lượng giao dịch
        long totalTransactions = transactionRepository.count();
        long totalDeposits = transactionRepository.countByType(TransactionType.DEPOSIT);
        long totalPostFees = transactionRepository.countByType(TransactionType.POST_FEE);

        // Biểu đồ 12 tháng theo year param
        List<Object[]> rawMonthly = transactionRepository.getMonthlyRevenueByYear(year);
        Map<Integer, BigDecimal> revenueMap =
                rawMonthly.stream().collect(Collectors.toMap(row -> (Integer) row[0], row -> (BigDecimal) row[1]));

        List<MonthlyRevenueResponse> monthlyRevenue = new ArrayList<>();
        for (int m = 1; m <= 12; m++) {
            monthlyRevenue.add(MonthlyRevenueResponse.builder()
                    .month(m)
                    .revenue(revenueMap.getOrDefault(m, BigDecimal.ZERO))
                    .build());
        }

        return AdminRevenueResponse.builder()
                .totalRevenue(totalRevenue)
                .revenueToday(revenueToday)
                .revenueThisMonth(revenueThisMonth)
                .revenueThisYear(revenueThisYear)
                .totalTransactions(totalTransactions)
                .totalDeposits(totalDeposits)
                .totalPostFees(totalPostFees)
                .monthlyRevenue(monthlyRevenue)
                .build();
    }

    // hàm lấy chi tiết giao dịch
    public TransactionDetailResponse getTransactionDetail(Long id) {
        // tìm giao dịch theo id
        Transaction transaction = transactionRepository
                .findByIdWithDetails(id)
                .orElseThrow(() -> new AppException(ErrorCode.TRANSACTION_NOT_EXISTED));

        // map sang DTO và trả về
        return transactionMapper.toDetailResponse(transaction);
    }
}
