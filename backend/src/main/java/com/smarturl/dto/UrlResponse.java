package com.smarturl.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class UrlResponse {
    private Long id;
    private String originalUrl;
    private String shortCode;
    private String shortUrl;
    private LocalDateTime createdAt;
    private LocalDateTime expiryDate;
    private int clickCount;
    private LocalDateTime lastAccessed;
}
