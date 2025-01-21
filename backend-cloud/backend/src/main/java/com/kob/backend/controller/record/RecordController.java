package com.kob.backend.controller.record;

import com.alibaba.fastjson.JSONObject;
import com.kob.backend.service.record.RecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class RecordController {

    @Autowired
    private RecordService recordService;

    @GetMapping("/record/getList")
    public JSONObject getList(@RequestParam Map<String, String> data) {
        Integer page = Integer.parseInt(data.get("page"));
        Integer pageSize = Integer.parseInt(data.get("page_size"));
        return recordService.getList(page, pageSize);
    }

}
