package com.NgocDan.BACKEND.service.kafka;

import com.NgocDan.BACKEND.model.kafka.PaymentEvent;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class PaymentKafkaProducer extends BaseKafkaProducer<PaymentEvent> {

    public PaymentKafkaProducer(KafkaTemplate<String, Object> kafkaTemplate) {
        super(kafkaTemplate);
    }

    // Hàm này sẽ được gọi khi VNPAY trả kết quả về
    public void publishPaymentResult(PaymentEvent payload) {
        send("payment_result_topic", payload);
    }
}