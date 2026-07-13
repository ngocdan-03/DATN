package com.NgocDan.BACKEND.model.kafka;

import java.math.BigDecimal;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentEvent {
    String vnpTxnRef;
    String vnpTransactionNo;
    String responseCode;
    BigDecimal amount;
}
