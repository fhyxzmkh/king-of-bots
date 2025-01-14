package com.kob.backend.service.user.bot;

import com.kob.backend.entity.Bot;
import com.kob.backend.entity.User;
import com.kob.backend.mapper.BotMapper;
import com.kob.backend.service.security.UserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class AddService {

    @Autowired
    private BotMapper botMapper;

    public Map<String, String> add(Map<String, String> data) {
        UsernamePasswordAuthenticationToken authenticationToken =
                (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();

        UserDetails loginUser = (UserDetails) authenticationToken.getPrincipal();
        User user = loginUser.getUser();

        String title = data.get("title");
        String description = data.get("description");
        String content = data.get("content");

        Map<String, String> response = new HashMap<>();

        if (title == null || title.isEmpty()) {
            response.put("message", "title is required");
            return response;
        }

        if (title.length() > 100) {
            response.put("message", "title is too long");
            return response;
        }

        if (description == null || description.isEmpty()) {
            description = "这个用户很懒，什么都没有写~";
        }

        if (description.length() > 300) {
            response.put("message", "description is too long");
            return response;
        }

        Date now = new Date();
        Bot bot = new Bot(null, user.getId(), title, description, content, 1500, now, now);

        botMapper.insert(bot);
        response.put("message", "success");

        return response;
    }

}
