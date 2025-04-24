package com.example.SmartCommunity.dto;

// 文件位置: com.example.SmartCommunity.dto.FireResponseDTO.java


import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Setter
@Getter
public class FireResponseDTO {
    private Map<String, Map<String, String[]>> stages;

}
