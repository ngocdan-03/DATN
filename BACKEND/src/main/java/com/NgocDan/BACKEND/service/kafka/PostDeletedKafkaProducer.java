package com.NgocDan.BACKEND.service.kafka;

import com.NgocDan.BACKEND.model.kafka.PostDeletedEvent;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class PostDeletedKafkaProducer extends BaseKafkaProducer<PostDeletedEvent> {
    public PostDeletedKafkaProducer(KafkaTemplate<String, Object> kafkaTemplate) {
        super(kafkaTemplate);
    }
    public void publishPostDeleted(PostDeletedEvent event) {
        send("post_deleted_topic", event);
    }
}
