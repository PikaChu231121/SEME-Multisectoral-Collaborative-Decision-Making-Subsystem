package com.example.SmartCommunity.controller;

import com.example.SmartCommunity.dto.DepartmentTask;
import com.example.SmartCommunity.dto.TimelineDTO;
import com.example.SmartCommunity.dto.TimelineEntry;
import com.example.SmartCommunity.service.AiAssistantService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AiAssistantController.class)
public class AiAssistantControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AiAssistantService aiAssistantService;

    @Test
    public void testReceiveFireResponse() throws Exception {
        // 构建 TimelineDTO
        TimelineDTO timelineDTO = new TimelineDTO();

        // 设置部门列表
        List<String> departments = Arrays.asList("消防部门", "医疗部门", "警察部门", "社区管理");
        timelineDTO.setDepartments(departments);

        // 构建时间轴条目
        List<TimelineEntry> timeline = new ArrayList<>();

        // 时间点 1
        Map<String, DepartmentTask> actions1 = new HashMap<>();
        actions1.put("消防部门", new DepartmentTask("接到火警报告", "报告地点：A栋公寓楼"));
        timeline.add(new TimelineEntry("2024-05-20 10:00:00", actions1));

        // 时间点 2
        Map<String, DepartmentTask> actions2 = new HashMap<>();
        actions2.put("消防部门", new DepartmentTask("消防车出发", "车辆编号：消防车01，预计到达时间：10:15:00"));
        timeline.add(new TimelineEntry("2024-05-20 10:05:00", actions2));

        // 时间点 3
        Map<String, DepartmentTask> actions3 = new HashMap<>();
        actions3.put("社区管理", new DepartmentTask("通知医疗和警察部门", "请求支援"));
        timeline.add(new TimelineEntry("2024-05-20 10:10:00", actions3));

        timelineDTO.setTimeline(timeline);

        // 执行测试请求
        mockMvc.perform(post("/api/ai-assistant/receive-fire-response")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(timelineDTO)))
                .andExpect(status().isOk())
                .andExpect(content().string("火灾响应数据已成功接收并转发！"));
    }
}
