package com.example.SmartCommunity.dto;


import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
public class TimelineEntry {
    private String time;
    private Map<String, DepartmentTask> actions = new HashMap<>();

    public TimelineEntry(String s, Map<String, DepartmentTask> action) {
        this.time = s;
        this.actions = action;
    }

}
