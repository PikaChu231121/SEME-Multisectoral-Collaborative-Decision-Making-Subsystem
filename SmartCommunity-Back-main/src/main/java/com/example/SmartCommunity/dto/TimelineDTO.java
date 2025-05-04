package com.example.SmartCommunity.dto;


import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TimelineDTO {
    private List<String> departments;
    private List<TimelineEntry> timeline;
}
