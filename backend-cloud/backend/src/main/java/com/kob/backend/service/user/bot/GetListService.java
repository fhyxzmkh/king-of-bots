package com.kob.backend.service.user.bot;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.kob.backend.entity.Bot;
import com.kob.backend.entity.User;
import com.kob.backend.mapper.BotMapper;
import com.kob.backend.service.security.UserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GetListService {

    @Autowired
    private BotMapper botMapper;

    public List<Bot> getList() {
        UsernamePasswordAuthenticationToken authenticationToken =
                (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();

        UserDetails loginUser = (UserDetails) authenticationToken.getPrincipal();
        User user = loginUser.getUser();

        QueryWrapper<Bot> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_id", user.getId());

        return botMapper.selectList(queryWrapper);
    }
}
