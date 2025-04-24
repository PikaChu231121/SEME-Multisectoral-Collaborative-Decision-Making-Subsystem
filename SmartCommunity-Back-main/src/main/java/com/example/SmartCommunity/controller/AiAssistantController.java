package com.example.SmartCommunity.controller;

import com.example.SmartCommunity.dto.FireResponseDTO;
import com.example.SmartCommunity.dto.UserMessageDTO;
import com.example.SmartCommunity.dto.UserMessageRequestDTO;
import com.example.SmartCommunity.model.ChatTopic;
import com.example.SmartCommunity.service.AiAssistantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name="AI助手接口",description = """
        ChatTopic 指的是对话的主题，对应的是 ChatGPT 左侧的那一列(点击之后可以切换到不同对话的那个)
        一个 User 对应多个 ChatTopic，目前一对一即可
        一个 ChatTopic 对应多个 UserMessage，一个 UserMessage 对应多个 AiMessage""")
@RestController
@RequestMapping("/api/ai-assistant")
public class AiAssistantController {

    private final AiAssistantService aiAssistantService;

    @Autowired
    public AiAssistantController(AiAssistantService aiAssistantService) {
        this.aiAssistantService = aiAssistantService;
    }

    @Operation(summary="用户发送信息给AI",description = "传入topicId，文本内容，图片url，返回AI的回复")
    @PostMapping("/process-message")
    public ResponseEntity<String> processMessage(
            @RequestParam Long topicId,
            @RequestBody UserMessageRequestDTO userMessageRequestDTO) {
        try {
            String userMessageContent = userMessageRequestDTO.getUserMessageContent();
            String userImageContent = userMessageRequestDTO.getUserImageContent();
            if (userMessageContent == null) {
                return ResponseEntity.badRequest().body("User content is required.");
            }
            String response = aiAssistantService.getAiResponse(topicId, userMessageContent, userImageContent);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing message: "
                                                                                + e.getMessage());
        }
    }

    @Operation(summary = "获取ChatTopic对应的UserMessage",description = """
            **传入三个参数**: topicId, offset, limit\
            topicId 不用多说
            offset 和 limit 是偏移量
            例如，我要获取最新的 10 条消息，offset = 0, limit = 10
            我要获取之后的 10 条消息，offset = 10, limit = 10
            要求 offset 是 limit 的倍数
            **返回值是分页的内容**:有三个，_embedded, "_links", "page"
            "_embedded" 里面有一个 "userMessageDTOList"，是真正的信息，注意是倒序排列的
            "_links"里面是分页的几个地址，去了之后可以获取对应分页的内容，first是第一页，self是自己这一页，next是下一页，last是最后一页
            "page" 是分页的信息，具体包括一页的大小、元素个数、总页数等等
            这部分应该只需要使用 _embedded 部分，可以使用 topicId = 3 去测试""")
    @GetMapping("/messages/{topicId}")
    public ResponseEntity<PagedModel<EntityModel<UserMessageDTO>>> getMessagesByTopicId(
            @PathVariable Long topicId,
            @RequestParam @NotNull Integer offset,
            @RequestParam @NotNull Integer limit) {
        try {
            // 调用 Service 获取封装好的 PagedModel
            PagedModel<EntityModel<UserMessageDTO>> pagedModel =
                    aiAssistantService.getMessagesByTopicIdPaged(topicId, offset, limit);
            return ResponseEntity.ok(pagedModel);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @Operation(summary = "获取用户对应的ChatTopic")
    @GetMapping("/topics/{userId}")
    public ResponseEntity<List<ChatTopic>> getTopicsByUserId(@PathVariable Long userId) {
        try {
            List<ChatTopic> topics = aiAssistantService.getTopicsByUserId(userId);
            return ResponseEntity.ok(topics);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @Operation(summary = "删除ChatTopic")
    @DeleteMapping("/deleteTopic/{topicId}")
    public ResponseEntity<String> deleteTopicById(@PathVariable Long topicId) {
        try {
            aiAssistantService.deleteTopicById(topicId);
            return ResponseEntity.ok("Topic deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting topic: " + e.getMessage());
        }
    }

    @Operation(summary = "新增ChatTopic")
    @PostMapping("/newTopic")
    public ResponseEntity<String> createTopic(
            @RequestParam @NotNull Long userId,
            @RequestParam @NotNull String topicName) {
        try {
            aiAssistantService.createTopic(userId, topicName);
            return ResponseEntity.ok("Topic created successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating topic: " + e.getMessage());
        }
    }

    @Operation(summary = "更新ChatTopic的名字",description = "传入TopicId和的新名字")
    @PutMapping("/updateTopic/{topicId}")
    public ResponseEntity<String> updateTopicName(
            @PathVariable Long topicId,
            @RequestParam @NotNull String newTopicName) {
        try {
            aiAssistantService.updateTopicName(topicId, newTopicName);
            return ResponseEntity.ok("Topic updated successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating topic: " + e.getMessage());
        }
    }
    @Operation(summary = "接收 CAMEL 智能体系统的火灾响应数据")
    @PostMapping("/receive-fire-response")
    public ResponseEntity<String> receiveFireResponse(@RequestBody FireResponseDTO fireResponseDTO) {
        try {
            System.out.println("🔥 收到火灾响应数据：");

            // 更清晰地打印出每个阶段和角色的任务
            fireResponseDTO.getStages().forEach((stage, roles) -> {
                System.out.println("📌 " + stage + ":");
                roles.forEach((role, tasks) -> {
                    System.out.println("  👤 " + role + ":");
                    for (String task : tasks) {
                        System.out.println("    - " + task);
                    }
                });
            });

            return ResponseEntity.ok("✅ 火灾响应数据已成功接收！");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("❌ 数据接收失败：" + e.getMessage());
        }
    }
}