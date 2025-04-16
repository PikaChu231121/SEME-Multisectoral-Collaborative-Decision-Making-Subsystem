package com.example.SmartCommunity.controller;

// 文件位置: com.example.SmartCommunity.dto.FireResponseDTO.java


import java.util.Map;

public class FireResponseDTO {
    private Map<String, Map<String, String[]>> stages;

    public Map<String, Map<String, String[]>> getStages() {
        return stages;
    }

    public void setStages(Map<String, Map<String, String[]>> stages) {
        this.stages = stages;
    }
}
