package com.NgocDan.BACKEND.dto.response;

import com.NgocDan.BACKEND.enums.TransactionStatus;
import com.NgocDan.BACKEND.enums.TransactionType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdminTransactionResponse {
    Long id;
    String ownerName;
    String ownerEmail;
    BigDecimal amount;
    TransactionType type;
    TransactionStatus status;
    boolean isPost;
    String description;
    String vnpTxnRef;
    String createdAt;
}
