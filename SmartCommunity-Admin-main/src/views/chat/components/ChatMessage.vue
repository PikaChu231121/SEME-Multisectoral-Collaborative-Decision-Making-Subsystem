<template>
  <!-- 外层容器，使用 Flexbox 布局 -->
  <div class="message-container">
    <div :class="[message.sender, 'message']">
      <!-- 使用 v-html 渲染富文本 -->
      <span v-html="parsedMarkdown" />
      <div v-if="message.pic">
        <img :src="message.pic" width="100px" height="100px" alt="awaiting" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { marked } from 'marked';
  export default defineComponent({
    props: {
      message: {
        type: Object,
        required: true,
      },
    },
    computed: {
      // 将 Markdown 文本解析为 HTML
      parsedMarkdown() {
        return marked(this.message.text || '');
      },
    },
  });
</script>

<style scoped>
  /* 外层容器，使用 Flexbox 布局 */
  .message-container {
    display: flex;
    flex-direction: column;
  }

  /* 消息通用样式 */
  .message {
    max-width: 70%;
    margin: 5px 0;
    padding: 10px;
    border-radius: 10px;
    word-wrap: break-word;
  }

  /* 用户消息靠右对齐 */
  .user {
    align-self: flex-end;
    background-color: #d1e7dd;
  }

  /* 机器人消息靠左对齐 */
  .bot {
    align-self: flex-start;
    background-color: #d8d7f8;
  }
</style>
