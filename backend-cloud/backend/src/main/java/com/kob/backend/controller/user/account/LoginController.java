package com.kob.backend.controller.user.account;

import com.kob.backend.service.user.account.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class LoginController {

    @Autowired
    private LoginService loginService;

    @PostMapping("/user/account/token")
    public Map<String, String> getToken(@RequestParam Map<String, String> map) {
        return loginService.getToken(map.get("username"), map.get("password"));
    }

}
