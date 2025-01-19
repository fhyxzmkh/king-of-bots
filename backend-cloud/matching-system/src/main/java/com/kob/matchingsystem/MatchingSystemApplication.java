package com.kob.matchingsystem;

import com.kob.matchingsystem.service.MatchingService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MatchingSystemApplication {
    public static void main(String[] args) {
        MatchingService.matchingPool.start();
        SpringApplication.run(MatchingSystemApplication.class, args);
    }
}