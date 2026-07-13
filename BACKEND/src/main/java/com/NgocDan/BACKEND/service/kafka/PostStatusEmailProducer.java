package com.NgocDan.BACKEND.service.kafka;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.NgocDan.BACKEND.model.kafka.PostStatusEmailEvent;

@Service
public class PostStatusEmailProducer extends BaseKafkaProducer<PostStatusEmailEvent> {

    public PostStatusEmailProducer(KafkaTemplate<String, Object> kafkaTemplate) {
        super(kafkaTemplate);
    }

    public void publishPostStatusEmail(PostStatusEmailEvent payload) {
        send("post_status_email_topic", payload);
    }
}
