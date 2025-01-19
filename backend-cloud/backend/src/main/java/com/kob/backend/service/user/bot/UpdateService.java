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
public class UpdateService {

    @Autowired
    private BotMapper botMapper;

    public Map<String, String> update(Map<String, String> data) {
        UsernamePasswordAuthenticationToken authenticationToken =
                (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();

        UserDetails loginUser = (UserDetails) authenticationToken.getPrincipal();
        User user = loginUser.getUser();

        int bot_id = Integer.parseInt(data.get("bot_id"));
        Bot bot = botMapper.selectById(bot_id);

        Map<String, String> response = new HashMap<>();

        String title = data.get("title");
        String description = data.get("description");
        String content = data.get("content");

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

        if (bot == null) {
            response.put("message", "bot not found");
            return response;
        }

        if (!bot.getUserId().equals(user.getId())) {
            response.put("message", "permission denied");
            return response;
        }

        Bot newBot = new Bot(
                bot.getId(),
                user.getId(),
                title,
                description,
                content,
                bot.getCreateTime(),
                new Date()
        );

        botMapper.updateById(newBot);
        response.put("message", "success");

        return response;
    }

}
