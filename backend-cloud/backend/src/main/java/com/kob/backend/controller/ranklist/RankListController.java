package com.kob.backend.controller.ranklist;

import com.alibaba.fastjson.JSONObject;
import com.kob.backend.service.ranklist.RankListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class RankListController {

    @Autowired
    private RankListService rankListService;

    @GetMapping("/ranklist/getList")
    public JSONObject getList(@RequestParam Map<String, String> data) {

        Integer page = Integer.parseInt(data.get("page"));
        Integer pageSize = Integer.parseInt(data.get("page_size"));

        return rankListService.getList(page, pageSize);
    }
}
