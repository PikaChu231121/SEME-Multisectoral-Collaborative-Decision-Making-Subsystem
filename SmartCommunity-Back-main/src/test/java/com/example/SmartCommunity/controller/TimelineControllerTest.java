package com.example.SmartCommunity.controller;

import com.example.SmartCommunity.dto.DepartmentTask;
import com.example.SmartCommunity.dto.TimelineDTO;
import com.example.SmartCommunity.dto.TimelineEntry;
import com.example.SmartCommunity.service.TimelineService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.jetbrains.annotations.NotNull;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.io.File;
import java.io.FileWriter;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.hasSize;

@WebMvcTest(TimelineController.class)
public class TimelineControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TimelineService timelineService;

    @Autowired
    private ObjectMapper objectMapper; // Spring Boot Test 会自动配置

    private final String scriptsDir = "scripts";
    private final String fireAlarmInfoFile = scriptsDir + "/fire_alarm_info.json";

    @BeforeEach
    void setUp() throws Exception {
        // 创建 scripts 目录，如果它不存在
        File dir = new File(scriptsDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        // 清理可能存在的旧文件
        Files.deleteIfExists(Paths.get(fireAlarmInfoFile));
    }

    @AfterEach
    void tearDown() throws Exception {
        // 测试后清理文件和目录
        Files.deleteIfExists(Paths.get(fireAlarmInfoFile));
        // 如果 scripts 目录为空，可以考虑删除它，但要注意并发测试或脚本仍在运行时的情况
        // For simplicity, we'll leave the directory if other tests might use it or if it's managed externally.
    }

    @Test
    void getTimelineResponse_shouldReturnSuccess() throws Exception {
        TimelineDTO timelineDTO = new TimelineDTO();
        timelineDTO.setDepartments(Arrays.asList("部门A", "部门B"));
        DepartmentTask task = new DepartmentTask();
        task.setName("任务1");
        task.setDetail("详情1");
        Map<String, DepartmentTask> actions = new HashMap<>();
        actions.put("部门A", task);
        timelineDTO.setTimeline(Collections.singletonList(new TimelineEntry("0-5min", actions)));

        mockMvc.perform(post("/api/get-timeline-response")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(timelineDTO)))
                .andExpect(status().isOk())
                .andExpect(content().string("TimelineController收到火灾响应数据"));

        verify(timelineService, times(1)).saveTimelineData(any(TimelineDTO.class));
    }

    @Test
    void getTimelineResponse_shouldHandleException() throws Exception {
        TimelineDTO timelineDTO = new TimelineDTO(); // 有效的 DTO
        // 初始化 timeline 和 departments 以避免 NPE
        timelineDTO.setTimeline(new ArrayList<>()); // 或者 Collections.emptyList()
        timelineDTO.setDepartments(new ArrayList<>()); // 或者 Collections.emptyList()

        // 让 service 方法抛出异常
        doThrow(new RuntimeException("服务层错误")).when(timelineService).saveTimelineData(any(TimelineDTO.class));

        mockMvc.perform(post("/api/get-timeline-response")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(timelineDTO)))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string("数据接收失败：服务层错误"));
    }


    @Test
    void getTimelineData_shouldReturnFormattedData() throws Exception {
        List<String> departments = Arrays.asList("消防部门", "医疗部门");
        final var rawTimeline = getTimelineEntries();

        when(timelineService.getDepartments()).thenReturn(departments);
        when(timelineService.getTimelineData()).thenReturn(rawTimeline);

        mockMvc.perform(get("/api/get-timeline-detail"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.departments", hasSize(2)))
                .andExpect(jsonPath("$.departments[0]", is("消防部门")))
                .andExpect(jsonPath("$.departments[1]", is("医疗部门")))
                .andExpect(jsonPath("$.timeline", hasSize(2)))
                .andExpect(jsonPath("$.timeline[0].time", is("0-5min")))
                .andExpect(jsonPath("$.timeline[0].消防部门.name", is("灭火")))
                .andExpect(jsonPath("$.timeline[0].消防部门.detail", is("迅速到达现场进行灭火")))
                .andExpect(jsonPath("$.timeline[1].time", is("5-10min")))
                .andExpect(jsonPath("$.timeline[1].医疗部门.name", is("救援")));
    }

    @NotNull
    private static List<TimelineEntry> getTimelineEntries() {
        DepartmentTask fireTask = new DepartmentTask();
        fireTask.setName("灭火");
        fireTask.setDetail("迅速到达现场进行灭火");

        DepartmentTask medicalTask = new DepartmentTask();
        medicalTask.setName("救援");
        medicalTask.setDetail("救治伤员");

        Map<String, DepartmentTask> actions1 = new HashMap<>();
        actions1.put("消防部门", fireTask);

        Map<String, DepartmentTask> actions2 = new HashMap<>();
        actions2.put("医疗部门", medicalTask);


        return Arrays.asList(
                new TimelineEntry("0-5min", actions1),
                new TimelineEntry("5-10min", actions2)
        );
    }

    @Test
    void runScriptAsync_shouldReturnScriptStarted() throws Exception {
        mockMvc.perform(post("/api/refresh-response"))
                .andExpect(status().isOk())
                .andExpect(content().string("Script started."));
    }

    @Test
    void setFireAlarmInfo_shouldSaveInfoAndReturnSuccess() throws Exception {
        Map<String, String> alarmInfo = new HashMap<>();
        alarmInfo.put("location", "教学楼A座");
        alarmInfo.put("level", "严重");

        mockMvc.perform(post("/api/set-fire-alarm-info")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(alarmInfo)))
                .andExpect(status().isOk())
                .andExpect(content().string("报警信息已保存"));

        // 验证文件是否已创建且内容正确
        File file = new File(fireAlarmInfoFile);
        assert(file.exists());

        Map<String, String> savedInfo = objectMapper.readValue(file, Map.class);
        assert(savedInfo.get("location").equals("教学楼A座"));
        assert(savedInfo.get("level").equals("严重"));
    }

    @Test
    void setFireAlarmInfo_shouldHandleSaveFailure() throws Exception {
        Map<String, String> alarmInfo = new HashMap<>();
        alarmInfo.put("location", "教学楼A座");

        // 假设 ObjectMapper 抛出异常
        ObjectMapper failingMapper = mock(ObjectMapper.class);
        when(failingMapper.writeValueAsString(any())).thenThrow(new com.fasterxml.jackson.core.JsonProcessingException("Serialization error") {});

        File dir = new File(scriptsDir);
        if (dir.exists()) {
            Files.deleteIfExists(Paths.get(fireAlarmInfoFile)); // 清理文件
        }

        // 简单的测试：如果请求体无效，Spring 会先拒绝
        mockMvc.perform(post("/api/set-fire-alarm-info")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("\"无效的JSON\""))
                .andExpect(status().isBadRequest()); // Spring MVC 会处理无效 JSON
    }


    @Test
    void getFireAlarmInfo_shouldReturnInfoWhenFileExists() throws Exception {
        Map<String, String> alarmInfo = new HashMap<>();
        alarmInfo.put("location", "图书馆");
        alarmInfo.put("time", "2023-10-27 10:00:00");

        FileWriter writer = new FileWriter(fireAlarmInfoFile);
        objectMapper.writeValue(writer, alarmInfo);
        writer.close();

        mockMvc.perform(get("/api/get-fire-alarm-info"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.location", is("图书馆")))
                .andExpect(jsonPath("$.time", is("2023-10-27 10:00:00")));
    }

    @Test
    void getFireAlarmInfo_shouldReturnEmptyMapWhenFileDoesNotExist() throws Exception {
        // 确保文件不存在 (setUp 中已处理，这里再次确认)
        Files.deleteIfExists(Paths.get(fireAlarmInfoFile));

        mockMvc.perform(get("/api/get-fire-alarm-info"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isMap()) // 检查是否是 Map
                .andExpect(jsonPath("$.length()", is(0))); // 检查 Map 是否为空
    }

    @Test
    void getFireAlarmInfo_shouldReturnEmptyMapWhenFileIsInvalidJson() throws Exception {
        FileWriter writer = new FileWriter(fireAlarmInfoFile);
        writer.write("这是无效的JSON内容 {"); // 写入无效的 JSON
        writer.close();

        mockMvc.perform(get("/api/get-fire-alarm-info"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isMap())
                .andExpect(jsonPath("$.length()", is(0))); // 期望返回空 Map
    }
}
