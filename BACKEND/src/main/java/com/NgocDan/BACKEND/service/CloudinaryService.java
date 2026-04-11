package com.NgocDan.BACKEND.service;

import java.io.IOException;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CloudinaryService {
    Cloudinary cloudinary;

    public String uploadFile(MultipartFile file, String folderName) {
        try {
            Map options = ObjectUtils.asMap("folder", "recoland/" + folderName, "resource_type", "auto");
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), options);
            return uploadResult.get("secure_url").toString();
        } catch (IOException e) {
            log.error("Error uploading file to Cloudinary", e);
            throw new RuntimeException("Failed to upload file" + e.getMessage());
        }
    }

    public void deleteFileByUrl(String Url) {
        if (Url == null || Url.isEmpty()) {
            return;
        }
        try {
            String publicId = extractPublicId(Url);
            if (publicId != null) {
                cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
                log.info("Deleted file from Cloudinary with public ID: " + publicId);
            }
        } catch (IOException e) {
            log.error("Error deleting file from Cloudinary with URL: " + Url, e);
            throw new RuntimeException("Failed to delete file" + e.getMessage());
        }
    }
    // hàm bổ trợ
    private String extractPublicId(String url) {
        try {
            int start = url.indexOf("recoland/");
            int end = url.lastIndexOf(".");
            return url.substring(start, end);
        } catch (Exception e) {
            log.error("Error extracting public ID from URL: " + url, e);
            return null;
        }
    }
}
