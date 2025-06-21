package com.example.SmartCommunity.integration;

import com.example.SmartCommunity.dto.DepartmentTask;
import com.example.SmartCommunity.dto.TimelineDTO;
import com.example.SmartCommunity.dto.TimelineEntry;
import com.example.SmartCommunity.model.Event;
import com.example.SmartCommunity.model.EventAction;
import com.example.SmartCommunity.model.EventStage;
import com.example.SmartCommunity.repository.EventActionRepository;
import com.example.SmartCommunity.repository.EventRepository;
import com.example.SmartCommunity.repository.EventStageRepository;
import com.example.SmartCommunity.service.ResponseHistoryService;
import com.example.SmartCommunity.service.TimelineService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class TimelineIntegrationTest {

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

    private TimelineDTO testTimelineDTO;

    @BeforeEach
    void setUp() {
        // 准备测试数据
        testTimelineDTO = new TimelineDTO();
        testTimelineDTO.setDepartments(Arrays.asList("消防", "医院", "安保", "物业"));

        List<TimelineEntry> timeline = new ArrayList<>();
        
        // 创建第一个时间段的测试数据
        Map<String, DepartmentTask> actions1 = new HashMap<>();
        DepartmentTask task1 = new DepartmentTask();
        task1.setName("紧急疏散");
        task1.setDetail("立即疏散大楼内所有人员");
        actions1.put("消防", task1);
        
        DepartmentTask task2 = new DepartmentTask();
        task2.setName("准备救援");
        task2.setDetail("准备医疗设备和人员");
        actions1.put("医院", task2);
        
        timeline.add(new TimelineEntry("0-5分钟", actions1));

        // 创建第二个时间段的测试数据
        Map<String, DepartmentTask> actions2 = new HashMap<>();
        DepartmentTask task3 = new DepartmentTask();
        task3.setName("控制火势");
        task3.setDetail("使用消防设备控制火势蔓延");
        actions2.put("消防", task3);
        
        DepartmentTask task4 = new DepartmentTask();
        task4.setName("救治伤员");
        task4.setDetail("对受伤人员进行紧急救治");
        actions2.put("医院", task4);
        
        timeline.add(new TimelineEntry("5-10分钟", actions2));

        testTimelineDTO.setTimeline(timeline);
    }

    @Test
    void testSaveAndRetrieveTimelineData() {
        // 保存时间轴数据
        timelineService.saveTimelineData(testTimelineDTO);

        // 只查本次插入的Event
        List<Event> events = eventRepository.findAll();
        assertFalse(events.isEmpty());

        // 找到最新插入的Event（假设有createdAt字段，或者用ID最大值）
        Event event = events.stream()
            .max(Comparator.comparing(Event::getId))
            .orElseThrow();

        List<EventStage> stages = eventStageRepository.findByEventIdOrderByIdAsc(event.getId());
        assertEquals(2, stages.size());

        // 验证时间轴数据获取
        List<TimelineEntry> retrievedTimeline = timelineService.getTimelineData();
        assertNotNull(retrievedTimeline);
        assertEquals(2, retrievedTimeline.size());

        // 验证第一个时间段的数据
        TimelineEntry firstEntry = retrievedTimeline.get(0);
        assertEquals("0-5分钟", firstEntry.getTime());
        assertNotNull(firstEntry.getActions().get("消防"));
        assertEquals("紧急疏散", firstEntry.getActions().get("消防").getName());
    }

    @Test
    void testResponseHistoryOperations() {
        // 保存测试数据
        timelineService.saveTimelineData(testTimelineDTO);

        // 获取所有事件
        List<Map<String, Object>> allEvents = responseHistoryService.getAllEvents();
        assertFalse(allEvents.isEmpty());

        // 获取第一个事件的详情
        Long eventId = (Long) allEvents.get(0).get("id");
        List<Map<String, Object>> eventDetail = responseHistoryService.getEventDetail(eventId);
        assertFalse(eventDetail.isEmpty());

        // 验证事件详情的内容
        Map<String, Object> firstStage = eventDetail.get(0);
        assertEquals("0-5分钟", firstStage.get("timeRange"));
        assertNotNull(firstStage.get("actions"));
    }

    @Test
    void testFireAlarmInfoIntegration() {
        // 准备火灾报警信息
        Map<String, String> fireAlarmInfo = new HashMap<>();
        fireAlarmInfo.put("location", "A栋1楼");
        fireAlarmInfo.put("level", "严重");
        fireAlarmInfo.put("source", "烟雾报警器");
        fireAlarmInfo.put("time", "2024-03-20 10:00:00");
        fireAlarmInfo.put("weather", "晴朗");
        fireAlarmInfo.put("people", "约50人");

        // 保存时间轴数据
        timelineService.saveTimelineData(testTimelineDTO);

        // 验证事件是否包含正确的火灾信息
        List<Event> events = eventRepository.findAll();
        assertFalse(events.isEmpty());
        
        // 验证响应历史记录
        List<Map<String, Object>> allEvents = responseHistoryService.getAllEvents();
        assertFalse(allEvents.isEmpty());
        
        // 验证事件详情
        Long eventId = (Long) allEvents.get(0).get("id");
        List<Map<String, Object>> eventDetail = responseHistoryService.getEventDetail(eventId);
        assertFalse(eventDetail.isEmpty());
    }
}