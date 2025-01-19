package com.kob.backend.service.user.bot;

import com.kob.backend.entity.Bot;
import com.kob.backend.entity.User;
import com.kob.backend.mapper.BotMapper;
import com.kob.backend.service.security.UserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class RemoveService {

    @Autowired
    private BotMapper botMapper;

    public Map<String, String> remove(Map<String, String> data) {
        UsernamePasswordAuthenticationToken authenticationToken =
                (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();

        UserDetails loginUser = (UserDetails) authenticationToken.getPrincipal();
        User user = loginUser.getUser();

        int bot_id = Integer.parseInt(data.get("bot_id"));

        Bot bot = botMapper.selectById(bot_id);

        Map<String, String> response = new HashMap<>();

        if (bot == null) {
            response.put("message", "bot not found");
            return response;
        }

        if (!bot.getUserId().equals(user.getId())) {
            response.put("message", "permission denied");
            return response;
        }

        botMapper.deleteById(bot_id);
        response.put("message", "success");

        return response;
    }
}
