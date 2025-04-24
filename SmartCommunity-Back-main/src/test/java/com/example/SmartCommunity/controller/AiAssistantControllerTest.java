package com.example.SmartCommunity.controller;

import com.example.SmartCommunity.dto.FireResponseDTO;
import com.example.SmartCommunity.service.AiAssistantService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AiAssistantController.class)
public class AiAssistantControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AiAssistantService aiAssistantService;

    @Test
    public void testReceiveFireResponse() throws Exception {
        // 准备测试数据
        FireResponseDTO fireResponseDTO = new FireResponseDTO();
        Map<String, Map<String, String[]>> stages = new HashMap<>();

        // 紧急响应阶段
        Map<String, String[]> emergencyRoles = new HashMap<>();
        emergencyRoles.put("消防队长", new String[]{"组织人员撤离", "调度消防车辆"});
        emergencyRoles.put("安全主管", new String[]{"确保疏散通道畅通", "联系医疗救援"});
        stages.put("紧急响应阶段", emergencyRoles);

        // 扑救阶段
        Map<String, String[]> firefightingRoles = new HashMap<>();
        firefightingRoles.put("消防员", new String[]{"确定火源位置", "使用灭火器材进行扑救"});
        firefightingRoles.put("后勤人员", new String[]{"提供水源支持", "准备氧气瓶"});
        stages.put("扑救阶段", firefightingRoles);

        // 恢复阶段
        Map<String, String[]> recoveryRoles = new HashMap<>();
        recoveryRoles.put("安全评估员", new String[]{"检查建筑结构安全", "评估损失情况"});
        recoveryRoles.put("社区协调员", new String[]{"安排临时住所", "提供心理疏导"});
        stages.put("恢复阶段", recoveryRoles);

        fireResponseDTO.setStages(stages);

        // 执行测试并验证结果
        mockMvc.perform(post("/api/ai-assistant/receive-fire-response")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(fireResponseDTO)))
                .andExpect(status().isOk())
                .andExpect(content().string("✅ 火灾响应数据已成功接收！"));
    }
}