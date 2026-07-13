package com.NgocDan.BACKEND.service.kafka;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.NgocDan.BACKEND.model.kafka.PostDeletedEvent;

@Service
public class PostDeletedKafkaProducer extends BaseKafkaProducer<PostDeletedEvent> {
    public PostDeletedKafkaProducer(KafkaTemplate<String, Object> kafkaTemplate) {
        super(kafkaTemplate);
    }

    public void publishPostDeleted(PostDeletedEvent event) {
        send("post_deleted_topic", event);
    }
}
