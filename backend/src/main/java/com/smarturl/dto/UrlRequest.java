package com.smarturl.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UrlRequest {
    private String originalUrl;
    private String customShortCode;
    private LocalDateTime expiryDate;
}
