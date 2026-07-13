package com.NgocDan.BACKEND.model.kafka;

import com.NgocDan.BACKEND.enums.PostStatus;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostStatusEmailEvent {
    String email;
    String fullName;
    String postTitle;
    PostStatus postStatus;
}
