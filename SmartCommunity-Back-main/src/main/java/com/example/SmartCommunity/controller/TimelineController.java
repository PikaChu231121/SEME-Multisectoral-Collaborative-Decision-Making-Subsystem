package com.example.SmartCommunity.controller;

import com.example.SmartCommunity.dto.DepartmentTask;
import com.example.SmartCommunity.dto.TimelineDTO;
import com.example.SmartCommunity.dto.TimelineEntry;
import com.example.SmartCommunity.service.TimelineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@RestController
@RequestMapping("/api")
public class TimelineController {

    private final ExecutorService executorService = Executors.newSingleThreadExecutor();

    @Autowired
    private TimelineService timelineService;

    // 获取脚本的处理相应
    @PostMapping("/get-timeline-response")
    public ResponseEntity<String> getTimelineResponse(@RequestBody TimelineDTO timelineDTO) {
        try {
            System.out.println("TimelineController收到火灾响应数据：");

            // 打印部门列表
            System.out.println("部门列表: " + timelineDTO.getDepartments());

            // 打印时间轴内容
            System.out.println("时间轴内容:");
            for (TimelineEntry entry : timelineDTO.getTimeline()) {
                System.out.println("  时间段: " + entry.getTime());

                Map<String, DepartmentTask> departmentTasks = entry.getActions();
                if (departmentTasks != null) {
                    departmentTasks.forEach((department, task) -> System.out.println("    👤 " + department + ": " + task.getName() + " (详情: " + task.getDetail() + ")"));
                } else {
                    System.out.println("null");
                }
            }
            // 将数据储存在service中
            timelineService.saveTimelineData(timelineDTO);

            return ResponseEntity.ok("TimelineController收到火灾响应数据");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("数据接收失败：" + e.getMessage());
        }
    }

    // 请求详细的时间轴内容
    @GetMapping("/get-timeline-detail")
    public Map<String, Object> getTimelineData() {
        List<String> departments = timelineService.getDepartments();

        List<TimelineEntry> rawTimeline = timelineService.getTimelineData();
        

        List<Map<String, Object>> timeline = new ArrayList<>();

        for (TimelineEntry entry : rawTimeline) {
            Map<String, Object> row = new HashMap<>();
            row.put("time", entry.getTime());
            // 展平 departments 键
            row.putAll(entry.getActions());
            timeline.add(row);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("departments", departments);
        result.put("timeline", timeline);
        return result;
    }

    // 刷新AI的处理相应
    @PostMapping("/refresh-response")
    public ResponseEntity<String> runScriptAsync() {
        executorService.submit(() -> {
            try {
                String pythonPath = "D:/ProgramData/Anaconda3/envs/camel/python.exe";
                String scriptPath = new File("scripts/workforce.py").getAbsolutePath();
                ProcessBuilder processBuilder = new ProcessBuilder(pythonPath, scriptPath);
                processBuilder.redirectErrorStream(true);
                processBuilder.environment().put("PYTHONIOENCODING", "utf-8");

                Process process = processBuilder.start();
                BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
                String line;
                while ((line = reader.readLine()) != null) {
                    System.out.println("[PYTHON OUT] " + line);
                }
                int exitCode = process.waitFor();
                System.out.println("Python script exited with code: " + exitCode);
            } catch (Exception e) {
                e.printStackTrace();
            }
        });

        return ResponseEntity.ok("Script started.");
    }

}
