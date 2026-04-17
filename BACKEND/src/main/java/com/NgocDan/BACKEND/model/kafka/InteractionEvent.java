package com.NgocDan.BACKEND.model.kafka;

import com.NgocDan.BACKEND.enums.InteractionType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InteractionEvent {
    Long userId;
    Long postId;
    InteractionType interactionType;
    String timestamp;
}