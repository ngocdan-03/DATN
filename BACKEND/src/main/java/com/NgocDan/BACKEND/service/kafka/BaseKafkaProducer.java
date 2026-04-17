package com.NgocDan.BACKEND.service.kafka;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public abstract class BaseKafkaProducer<T> {
    KafkaTemplate<String, Object> kafkaTemplate;

    protected void send(String topic, T payload) {
        kafkaTemplate.send(topic, payload).whenComplete((result, ex) -> {
            if (ex == null) {
                log.info("🚀 [Kafka] Gui thanh cong vao {}: {}", topic, payload.getClass().getSimpleName());
            } else {
                log.error("❌ [Kafka] Loi gui vao {}: {}", topic, ex.getMessage());
            }
        });
    }
}