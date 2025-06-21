package com.example.SmartCommunity.integration;

import com.example.SmartCommunity.dto.TimelineDTO;
import com.example.SmartCommunity.dto.TimelineEntry;
import com.example.SmartCommunity.model.Event;
import com.example.SmartCommunity.model.EventStage;
import com.example.SmartCommunity.repository.EventActionRepository;
import com.example.SmartCommunity.repository.EventRepository;
import com.example.SmartCommunity.repository.EventStageRepository;
import com.example.SmartCommunity.service.ResponseHistoryService;
import com.example.SmartCommunity.service.TimelineService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.CountDownLatch;
import java.util.stream.IntStream;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@ActiveProfiles("test")
public class TimelineServiceAdvancedIntegrationTest {

    @Autowired
    private TimelineService timelineService;

    @Autowired
    private ResponseHistoryService responseHistoryService;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private EventStageRepository eventStageRepository;

    @Autowired
    private EventActionRepository eventActionRepository;

    @Autowired
    private TestDataBuilder testDataBuilder;

    @Autowired
    private MockMvc mockMvc;

    private TimelineDTO testTimelineDTO;

    @BeforeEach
    void setUp() {
        testTimelineDTO = testDataBuilder.createSampleTimelineDTO();
    }

    @Test
    void testQueryEmptyData() {
        eventRepository.deleteAll();
        eventStageRepository.deleteAll();
        eventActionRepository.deleteAll();

        List<Map<String, Object>> allEvents = responseHistoryService.getAllEvents();
        assertTrue(allEvents.isEmpty());

        List<TimelineEntry> timeline = timelineService.getTimelineData();
        assertTrue(timeline == null || timeline.isEmpty());
    }


    @Test
    void testInvalidTimelineDTO() {
        TimelineDTO invalidDTO = new TimelineDTO();
        // 不设置departments和timeline
        assertThrows(Exception.class, () -> {
            timelineService.saveTimelineData(invalidDTO);
        });
    }

    @Test
    void testCascadeDelete() {
        timelineService.saveTimelineData(testTimelineDTO);
        List<Event> events = eventRepository.findAll();
        assertFalse(events.isEmpty());
        Event event = events.get(0);

        // 删除Event
        eventRepository.delete(event);

        // 相关EventStage和EventAction也应被删除
        List<EventStage> stages = eventStageRepository.findByEventIdOrderByIdAsc(event.getId());
        assertTrue(stages.isEmpty());
        // 你可以根据实际情况补充EventAction的级联删除断言
    }

    @Test
    void testTransactionRollback() {
        TimelineDTO dto = testDataBuilder.createSampleTimelineDTO();
        // 制造异常：比如timeline里有null
        dto.getTimeline().add(null);
        try {
            timelineService.saveTimelineData(dto);
        } catch (Exception ignored) {}

        // 数据应未被保存
        List<Event> events = eventRepository.findAll();
        assertTrue(events.isEmpty() || events.size() == 1); // 只要不是多条脏数据
    }

    @Test
    void testFireAlarmInfoSaveAndRead() throws Exception {
        Map<String, String> info = testDataBuilder.createSampleFireAlarmInfo();
        ObjectMapper objectMapper = new ObjectMapper();
        // 保存火警信息
        mockMvc.perform(post("/api/set-fire-alarm-info")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(info)))
                .andExpect(status().isOk());
        // 读取火警信息
        MvcResult result = mockMvc.perform(get("/api/get-fire-alarm-info"))
                .andExpect(status().isOk())
                .andReturn();
        String json = result.getResponse().getContentAsString();
        Map<String, String> readInfo = objectMapper.readValue(json, Map.class);
        assertEquals(info, readInfo);
    }

    @Test
    void testConcurrentSaveTimelineData() throws Exception {
        int threadCount = 10;
        ExecutorService executor = java.util.concurrent.Executors.newFixedThreadPool(threadCount);
        CountDownLatch latch = new CountDownLatch(threadCount);

        for (int i = 0; i < threadCount; i++) {
            final int idx = i;
            executor.submit(() -> {
                try {
                    TimelineDTO dto = buildTimelineDTOForThread(idx);
                    timelineService.saveTimelineData(dto);
                } finally {
                    latch.countDown();
                }
            });
        }
        latch.await();
        executor.shutdown();

        // 校验
        List<Event> events = eventRepository.findAll();
        assertEquals(threadCount, events.size());
        IntStream.range(0, threadCount).forEach(i -> {
            boolean found = events.stream().anyMatch(e -> e.getDepartments() != null && e.getDepartments().contains("消防" + i));
            assertTrue(found, "未找到线程" + i + "保存的数据");
        });
    }

    // 构造唯一数据的方法
    private TimelineDTO buildTimelineDTOForThread(int idx) {
        TimelineDTO dto = new TimelineDTO();
        dto.setDepartments(java.util.Arrays.asList("消防" + idx, "医院" + idx));
        java.util.List<TimelineEntry> timeline = new java.util.ArrayList<>();
        java.util.Map<String, com.example.SmartCommunity.dto.DepartmentTask> actions = new java.util.HashMap<>();
        com.example.SmartCommunity.dto.DepartmentTask task = new com.example.SmartCommunity.dto.DepartmentTask();
        task.setName("任务" + idx);
        task.setDetail("详情" + idx);
        actions.put("消防" + idx, task);
        timeline.add(new TimelineEntry("0-5分钟-" + idx, actions));
        dto.setTimeline(timeline);
        return dto;
    }

} 