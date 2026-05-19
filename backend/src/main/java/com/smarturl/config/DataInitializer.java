package com.smarturl.config;

import com.smarturl.entity.User;
import com.smarturl.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        userRepository.findByEmail("tejpratap11102@gmail.com").ifPresent(user -> {
            userRepository.delete(user);
        });
        
        User admin = new User();
        admin.setUsername("admin");
        admin.setEmail("tejpratap11102@gmail.com");
        admin.setPassword(passwordEncoder.encode("Tej@11"));
        admin.setRole("ROLE_ADMIN");
        userRepository.save(admin);
        System.out.println("Admin user FORCE RECREATED: tejpratap11102@gmail.com / Tej@11");
    }
}
