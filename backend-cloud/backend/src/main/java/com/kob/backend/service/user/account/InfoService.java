package com.kob.backend.service.user.account;

import com.kob.backend.entity.User;
import com.kob.backend.service.security.UserDetails;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class InfoService {

    public Map<String, String> getInfo() {
        UsernamePasswordAuthenticationToken authenticationToken =
                (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();

        UserDetails loginUser = (UserDetails) authenticationToken.getPrincipal();
        User user = loginUser.getUser();

        Map<String, String> response = new HashMap<>();
        response.put("message", "success");
        response.put("id", user.getId().toString());
        response.put("username", user.getUsername());
        response.put("avatar", user.getAvatar());

        return response;
    }

}
