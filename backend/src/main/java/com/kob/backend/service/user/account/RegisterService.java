package com.kob.backend.service.user.account;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.kob.backend.entity.User;
import com.kob.backend.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RegisterService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Map<String, String> register(String username, String password, String confirmPassword) {
        Map<String, String> response = new HashMap<>();

        if (username == null || username.isEmpty()) {
            response.put("error_message", "Username is required");
            return response;
        }

        if (password == null || password.isEmpty()) {
            response.put("error_message", "Password is required");
            return response;
        }

        if (confirmPassword == null || confirmPassword.isEmpty()) {
            response.put("error_message", "Confirm password is required");
            return response;
        }

        username = username.trim();
        if (username.length() < 3 || username.length() > 30) {
            response.put("message", "Username must be between 3 and 30 characters");
            return response;
        }

        if (password.length() < 3 || password.length() > 60) {
            response.put("message", "Password must be between 3 and 60 characters");
            return response;
        }

        if (!password.equals(confirmPassword)) {
            response.put("message", "Passwords do not match");
            return response;
        }

        // 用户名不能重复
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("username", username);
        List<User> users = userMapper.selectList(queryWrapper);
        if (!users.isEmpty()) {
            response.put("message", "Username already exists");
            return response;
        }

        String encodedPassword = passwordEncoder.encode(password);
        String avatar = "https://api.multiavatar.com/Binx Bond.png";

        User user = new User(null, username, encodedPassword, avatar);
        userMapper.insert(user);

        response.put("message", "success");
        return response;
    }

}
