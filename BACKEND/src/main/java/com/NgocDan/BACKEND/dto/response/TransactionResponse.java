package com.NgocDan.BACKEND.dto.response;

import java.math.BigDecimal;

import com.NgocDan.BACKEND.enums.TransactionStatus;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TransactionResponse {
    Long id;
    BigDecimal amount;
    String description;
    String transactionDate;
    TransactionStatus status;

    boolean isPost;
}
