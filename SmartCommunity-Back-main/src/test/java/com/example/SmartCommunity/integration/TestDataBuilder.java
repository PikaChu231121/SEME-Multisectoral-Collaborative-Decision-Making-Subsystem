package com.example.SmartCommunity.integration;

import com.example.SmartCommunity.dto.DepartmentTask;
import com.example.SmartCommunity.dto.TimelineDTO;
import com.example.SmartCommunity.dto.TimelineEntry;
import com.example.SmartCommunity.model.Event;
import com.example.SmartCommunity.model.EventAction;
import com.example.SmartCommunity.model.EventStage;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class TestDataBuilder {

    public static TimelineDTO createSampleTimelineDTO() {
        TimelineDTO dto = new TimelineDTO();
        dto.setDepartments(Arrays.asList("消防", "医院", "安保", "物业"));

        List<TimelineEntry> timeline = new ArrayList<>();
        
        // 第一阶段
        Map<String, DepartmentTask> actions1 = new HashMap<>();
        actions1.put("消防", createTask("紧急疏散", "立即疏散大楼内所有人员"));
        actions1.put("医院", createTask("准备救援", "准备医疗设备和人员"));
        timeline.add(new TimelineEntry("0-5分钟", actions1));

        // 第二阶段
        Map<String, DepartmentTask> actions2 = new HashMap<>();
        actions2.put("消防", createTask("控制火势", "使用消防设备控制火势蔓延"));
        actions2.put("医院", createTask("救治伤员", "对受伤人员进行紧急救治"));
        timeline.add(new TimelineEntry("5-10分钟", actions2));

        dto.setTimeline(timeline);
        return dto;
    }

    public static DepartmentTask createTask(String name, String detail) {
        DepartmentTask task = new DepartmentTask();
        task.setName(name);
        task.setDetail(detail);
        return task;
    }

    public static Event createSampleEvent() {
        Event event = new Event();
        event.setDepartments("[\"消防\",\"医院\",\"安保\",\"物业\"]");
        return event;
    }

    public static EventStage createSampleEventStage(Event event) {
        EventStage stage = new EventStage();
        stage.setTimeRange("0-5分钟");
        stage.setEvent(event);
        return stage;
    }

    public static EventAction createSampleEventAction(EventStage stage) {
        EventAction action = new EventAction();
        action.setDepartmentName("消防");
        action.setActionName("紧急疏散");
        action.setActionDetail("立即疏散大楼内所有人员");
        action.setStage(stage);
        return action;
    }

    public static Map<String, String> createSampleFireAlarmInfo() {
        Map<String, String> info = new HashMap<>();
        info.put("location", "A栋1楼");
        info.put("level", "严重");
        info.put("source", "烟雾报警器");
        info.put("time", "2024-03-20 10:00:00");
        info.put("weather", "晴朗");
        info.put("people", "约50人");
        return info;
    }
}