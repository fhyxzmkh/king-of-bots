package com.kob.matchingsystem.mapper;

public interface MatchingMapper {

    String addPlayer(Integer userId, Integer rating, Integer botId);

    String removePlayer(Integer userId);

}
