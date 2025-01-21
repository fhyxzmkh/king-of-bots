package com.kob.botrunningsystem.service;

import com.kob.botrunningsystem.mapper.BotRunningMapper;
import com.kob.botrunningsystem.service.utils.BotPool;
import org.springframework.stereotype.Service;

@Service
public class BotRunningService implements BotRunningMapper {

    public final static BotPool botPool = new BotPool();

    @Override
    public String addBot(Integer userId, String botCode, String input) {
        // System.out.println("Add bot: " + userId + "\ncode:" + botCode + "\nwith input: " + input);

        botPool.addBot(userId, botCode, input);

        return "Bot added successfully";
    }

}
