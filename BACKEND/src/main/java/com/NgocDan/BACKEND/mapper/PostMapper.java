package com.NgocDan.BACKEND.mapper;

import com.NgocDan.BACKEND.dto.request.PostCreateRequest;
import com.NgocDan.BACKEND.dto.response.PostDetailResponse;
import com.NgocDan.BACKEND.dto.response.PostResponse;
import com.NgocDan.BACKEND.model.Post;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PostMapper {
    // map cho danh sách
    @Mapping(target = "wardName", source = "ward.name")
    @Mapping(target = "displayDate", expression = "java(mapDisplayDate(post))")
    PostResponse toPostResponse(Post post);

    List<PostResponse> toPostResponseList(List<Post> posts);

    // map cho chi tiết
    @Mapping(target = "wardName", source = "ward.name")
    @Mapping(target = "owner.fullName", source = "user.fullName")
    @Mapping(target = "owner.phone", source = "user.phone")
    @Mapping(target = "owner.avatarUrl", source = "user.avatarUrl")
    @Mapping(target = "owner.email", source = "user.email")
    @Mapping(target = "imageUrls", expression = "java(post.getImages().stream().map(img -> img.getImageUrl()).toList())")
    @Mapping(target = "displayDate", expression = "java(mapDisplayDate(post))")
    PostDetailResponse toPostDetailResponse(Post post);
    // Logic xử lý displayDate: Ưu tiên updatedAt -> createdAt
    default String mapDisplayDate(Post post) {
        java.time.LocalDateTime targetDate = (post.getUpdatedAt() != null)
                ? post.getUpdatedAt()
                : post.getCreatedAt();
        if (targetDate == null) return "";
        java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy");
        return targetDate.format(formatter);
    }

    // Chuyển từ Request create post DTO sang Entity Post (chức năng đăng tin)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "ward", ignore = true)
    @Mapping(target = "images", ignore = true)
    @Mapping(target = "status", ignore = true)
    Post toPost(PostCreateRequest request);
}
