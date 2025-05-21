package com.example.SmartCommunity.service;

import com.example.SmartCommunity.model.Event;
import com.example.SmartCommunity.model.EventStage;
import com.example.SmartCommunity.model.EventAction;
import com.example.SmartCommunity.repository.EventRepository;
import com.example.SmartCommunity.repository.EventStageRepository;
import com.example.SmartCommunity.repository.EventActionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ResponseHistoryService {

    private final EventRepository eventRepository;
    private final EventStageRepository eventStageRepository;
    private final EventActionRepository eventActionRepository;

    // 获取所有事件简略信息（用于列表）
    public List<Map<String, Object>> getAllEvents() {
        List<Event> events = eventRepository.findAllByOrderByCreatedAtDesc();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Event event : events) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", event.getId());
            item.put("departments", event.getDepartments());
            item.put("createdAt", event.getCreatedAt());
            result.add(item);
        }

        return result;
    }

    // 获取单个事件详情
    public List<Map<String, Object>> getEventDetail(Long eventId) {
        List<EventStage> stages = eventStageRepository.findByEventIdOrderByIdAsc(eventId);
        List<Map<String, Object>> result = new ArrayList<>();

        for (EventStage stage : stages) {
            Map<String, Object> stageMap = new HashMap<>();
            stageMap.put("timeRange", stage.getTimeRange());

            List<EventAction> actions = eventActionRepository.findByStageId(stage.getId());
            List<Map<String, String>> actionList = new ArrayList<>();

            for (EventAction action : actions) {
                Map<String, String> actionMap = new HashMap<>();
                actionMap.put("departmentName", action.getDepartmentName());
                actionMap.put("actionName", action.getActionName());
                actionMap.put("actionDetail", action.getActionDetail());
                actionList.add(actionMap);
            }

            stageMap.put("actions", actionList);
            result.add(stageMap);
        }

        return result;
    }
}
