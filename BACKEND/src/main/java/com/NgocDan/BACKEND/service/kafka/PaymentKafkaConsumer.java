package com.NgocDan.BACKEND.service.kafka;

import com.NgocDan.BACKEND.enums.TransactionStatus;
import com.NgocDan.BACKEND.model.Transaction;
import com.NgocDan.BACKEND.model.User;
import com.NgocDan.BACKEND.model.kafka.PaymentEvent;
import com.NgocDan.BACKEND.repository.TransactionRepository;
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
public class PaymentKafkaConsumer {

    TransactionRepository transactionRepository;
    UserRepository userRepository;

    @KafkaListener(topics = "payment_result_topic", groupId = "real-estate-group")
    @Transactional
    public void listen(PaymentEvent payload) {
        log.info("[Kafka] Bat dau xu ly thanh toan cho ma giao dich: {}", payload.getVnpTxnRef());
        try {
            Transaction transaction = transactionRepository.findByVnpTxnRef(payload.getVnpTxnRef()).orElse(null);

            // Chỉ cộng tiền nếu trạng thái đang là PENDING (Chống cộng tiền 2 lần)
            if (transaction == null || !TransactionStatus.PENDING.equals(transaction.getStatus())) {
                log.info("[Kafka] Giao dich {} da duoc xu ly hoac khong ton tai. Bo qua.", payload.getVnpTxnRef());
                return;
            }

            // Nếu VNPAY báo thành công (mã 00)
            if ("00".equals(payload.getResponseCode())) {
                transaction.setStatus(TransactionStatus.SUCCESS);
                transaction.setVnpTransactionNo(payload.getVnpTransactionNo());

                // Cộng tiền vào tài khoản User
                User user = transaction.getUser();
                user.setBalance(user.getBalance().add(payload.getAmount()));
                userRepository.save(user);

                log.info("[Kafka] Da cong {} VND cho user ID: {}", payload.getAmount(), user.getId());
            } else {
                // Nếu thanh toán thất bại
                transaction.setStatus(TransactionStatus.FAILED);
                log.error("[Kafka] Giao dich {} that bai/huy bo.", payload.getVnpTxnRef());
            }
            // Lưu trạng thái giao dịch
            transactionRepository.save(transaction);

        } catch (Exception e) {
            log.error("[Kafka] Loi nghiem trong khi xu ly thanh toan ma {}: {}", payload.getVnpTxnRef(), e.getMessage());
        }
    }
}