package com.kob.matchingsystem.service;

import com.kob.matchingsystem.mapper.MatchingMapper;
import com.kob.matchingsystem.utils.MatchingPool;
import org.springframework.stereotype.Service;

@Service
public class MatchingService implements MatchingMapper {

    public final static MatchingPool matchingPool = new MatchingPool();

    @Override
    public String addPlayer(Integer userId, Integer rating, Integer botId) {
        // System.out.println("addPlayer: " + userId + " " + rating);

        matchingPool.addPlayer(userId, rating, botId);

        return "addPlayer";
    }

    @Override
    public String removePlayer(Integer userId) {
        System.out.println("removePlayer: " + userId);

        matchingPool.removePlayer(userId);

        return "removePlayer";
    }
}
