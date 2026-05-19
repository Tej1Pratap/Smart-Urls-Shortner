package com.smarturl.service;

import com.smarturl.dto.UrlRequest;
import com.smarturl.dto.UrlResponse;
import com.smarturl.entity.Url;
import com.smarturl.entity.User;
import com.smarturl.repository.UrlRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class UrlService {

    @Autowired
    private UrlRepository urlRepository;

    @org.springframework.beans.factory.annotation.Value("${smarturl.base-url}")
    private String baseUrl;

    private static final String ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    public UrlResponse createShortUrl(UrlRequest request, User user) {
        String shortCode = request.getCustomShortCode();
        if (shortCode == null || shortCode.isEmpty()) {
            shortCode = generateUniqueShortCode();
        } else if (urlRepository.findByShortCode(shortCode).isPresent()) {
            throw new RuntimeException("Custom short code already exists");
        }

        Url url = new Url();
        url.setOriginalUrl(request.getOriginalUrl());
        url.setShortCode(shortCode);
        url.setCreatedAt(LocalDateTime.now());
        url.setExpiryDate(request.getExpiryDate());
        url.setUser(user);

        Url savedUrl = urlRepository.save(url);
        return mapToResponse(savedUrl);
    }

    public String getOriginalUrl(String shortCode) {
        Url url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new RuntimeException("URL not found"));

        if (url.getExpiryDate() != null && url.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("URL has expired");
        }

        url.setClickCount(url.getClickCount() + 1);
        url.setLastAccessed(LocalDateTime.now());
        urlRepository.save(url);

        return url.getOriginalUrl();
    }

    public List<UrlResponse> getUrlsByUser(User user) {
        return urlRepository.findByUser(user).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<UrlResponse> getAllUrls() {
        return urlRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void deleteUrl(Long id, User user) {
        Url url = urlRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("URL not found"));
        
        if (!url.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to delete this URL");
        }
        
        urlRepository.delete(url);
    }

    private String generateUniqueShortCode() {
        String code;
        do {
            code = generateRandomCode(6);
        } while (urlRepository.findByShortCode(code).isPresent());
        return code;
    }

    private String generateRandomCode(int length) {
        Random random = new Random();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < length; i++) {
            sb.append(ALPHABET.charAt(random.nextInt(ALPHABET.length())));
        }
        return sb.toString();
    }

    private UrlResponse mapToResponse(Url url) {
        return UrlResponse.builder()
                .id(url.getId())
                .originalUrl(url.getOriginalUrl())
                .shortCode(url.getShortCode())
                .shortUrl(baseUrl + "/" + url.getShortCode())
                .createdAt(url.getCreatedAt())
                .expiryDate(url.getExpiryDate())
                .clickCount(url.getClickCount())
                .lastAccessed(url.getLastAccessed())
                .build();
    }
}
