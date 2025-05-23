package com.example.SmartCommunity.controller;

import com.example.SmartCommunity.service.ResponseHistoryService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ResponseHistoryController.class)
public class ResponseHistoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ResponseHistoryService responseHistoryService;

    @Test
    void getAllResponseEvents_shouldReturnListOfEvents() throws Exception {
        // 准备模拟数据 (与 ResponseHistoryService.getAllEvents() 返回结构一致)
        Map<String, Object> event1 = new HashMap<>();
        event1.put("id", 1L);
        event1.put("departments", Arrays.asList("Dept A", "Dept B"));
        event1.put("createdAt", LocalDateTime.now().toString()); // 或者使用实际的 Date/Timestamp 对象

        Map<String, Object> event2 = new HashMap<>();
        event2.put("id", 2L);
        event2.put("departments", Arrays.asList("Dept C"));
        event2.put("createdAt", LocalDateTime.now().minusDays(1).toString());

        List<Map<String, Object>> mockEvents = Arrays.asList(event1, event2);

        // 模拟 service 方法的行为
        when(responseHistoryService.getAllEvents()).thenReturn(mockEvents);

        // 执行 GET 请求并验证结果
        mockMvc.perform(get("/api/response-history")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(mockEvents.size()))
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].departments[0]").value("Dept A"))
                .andExpect(jsonPath("$[0].createdAt").exists()) // 验证时间戳存在
                .andExpect(jsonPath("$[1].id").value(2L))
                .andExpect(jsonPath("$[1].departments[0]").value("Dept C"));
    }

    @Test
    void getResponseEventDetail_shouldReturnEventDetail() throws Exception {
        // 准备模拟数据 (与 ResponseHistoryService.getEventDetail() 返回结构一致)
        Long eventId = 1L;

        Map<String, String> action1_1 = new HashMap<>();
        action1_1.put("departmentName", "Fire Department");
        action1_1.put("actionName", "Dispatch Unit");
        action1_1.put("actionDetail", "Unit 101 dispatched.");

        Map<String, String> action1_2 = new HashMap<>();
        action1_2.put("departmentName", "Police Department");
        action1_2.put("actionName", "Secure Area");
        action1_2.put("actionDetail", "Perimeter secured.");

        Map<String, Object> stage1 = new HashMap<>();
        stage1.put("timeRange", "10:00-10:05");
        stage1.put("actions", Arrays.asList(action1_1, action1_2));

        Map<String, String> action2_1 = new HashMap<>();
        action2_1.put("departmentName", "Medical Team");
        action2_1.put("actionName", "Provide Aid");
        action2_1.put("actionDetail", "First aid administered.");

        Map<String, Object> stage2 = new HashMap<>();
        stage2.put("timeRange", "10:05-10:15");
        stage2.put("actions", List.of(action2_1));

        List<Map<String, Object>> mockEventDetail = Arrays.asList(stage1, stage2);

        // 模拟 service 方法的行为
        when(responseHistoryService.getEventDetail(eventId)).thenReturn(mockEventDetail);

        // 执行 GET 请求并验证结果
        mockMvc.perform(get("/api/response-history/{id}", eventId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(mockEventDetail.size()))
                .andExpect(jsonPath("$[0].timeRange").value("10:00-10:05"))
                .andExpect(jsonPath("$[0].actions.length()").value(2))
                .andExpect(jsonPath("$[0].actions[0].departmentName").value("Fire Department"))
                .andExpect(jsonPath("$[0].actions[0].actionName").value("Dispatch Unit"))
                .andExpect(jsonPath("$[0].actions[0].actionDetail").value("Unit 101 dispatched."))
                .andExpect(jsonPath("$[1].timeRange").value("10:05-10:15"))
                .andExpect(jsonPath("$[1].actions[0].actionName").value("Provide Aid"));
    }

    @Test
    void getResponseEventDetail_shouldReturnEmptyListWhenEventDoesNotExist() throws Exception {
        // 准备模拟数据
        Long nonExistentEventId = 99L;

        // 模拟 service 方法的行为，当事件不存在时返回空列表
        when(responseHistoryService.getEventDetail(nonExistentEventId)).thenReturn(List.of());

        // 执行 GET 请求并验证结果
        mockMvc.perform(get("/api/response-history/{id}", nonExistentEventId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()) // 假设即使找不到也返回200 OK 和空列表
                .andExpect(jsonPath("$.length()").value(0));
    }
}