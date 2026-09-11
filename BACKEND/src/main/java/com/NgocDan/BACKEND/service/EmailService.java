package com.NgocDan.BACKEND.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.NgocDan.BACKEND.enums.PostStatus;
import com.NgocDan.BACKEND.exception.AppException;
import com.NgocDan.BACKEND.exception.ErrorCode;
import com.NgocDan.BACKEND.model.kafka.PostStatusEmailEvent;
import com.NgocDan.BACKEND.model.redis.OtpEmail;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmailService {

    @Value("${brevo.api-key}")
    @NonFinal
    String brevoApiKey;

    @Value("${brevo.sender-name:RecoLand}")
    @NonFinal
    String senderName;

    @Value("${brevo.sender-email:buingocdan2005@gmail.com}")
    @NonFinal
    String senderEmail;

    @NonFinal
    RestTemplate restTemplate = new RestTemplate();

    private static final String BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

    /**
     * Hàm gọi chung gửi email qua HTTP REST API (Port 443 - không bao giờ bị Render chặn)
     */
    private void sendViaBrevoApi(String recipientEmail, String subject, String htmlContent) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("api-key", brevoApiKey);
            headers.set("accept", "application/json");

            // Cấu trúc payload theo chuẩn Brevo API
            Map<String, Object> body = Map.of(
                    "sender", Map.of("name", senderName, "email", senderEmail),
                    "to", List.of(Map.of("email", recipientEmail)),
                    "subject", subject,
                    "htmlContent", htmlContent
            );

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(BREVO_API_URL, requestEntity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("[Brevo API] Email đã được gửi thành công tới: {}", recipientEmail);
            } else {
                log.error("[Brevo API] Thất bại khi gửi email tới {}: {}", recipientEmail, response.getBody());
                throw new AppException(ErrorCode.EMAIL_SEND_FAILED);
            }

        } catch (Exception e) {
            log.error("[Brevo API] Ngoại lệ khi gửi email tới {}: {}", recipientEmail, e.getMessage());
            throw new AppException(ErrorCode.EMAIL_SEND_FAILED);
        }
    }

    // ----------- Cho Auth (Gửi OTP) ---------------
    public void sendOtpEmail(OtpEmail otpEmail) {
        String subject = otpEmail.getPurpose().equals("verify") ? "Xác nhận tài khoản" : "Khôi phục mật khẩu";

        String content = "<h3>Mã xác nhận của bạn là: <b style='color: blue;'>" + otpEmail.getOtp() + "</b></h3>"
                + "<p>Mã này có hiệu lực trong 3 phút. Vui lòng không cung cấp mã này cho bất kỳ ai.</p>";

        sendViaBrevoApi(otpEmail.getEmail(), subject, content);
    }

    // ----------- Cho Admin (Duyệt/Từ chối/Xóa Post) ---------------
    public void sendPostStatusEmail(PostStatusEmailEvent event) {
        String subject = buildPostStatusSubject(event.getPostStatus());
        String content = buildPostStatusContent(event);

        sendViaBrevoApi(event.getEmail(), subject, content);
    }

    private String buildPostStatusSubject(PostStatus status) {
        if (status == PostStatus.APPROVED) {
            return "Bài đăng của bạn đã được duyệt";
        }
        if (status == PostStatus.REJECTED) {
            return "Bài đăng của bạn đã bị từ chối";
        }
        if (status == PostStatus.DELETED) {
            return "Bài đăng của bạn đã bị xóa";
        }
        return "Cập nhật trạng thái bài đăng";
    }

    private String buildPostStatusContent(PostStatusEmailEvent event) {
        String statusMessage;

        if (event.getPostStatus() == PostStatus.APPROVED) {
            statusMessage = "Bài đăng của bạn đã được quản trị viên duyệt và hiện đã được hiển thị trên hệ thống.";
        } else if (event.getPostStatus() == PostStatus.REJECTED) {
            statusMessage = "Bài đăng của bạn đã bị quản trị viên từ chối. Vui lòng kiểm tra và chỉnh sửa lại thông tin bài đăng nếu cần.";
        } else if (event.getPostStatus() == PostStatus.DELETED) {
            statusMessage = "Bài đăng của bạn đã bị quản trị viên xóa khỏi hệ thống.";
        } else {
            statusMessage = "Bài đăng của bạn vừa được cập nhật trạng thái.";
        }

        return "<h3>Xin chào " + event.getFullName() + ",</h3>"
                + "<p>Bài đăng: <b>" + event.getPostTitle() + "</b></p>"
                + "<p>" + statusMessage + "</p>"
                + "<p>Cảm ơn bạn đã sử dụng hệ thống RecoLand.</p>";
    }
}
