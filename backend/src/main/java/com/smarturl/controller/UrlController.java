package com.smarturl.controller;

import com.smarturl.dto.UrlRequest;
import com.smarturl.dto.UrlResponse;
import com.smarturl.entity.User;
import com.smarturl.repository.UserRepository;
import com.smarturl.security.UserDetailsImpl;
import com.smarturl.service.UrlService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/urls")
public class UrlController {

    @Autowired
    private UrlService urlService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/shorten")
    public ResponseEntity<UrlResponse> createShortUrl(@RequestBody UrlRequest request) {
        User user = null;
        try {
            user = getCurrentUser();
        } catch (Exception e) {
            // Guest user
        }
        return ResponseEntity.ok(urlService.createShortUrl(request, user));
    }

    @GetMapping("/my")
    public ResponseEntity<List<UrlResponse>> getMyUrls() {
        User user = getCurrentUser();
        return ResponseEntity.ok(urlService.getUrlsByUser(user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUrl(@PathVariable Long id) {
        User user = getCurrentUser();
        urlService.deleteUrl(id, user);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/analytics")
    public ResponseEntity<List<UrlResponse>> getAnalytics() {
        User user = getCurrentUser();
        return ResponseEntity.ok(urlService.getUrlsByUser(user));
    }

    @GetMapping("/admin/all")
    public ResponseEntity<List<UrlResponse>> getAllUrls() {
        return ResponseEntity.ok(urlService.getAllUrls());
    }

    private User getCurrentUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User not found"));
    }
}
