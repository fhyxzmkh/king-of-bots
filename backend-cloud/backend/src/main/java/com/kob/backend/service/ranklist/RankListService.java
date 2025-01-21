package com.kob.backend.service.ranklist;

import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.kob.backend.entity.User;
import com.kob.backend.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RankListService {

    @Autowired
    private UserMapper userMapper;

    public JSONObject getList(Integer page, Integer pageSize) {
        IPage<User> userIPage = new Page<>(page, pageSize);
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.orderByDesc("rating");

        List<User> users = userMapper.selectPage(userIPage, queryWrapper).getRecords();
        JSONObject resp = new JSONObject();

        for (User user : users) {
            user.setPassword("");
        }

        resp.put("users", users);
        resp.put("users_count", userMapper.selectCount(null));

        return resp;
    }

}
