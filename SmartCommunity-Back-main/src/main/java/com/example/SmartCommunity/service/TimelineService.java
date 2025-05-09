package com.example.SmartCommunity.service;

import com.example.SmartCommunity.dto.DepartmentTask;
import com.example.SmartCommunity.dto.TimelineDTO;
import com.example.SmartCommunity.dto.TimelineEntry;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class TimelineService {

    private List<String> departments = new ArrayList<>();
    private List<TimelineEntry> timelineData = new ArrayList<>();

    // 存储从前端 POST 过来的数据
    public void saveTimelineData(TimelineDTO timelineDTO) {
        this.timelineData = timelineDTO.getTimeline();
        this.departments = timelineDTO.getDepartments();
    }

//    // 发送固定的格式数据
//    public List<TimelineEntry> getTimelineData() {
//        List<TimelineEntry> timeline = new ArrayList<>();
//
//        // 示例：08:50-09:00 时间段任务
//        Map<String, DepartmentTask> actions1 = new HashMap<>();
//        actions1.put("消防", new DepartmentTask("名字(后端成功)", "详细(后端成功)"));
//        actions1.put("医院", null);
//        actions1.put("安保", new DepartmentTask("名字(后端成功)", "详细(后端成功)"));
//        actions1.put("物业", new DepartmentTask("名字(后端成功)", "详细(后端成功)"));
//
//        timeline.add(new TimelineEntry("08:50-09:00", actions1));
//
//        // 示例：09:00-09:10 时间段任务
//        Map<String, DepartmentTask> actions2 = new HashMap<>();
//        actions2.put("消防", new DepartmentTask("名字(后端成功)", "详细(后端成功)"));
//        actions2.put("医院", new DepartmentTask("名字(后端成功)", "详细(后端成功)"));
//        actions2.put("安保", new DepartmentTask("名字(后端成功)", "详细(后端成功)"));
//        actions2.put("物业", new DepartmentTask("名字(后端成功)", "详细(后端成功)"));
//
//        timeline.add(new TimelineEntry("09:00-09:10", actions2));
//
//        return timeline;
//    }

    // 发送真实的数据
    public List<TimelineEntry> getTimelineData() {
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
