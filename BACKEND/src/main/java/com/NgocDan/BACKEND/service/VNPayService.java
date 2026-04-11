package com.NgocDan.BACKEND.service;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.NgocDan.BACKEND.dto.request.PaymentRequest;
import com.NgocDan.BACKEND.dto.response.PaymentCallbackResponse;
import com.NgocDan.BACKEND.dto.response.PaymentResponse;
import com.NgocDan.BACKEND.enums.TransactionStatus;
import com.NgocDan.BACKEND.enums.TransactionType;
import com.NgocDan.BACKEND.enums.VNPayResponseCode;
import com.NgocDan.BACKEND.exception.AppException;
import com.NgocDan.BACKEND.exception.ErrorCode;
import com.NgocDan.BACKEND.model.Transaction;
import com.NgocDan.BACKEND.model.User;
import com.NgocDan.BACKEND.repository.TransactionRepository;
import com.NgocDan.BACKEND.repository.UserRepository;
import com.NgocDan.BACKEND.util.VNPayUtil;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VNPayService {
    @Value("${vnpay.tmn-code}")
    String tmnCode;

    @Value("${vnpay.hash-secret}")
    String hashSecret;

    @Value("${vnpay.url}")
    String vnpUrl;

    @Value("${vnpay.return-url}")
    String returnUrl;

    final TransactionRepository transactionRepository;
    final UserRepository userRepository;

    // tạo URL thanh toán VNPay
    @Transactional
    public PaymentResponse createPaymentUrl(PaymentRequest paymentRequest, HttpServletRequest request) {
        String vnp_TxnRef = VNPayUtil.getRandomNumber(8);
        String vnp_IpAddr = VNPayUtil.getIpAddress(request);

        // lấy user
        String sub = SecurityContextHolder.getContext().getAuthentication().getName();

        Long userId = Long.parseLong(sub);
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // tạo transaction với trạng thái PENDING
        Transaction transaction = Transaction.builder()
                .user(user)
                .amount(BigDecimal.valueOf(paymentRequest.getAmount()))
                .type(TransactionType.DEPOSIT)
                .description(paymentRequest.getDescription())
                .vnpTxnRef(vnp_TxnRef)
                .status(TransactionStatus.PENDING)
                .build();
        transactionRepository.save(transaction);

        // tạo map vnp_Params chứa các tham số cần thiết cho VNPay
        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", "2.1.0");
        vnp_Params.put("vnp_Command", "pay");
        vnp_Params.put("vnp_TmnCode", tmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(paymentRequest.getAmount() * 100)); // x100 theo chuẩn VNPay
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Nap tien:" + vnp_TxnRef);
        vnp_Params.put("vnp_OrderType", "other");
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", returnUrl);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);
        vnp_Params.put("vnp_CreateDate", new SimpleDateFormat("yyyyMMddHHmmss").format(new Date()));

        // Sắp xếp Alphabetical
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        for (Iterator<String> itr = fieldNames.iterator(); itr.hasNext(); ) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if (fieldValue != null && fieldValue.length() > 0) {
                hashData.append(fieldName).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII))
                        .append('=')
                        .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }

        String queryUrl = query.toString();
        String vnp_SecureHash = VNPayUtil.hmacSHA512(hashSecret, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;

        return PaymentResponse.builder().paymentUrl(vnpUrl + "?" + queryUrl).build();
    }

    // Xử lý phản hồi từ VNPay sau khi thanh toán
    @Transactional
    public PaymentCallbackResponse processCallback(Map<String, String> queryParams) {
        if (!verifySignature(queryParams)) {
            return PaymentCallbackResponse.builder()
                    .status("Failed")
                    .message("du liu khogn hop le")
                    .build();
        }

        String vnp_TxnRef = queryParams.get("vnp_TxnRef");
        String responseCode = queryParams.get("vnp_ResponseCode");

        Transaction transaction = transactionRepository
                .findByVnpTxnRef(vnp_TxnRef)
                .orElseThrow(() -> new AppException(ErrorCode.TRANSACTION_NOT_EXISTED));

        // cập nhất nếu chưa xử lý boiwr ipn
        if (TransactionStatus.PENDING.equals(transaction.getStatus())) {
            updateTransactionData(transaction, queryParams);
        }
        return PaymentCallbackResponse.builder()
                .status("00".equals(responseCode) ? "Success" : "Failed")
                .message(VNPayResponseCode.getMessage(responseCode))
                .amount(transaction.getAmount())
                .txnRef(vnp_TxnRef)
                .build();
    }

    // IPN endpoint để VNPay gọi lại
    @Transactional
    public Map<String, String> processIPN(Map<String, String> queryParams) {
        log.info("nhan thong bao IPN tu VNPay cho don hang: {}", queryParams.get("vnp_TxnRef"));

        // verify chữ kí
        if (!verifySignature(queryParams)) {
            return Map.of("RspCode", "97", "Message", "Invalid Checksum");
        }

        // kiểm tra transaction toonf tại chưa
        String vnp_TxnRef = queryParams.get("vnp_TxnRef");
        Transaction transaction =
                transactionRepository.findByVnpTxnRef(vnp_TxnRef).orElse(null);
        if (transaction == null) {
            return Map.of("RspCode", "01", "Message", "Order not found");
        }

        // kiểm tra số tiền vnp_amount trả về
        long vnp_Amount = Long.parseLong(queryParams.get("vnp_Amount")) / 100;
        if (transaction.getAmount().longValue() != vnp_Amount) {
            return Map.of("RspCode", "04", "Message", "Invalid amount");
        }

        // kiểm tra trạng thái transaction
        if (!TransactionStatus.PENDING.equals(transaction.getStatus())) {
            return Map.of("RspCode", "02", "Message", "Order already confirmed");
        }

        // cập nhật transaction và cộng tiền
        updateTransactionData(transaction, queryParams);

        return Map.of("RspCode", "00", "Message", "Confirm Success");
    }

    // hàm bổ trợ dùng chung
    // hàm update transaction status và balance user
    private void updateTransactionData(Transaction transaction, Map<String, String> queryParams) {
        String responseCode = queryParams.get("vnp_ResponseCode");

        if ("00".equals(responseCode)) {
            transaction.setStatus(TransactionStatus.SUCCESS);
            transaction.setVnpTransactionNo(queryParams.get("vnp_TransactionNo"));

            // Cộng tiền vào tài khoản user
            User user = transaction.getUser();
            user.setBalance(user.getBalance().add(transaction.getAmount()));
            userRepository.save(user);
        } else {
            transaction.setStatus(TransactionStatus.FAILED);
        }
        transactionRepository.save(transaction);
    }

    // hàm verify chữ kí
    private boolean verifySignature(Map<String, String> queryParams) {
        String vnp_SecureHash = queryParams.get("vnp_SecureHash");
        Map<String, String> fields = new HashMap<>(queryParams);
        fields.remove("vnp_SecureHash");
        fields.remove("vnp_SecureHashType");

        List<String> fieldNames = new ArrayList<>(fields.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        for (Iterator<String> itr = fieldNames.iterator(); itr.hasNext(); ) {
            String fieldName = itr.next();
            String fieldValue = fields.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                hashData.append(fieldName).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                if (itr.hasNext()) hashData.append('&');
            }
        }
        String checkSum = VNPayUtil.hmacSHA512(hashSecret, hashData.toString());
        return checkSum.equals(vnp_SecureHash);
    }
}
