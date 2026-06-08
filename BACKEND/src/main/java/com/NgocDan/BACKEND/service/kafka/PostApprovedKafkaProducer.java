package com.NgocDan.BACKEND.service.kafka;

import com.NgocDan.BACKEND.model.kafka.PostApprovedEvent;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;


@Service
public class PostApprovedKafkaProducer extends BaseKafkaProducer<PostApprovedEvent> {
    public PostApprovedKafkaProducer(KafkaTemplate<String, Object> kafkaTemplate) {
        super(kafkaTemplate);
    }
    public void publishPostApproved(PostApprovedEvent event) {
        send("post_approved_topic", event);
    }
}
