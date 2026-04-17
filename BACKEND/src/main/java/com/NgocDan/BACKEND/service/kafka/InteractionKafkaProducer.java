package com.NgocDan.BACKEND.service.kafka;

import com.NgocDan.BACKEND.model.kafka.InteractionEvent;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class InteractionKafkaProducer extends BaseKafkaProducer<InteractionEvent> {

    public InteractionKafkaProducer(KafkaTemplate<String, Object> kafkaTemplate) {
        super(kafkaTemplate);
    }

    // API sẽ gọi hàm này để ném dữ liệu vào topic
    public void publishInteraction(InteractionEvent payload) {
        send("user_interaction_topic", payload);
    }
}