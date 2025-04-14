<template>
  <div class="expandable-container">
    <!-- 展开按钮 -->
    <el-button v-if="!isExpanded" class="expand-btn" circle @click="toggleExpand" />

    <!-- 展开后的区域 -->
    <div v-if="isExpanded" class="expand-container">
      <!-- 消息列表，保持可滚动 -->
      <div ref="messageList" class="message-list">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          class="message-bubble"
          :class="{ sent: msg.sent, received: !msg.sent }"
        >
          {{ msg.content }}
        </div>
      </div>

      <!-- 输入框和发送按钮并排 -->
      <div class="input-container">
        <!-- 输入框 -->
        <el-input
          v-model="message"
          placeholder="输入消息"
          class="message-input"
          :disabled="isSending"
          @focus="isFocused = true"
          @blur="isFocused = false"
        />

        <!-- 发送按钮 -->
        <el-button type="primary" :disabled="isSending || !message.trim()" @click="sendMessage"
          >发送</el-button
        >
      </div>

      <!-- 收起按钮 -->
      <el-button class="collapse-btn" circle @click="toggleExpand" />
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { ElButton, ElInput } from 'element-plus';

  export default defineComponent({
    name: 'ExpandableInput',
    components: {
      ElButton,
      ElInput,
    },
    setup() {
      const isExpanded = ref(false); // 控制展开/收起状态
      const message = ref(''); // 输入框内容
      const isFocused = ref(false); // 判断输入框是否被聚焦
      const isSending = ref(false); // 控制是否正在发送消息
      const messages = ref<Array<{ content: string; sent: boolean }>>([]); // 消息列表

      // 切换展开和收起状态
      const toggleExpand = () => {
        isExpanded.value = !isExpanded.value;
      };

      // 发送消息处理函数
      const sendMessage = () => {
        if (message.value.trim()) {
          isSending.value = true;
          messages.value.push({ content: message.value, sent: true });
          message.value = ''; // 清空输入框

          // 模拟接收消息
          setTimeout(() => {
            messages.value.push({ content: '好的', sent: false });
            isSending.value = false;

            // 自动滚动到底部
            const messageList = document.querySelector('.message-list') as HTMLElement;
            messageList.scrollTop = messageList.scrollHeight;
          }, 1000);
        }
      };

      return {
        isExpanded,
        message,
        isFocused,
        isSending,
        messages,
        toggleExpand,
        sendMessage,
      };
    },
  });
</script>

<style scoped>
  /* 父容器，确保展开组件的位置相对 container 元素 */
  .expandable-container {
    display: flex;
    position: absolute; /* 绝对定位 */
    bottom: 30px; /* 可以调整与容器底部的距离 */
    flex-direction: column; /* 纵向排列 */
    align-items: flex-start; /* 使展开按钮和对话框左侧对齐 */
    width: 250px; /* 固定宽度 */
  }

  /* 展开按钮样式 */
  .expand-btn {
    display: flex;
    z-index: 10;
    align-items: center;
    justify-content: center;
    width: 35px;
    height: 35px;
    margin-bottom: 10px; /* 设置间距 */
    transition: all 0.3s ease;
    border: none;
    background-color: #409eff;
    color: white;
  }

  /* 展开后的输入框区域 */
  .expand-container {
    display: flex;
    flex-direction: column; /* 纵向排列 */
    align-items: flex-start; /* 保证输入框、发送按钮等都左对齐 */
    width: 100%;
    max-width: 250px; /* 防止对话框超出容器宽度 */
    padding: 10px;
    transition: all 0.3s ease;
    border-radius: 10px;
    background-color: rgb(244 244 244 / 80%);
    box-shadow: 0 4px 8px rgb(0 0 0 / 20%);
  }

  /* 消息列表样式 */
  .message-list {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-height: 200px; /* 控制消息列表的最大高度 */
    margin-bottom: 10px;
    padding: 5px;
    overflow-y: auto; /* 超出部分可滚动 */
    gap: 5px;
  }

  /* 消息气泡样式 */
  .message-bubble {
    max-width: 70%;
    padding: 10px;
    border-radius: 20px;
    word-wrap: break-word;
  }

  .sent {
    align-self: flex-start;
    margin-right: 10px;
    border-radius: 15px 15px 15px 0;
    background-color: #f0f0f0;
    color: #333;
  }

  .received {
    align-self: flex-end;
    margin-left: 10px;
    border-radius: 15px 15px 0;
    background-color: #409eff;
    color: white;
  }

  /* 输入框和发送按钮的容器 */
  .input-container {
    display: flex;
    align-items: center;
    width: 100%;
  }

  /* 输入框样式 */
  .message-input {
    width: 100%;
    height: 36px;
    margin-right: 10px;
    border-radius: 20px;
  }

  /* 发送按钮样式 */
  .send-btn {
    width: 80px;
    height: 36px;
  }

  /* 收起按钮样式 */
  .collapse-btn {
    position: absolute;
    top: -15px;
    right: -15px;
    border: none;
    background-color: #f56c6c;
    color: white;
  }
</style>
