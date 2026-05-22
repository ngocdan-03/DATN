package com.NgocDan.BACKEND.service;

import com.NgocDan.BACKEND.enums.PostStatus;
import com.NgocDan.BACKEND.model.kafka.PostStatusEmailEvent;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.NgocDan.BACKEND.exception.AppException;
import com.NgocDan.BACKEND.exception.ErrorCode;
import com.NgocDan.BACKEND.model.redis.OtpEmail;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmailService {
    JavaMailSender mailSender;

    //-----------cho auth ---------------
    public void sendOtpEmail(OtpEmail otpEmail) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            // Lấy dữ liệu từ đối tượng otpEmail
            helper.setTo(otpEmail.getEmail());
            helper.setSubject(otpEmail.getPurpose().equals("verify") ? "Xác nhận tài khoản" : "Khôi phục mật khẩu");

            String content = "<h3>Mã xác nhận của bạn là: <b style='color: blue;'>" + otpEmail.getOtp() + "</b></h3>"
                    + "<p>Mã này có hiệu lực trong vài phút. Vui lòng không cung cấp mã này cho bất kỳ ai.</p>";

            helper.setText(content, true);
            mailSender.send(message);

            log.info("Email da duoc gui toi: {}", otpEmail.getEmail());
        } catch (MessagingException e) {
            log.error("Loi khi gui email toi {}: {}", otpEmail.getEmail(), e.getMessage());
            throw new AppException(ErrorCode.EMAIL_SEND_FAILED);
        }
    }

    //-----------cho admin khi xử lý post ---------------
    public void sendPostStatusEmail(PostStatusEmailEvent event) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(event.getEmail());
            helper.setSubject(buildPostStatusSubject(event.getPostStatus()));

            String content = buildPostStatusContent(event);

            helper.setText(content, true);
            mailSender.send(message);

            log.info("Email trang thai bai dang da duoc gui toi: {}", event.getEmail());
        }catch (MessagingException e) {
            log.error("Lỗi khi gửi email trạng thái bài đăng tới {}: {}", event.getEmail(), e.getMessage());
             throw new AppException(ErrorCode.EMAIL_SEND_FAILED);
        }
    }

    // hàm bổ trợ
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
