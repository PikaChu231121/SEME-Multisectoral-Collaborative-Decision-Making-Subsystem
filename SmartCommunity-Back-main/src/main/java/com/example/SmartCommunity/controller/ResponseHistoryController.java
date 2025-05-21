package com.example.SmartCommunity.controller;

import com.example.SmartCommunity.service.ResponseHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/response-history")
@RequiredArgsConstructor
public class ResponseHistoryController {

    private final ResponseHistoryService responseHistoryService;

    // 获取所有响应记录简要信息
    @GetMapping
    public List<Map<String, Object>> getAllResponseEvents() {
        return responseHistoryService.getAllEvents();
    }

    // 获取单条记录详情
    @GetMapping("/{id}")
    public List<Map<String, Object>> getResponseEventDetail(@PathVariable Long id) {
        return responseHistoryService.getEventDetail(id);
    }
}
