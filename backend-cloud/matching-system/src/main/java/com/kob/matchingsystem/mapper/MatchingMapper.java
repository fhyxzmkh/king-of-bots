package com.kob.matchingsystem.mapper;

public interface MatchingMapper {

    String addPlayer(Integer userId, Integer rating);

    String removePlayer(Integer userId);

}
