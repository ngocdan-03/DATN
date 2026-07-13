package com.NgocDan.BACKEND.model.kafka;

import com.NgocDan.BACKEND.enums.InteractionType;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InteractionEvent {
    Long userId;
    Long postId;
    InteractionType interactionType;
    String action; // add or remove cho ai xử lý toggle save
    String timestamp;
}
