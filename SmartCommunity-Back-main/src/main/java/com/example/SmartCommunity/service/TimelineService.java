package com.example.SmartCommunity.service;

import com.example.SmartCommunity.dto.DepartmentTask;
import com.example.SmartCommunity.dto.TimelineDTO;
import com.example.SmartCommunity.dto.TimelineEntry;

import com.example.SmartCommunity.repository.EventActionRepository;
import com.example.SmartCommunity.repository.EventRepository;
import com.example.SmartCommunity.repository.EventStageRepository;

import com.example.SmartCommunity.model.Event;
import com.example.SmartCommunity.model.EventStage;
import com.example.SmartCommunity.model.EventAction;

import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class TimelineService {

    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private EventStageRepository eventStageRepository;
    @Autowired
    private EventActionRepository eventActionRepository;

    private List<String> departments = new ArrayList<>();
    private List<TimelineEntry> timelineData = new ArrayList<>();

    // 存储从前端 POST 过来的数据
    public void saveTimelineData(TimelineDTO timelineDTO) {
        this.timelineData = timelineDTO.getTimeline();
        this.departments = timelineDTO.getDepartments();
        // 1. 存储 event
        Event event = new Event();
        event.setDepartments(new Gson().toJson(timelineDTO.getDepartments())); // 将 List<String> 转为 JSON 字符串
        event = eventRepository.save(event);

        // 2. 遍历 timeline
        for (TimelineEntry entry : timelineDTO.getTimeline()) {
            // 2.1 创建并保存 event_stage
            EventStage stage = new EventStage();
            stage.setTimeRange(entry.getTime());
            stage.setEvent(event);
            stage = eventStageRepository.save(stage);

            // 2.2 遍历每个部门的 actions
            for (Map.Entry<String, DepartmentTask> departmentEntry : entry.getActions().entrySet()) {
                String departmentName = departmentEntry.getKey();
                DepartmentTask task = departmentEntry.getValue();

                EventAction action = new EventAction();
                action.setDepartmentName(departmentName);
                action.setActionName(task.getName());
                action.setActionDetail(task.getDetail());
                action.setStage(stage);

                eventActionRepository.save(action);
            }
        }
    }

    // 发送数据
    public List<TimelineEntry> getTimelineData() {
        if (timelineData == null) {
            return new ArrayList<>();
        }
        List<TimelineEntry> timeline = new ArrayList<>();


        System.out.println("\n刷新按钮后的时间轴内容:");
        for (TimelineEntry entry : timelineData) {
            System.out.println("  时间段: " + entry.getTime());

            Map<String, DepartmentTask> departmentTasks = entry.getActions();
            if (departmentTasks != null) {
                departmentTasks.forEach((department, task) -> {
                    System.out.println("    👤 " + department + ": " + task.getName() + " (详情: " + task.getDetail() + ")");
                });
            } else {
                System.out.println("null");
            }
        }


        // 遍历传入的时间轴条目并构建实际时间轴
        for (TimelineEntry entry : timelineData) {
            Map<String, DepartmentTask> actions = new HashMap<>();
            // 遍历每个部门及其任务
            for (String department : departments) {
                if (entry.getActions() != null && entry.getActions().containsKey(department)) {
                    actions.put(department, entry.getActions().get(department));
                } else {
                    // 如果任务不存在，可以设置为 null 或者创建一个默认任务
                    actions.put(department, null);
                }
            }
            // 将处理后的时间段和任务加入到时间轴列表
            timeline.add(new TimelineEntry(entry.getTime(), actions));
        }

        return timeline;
    }

    public List<String> getDepartments() {
        return Arrays.asList("消防", "医院", "安保", "物业");
    }

}
