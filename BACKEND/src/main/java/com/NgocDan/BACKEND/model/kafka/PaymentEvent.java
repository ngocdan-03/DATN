package com.NgocDan.BACKEND.model.kafka;

import lombok.*;
import lombok.experimental.FieldDefaults;
import java.math.BigDecimal;

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