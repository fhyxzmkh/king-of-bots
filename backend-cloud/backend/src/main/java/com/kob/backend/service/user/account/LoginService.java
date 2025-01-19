package com.kob.backend.service.user.account;

import com.kob.backend.entity.User;
import com.kob.backend.service.security.UserDetails;
import com.kob.backend.service.security.UserDetailsServiceImpl;
import com.kob.backend.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class LoginService {

    @Autowired
    private AuthenticationManager authenticationManager;

    public Map<String, String> getToken(String username, String password) {

        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(username, password);

        Authentication authenticate = authenticationManager.authenticate(authenticationToken);

        UserDetails loginUser = (UserDetails) authenticate.getPrincipal();

        User user = loginUser.getUser();

        String jwt = JwtUtil.createJWT(user.getId().toString());

        Map<String, String> response = new java.util.HashMap<>();
        response.put("message", "success");
        response.put("token", jwt);

        return response;
    }

}
