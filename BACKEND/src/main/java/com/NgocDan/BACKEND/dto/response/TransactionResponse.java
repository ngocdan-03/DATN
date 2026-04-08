package com.NgocDan.BACKEND.dto.response;

import com.NgocDan.BACKEND.enums.TransactionStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;


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

    boolean isPost ;
}
