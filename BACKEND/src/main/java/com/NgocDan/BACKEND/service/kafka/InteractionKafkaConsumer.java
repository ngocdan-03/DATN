package com.NgocDan.BACKEND.service.kafka;

import com.NgocDan.BACKEND.model.Post;
import com.NgocDan.BACKEND.model.User;
import com.NgocDan.BACKEND.model.UserInteraction;
import com.NgocDan.BACKEND.model.kafka.InteractionEvent;
import com.NgocDan.BACKEND.repository.PostRepository;
import com.NgocDan.BACKEND.repository.UserInteractionRepository;
import com.NgocDan.BACKEND.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class InteractionKafkaConsumer {

    UserRepository userRepository;
    PostRepository postRepository;
    UserInteractionRepository userInteractionRepository;

    @KafkaListener(topics = "user_interaction_topic", groupId = "real-estate-group")
    @Transactional
    public void listenAndSaveInteraction(InteractionEvent payload) {
        try {
            // 1. Tìm User và Post
            User user = userRepository.findById(payload.getUserId()).orElse(null);
            Post post = postRepository.findById(payload.getPostId()).orElse(null);

            if (user == null || post == null) {
                log.warn("⏩ [Kafka] Khong the luu tuong tac do User hoac Post khong ton tai.");
                return;
            }

            // 2. Tạo đối tượng và lưu vào Database
            UserInteraction interaction = UserInteraction.builder()
                    .user(user)
                    .post(post)
                    .interactionType(payload.getInteractionType())
                    .build();

            userInteractionRepository.save(interaction);
            log.info("[Kafka] Da luu tuong tac {} cua User ID {} tren Post ID {}",
                    payload.getInteractionType(), payload.getUserId(), payload.getPostId());

        } catch (Exception e) {
            log.error("[Kafka] Loi khi luu tuong tac: {}", e.getMessage());
        }
    }
}