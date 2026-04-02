package com.NgocDan.BACKEND.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.*;

import org.hibernate.annotations.CreationTimestamp;

import com.NgocDan.BACKEND.enums.TransactionStatus;
import com.NgocDan.BACKEND.enums.TransactionType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
@Entity
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    @Column(nullable = false)
    BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    TransactionType type;

    String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    Post post; // Có thể null nếu nạp tiền bình thường

    @Column(length = 100)
    String vnpTxnRef;

    @Column(length = 100)
    String vnpTransactionNo;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    TransactionStatus status = TransactionStatus.PENDING;

    @CreationTimestamp
    LocalDateTime createdAt;
}
