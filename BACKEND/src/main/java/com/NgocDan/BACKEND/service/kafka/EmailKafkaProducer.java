package com.NgocDan.BACKEND.service.kafka;

import com.NgocDan.BACKEND.model.redis.OtpEmail;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class EmailKafkaProducer extends BaseKafkaProducer<OtpEmail> {

    public EmailKafkaProducer(KafkaTemplate<String, Object> kafkaTemplate) {
        super(kafkaTemplate);
    }

    public void publishOtp(OtpEmail payload) {
        send("otp_email_topic", payload);
    }
}