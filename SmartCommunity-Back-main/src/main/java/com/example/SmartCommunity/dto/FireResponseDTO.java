package com.example.SmartCommunity.dto;

// 文件位置: com.example.SmartCommunity.dto.FireResponseDTO.java


import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Setter
@Getter
public class FireResponseDTO {
    // Getters and Setters
    private List<String> departments;
    private List<Map<String, Object>> timeline;

}