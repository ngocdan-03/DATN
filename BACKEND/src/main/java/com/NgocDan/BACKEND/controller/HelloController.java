package com.NgocDan.BACKEND.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController // Đánh dấu đây là nơi xử lý API
public class HelloController {

    @GetMapping("/hello") // Khi vào địa chỉ /hello sẽ chạy hàm này
    public String sayHello() {
        return "Chào Dân! Ứng dụng BĐS đã khởi chạy thành công rực rỡ! 🏘️🚀";
    }
}
