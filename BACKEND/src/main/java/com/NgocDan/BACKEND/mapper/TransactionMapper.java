package com.NgocDan.BACKEND.mapper;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import com.NgocDan.BACKEND.dto.response.AdminTransactionResponse;
import com.NgocDan.BACKEND.dto.response.TransactionDetailResponse;
import com.NgocDan.BACKEND.dto.response.TransactionResponse;
import com.NgocDan.BACKEND.model.Transaction;

@Mapper(componentModel = "spring")
public interface TransactionMapper {
    // này là map sang để hiển thị danh sách
    @Mapping(target = "transactionDate", source = "createdAt", qualifiedByName = "formatDate")
    @Mapping(target = "isPost", source = "post", qualifiedByName = "checkIsPost")
    TransactionResponse toTransactionResponse(Transaction transaction);

    List<TransactionResponse> toTransactionResponseList(List<Transaction> transactions);

    // này máp để xem chi tiết
    @Mapping(target = "transactionDate", source = "createdAt", qualifiedByName = "formatDate")
    @Mapping(target = "customerName", source = "user.fullName")
    @Mapping(target = "customerEmail", source = "user.email")
    @Mapping(target = "customerPhone", source = "user.phone") // Giả định Model User có field này
    @Mapping(target = "postId", source = "post.id")
    @Mapping(target = "postTitle", source = "post.title")
    @Mapping(target = "invoiceNo", source = "id", qualifiedByName = "generateInvoiceNo")
    TransactionDetailResponse toDetailResponse(Transaction transaction);

    // cho admin
    @Mapping(target = "ownerName", source = "user.fullName")
    @Mapping(target = "ownerEmail", source = "user.email")
    @Mapping(target = "createdAt", source = "createdAt", qualifiedByName = "formatDate")
    @Mapping(target = "isPost", source = "post", qualifiedByName = "checkIsPost")
    AdminTransactionResponse toAdminTransactionResponse(Transaction transaction);

    List<AdminTransactionResponse> toAdminTransactionResponseList(List<Transaction> transactions);

    @Named("formatDate")
    default String formatDate(LocalDateTime createdAt) {
        if (createdAt == null) return null;
        return createdAt.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"));
    }

    @Named(("checkIsPost"))
    default boolean checkIsPost(Object post) {
        return post != null;
    }

    @Named("generateInvoiceNo")
    default String generateInvoiceNo(Long id) {
        if (id == null) return null;
        return "INV-" + String.format("%06d", id); // Tạo mã dạng INV-000102
    }
}
