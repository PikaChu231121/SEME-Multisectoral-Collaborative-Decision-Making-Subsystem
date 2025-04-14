<template>
  <div class="chat-app">
    <div class="sidebar-toggle">
      <button class="toggle-sidebar-btn" @click="toggleSidebar">历史记录</button>
      <h1 class="topic-title">当前话题名称:{{ curTopicName }}</h1>
    </div>
    <div class="chat-container">
      <ChatSidebar v-if="showSidebar" @topicSelected="handleTopicSelected" />
      <div class="chat-content">
        <div class="messages">
          <ChatMessage v-for="msg in messages" :key="msg.fakeId" :message="msg" />
          <div v-if="loading" class="loading">
            加载中...
            <div class="spinner" />
          </div>
        </div>
        <div v-if="imageUrl" class="image-preview">
          <img :src="imageUrl" alt="Uploaded Image" />
        </div>
        <div class="input-container">
          <ChatInput @sendMessage="sendMessage" @sendImage="handleImage" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import ChatMessage from './components/ChatMessage.vue';
  import ChatInput from './components/ChatInput.vue';
  import ChatSidebar from './components/ChatSidebar.vue';

  export default defineComponent({
    components: { ChatMessage, ChatInput, ChatSidebar },
    setup() {
      //console.log(import.meta.env.VITE_BASE_API_URL)
      const baseUrl = ref(import.meta.env.VITE_BASE_API_URL);
      if (baseUrl.value.endsWith(':8080')) {
        baseUrl.value = baseUrl.value.slice(0, -5); // 删除最后 5 个字符（":8080" 的长度）
      }
      //console.log(baseUrl.value)
      onMounted(() => {
        //console.log(baseUrl.value);
        topicInit();
      });
      const curTopicName = ref('');
      const messages = ref([
        { fakeId: 0, id: 1, text: 'Hello!', sender: 'user', pic: '' },
        { fakeId: 1, id: 2, text: 'Hi there!', sender: 'bot', pic: '' },
      ]);
      const curId = ref(0);
      const loading = ref(false);
      const imageUrl = ref<string | null>(null);
      const showSidebar = ref(false);
      const curtopicId = ref(0);

      const sendMessage = async (message: string, picurl: string) => {
        messages.value.push({
          fakeId: curId.value++,
          id: Date.now(),
          text: message,
          sender: 'user',
          pic: picurl,
        });
        loading.value = true;
        await new Promise((resolve) => setTimeout(resolve, 2000));

        try {
          const params = {
            userMessageContent: message,
            userImageContent: picurl,
          };
          const response = await fetch(
            baseUrl.value + `:8080/api/ai-assistant/process-message?topicId=` + curtopicId.value,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(params),
            },
          );
          if (response.ok) {
            const data_ = await response.text();
            messages.value.push({
              fakeId: curId.value++,
              id: Date.now() + 1,
              text: data_,
              sender: 'bot',
              pic: '',
            });
          } else {
            console.error('Error:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching assistant response:', error);
        } finally {
          loading.value = false;
        }
      };

      const handleImage = (url: string) => {
        if (imageUrl.value) {
          alert('只允许上传一张图片');
          return;
        }
        imageUrl.value = url;
      };

      const handleTopicSelected = (topic: { id: number; name: string }) => {
        curtopicId.value = topic.id;
        curTopicName.value = topic.name;
        const params = new URLSearchParams({
          offset: '0',
          limit: '50',
        });
        fetch(baseUrl.value + ':8080/api/ai-assistant/messages/' + topic.id + `?${params}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.page.totalElements === 0) {
              messages.value = [
                { fakeId: 0, id: 1, text: 'Hello!', sender: 'user', pic: '' },
                { fakeId: 1, id: 2, text: 'Hi there!', sender: 'bot', pic: '' },
              ];
              curId.value = 2;
              return;
            }
            const messageList = data._embedded.userMessageDTOList;
            messages.value = [];
            curId.value = 0;
            messageList.reverse().forEach((element) => {
              const midq = {
                fakeId: curId.value++,
                id: element.id,
                text: element.contentText,
                sender: 'user',
                pic: element.contentImage,
              };
              const midAnswer = {
                fakeId: curId.value++,
                id: element.id,
                text: element.aiResponses[0],
                sender: 'bot',
                pic: '',
              };
              messages.value.push(midq);
              messages.value.push(midAnswer);
            });
          });
        toggleSidebar();
      };

      const toggleSidebar = () => {
        showSidebar.value = !showSidebar.value;
      };
      const topicInit = () => {
        fetch(baseUrl.value + `:8080/api/ai-assistant/topics/${1}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((response) => response.json())
          .then((data) => {
            const mid = {
              id: data[0].id,
              name: data[0].topicName,
            };
            handleTopicSelected(mid);
          });
      };

      return {
        messages,
        sendMessage,
        loading,
        imageUrl,
        handleImage,
        handleTopicSelected,
        showSidebar,
        toggleSidebar,
        curTopicName,
      };
    },
  });
</script>

<style scoped>
  .chat-app {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #f5f5f5;
  }

  .sidebar-toggle {
    padding: 10px;
    background-color: #fff;
    box-shadow: 0 2px 10px rgb(0 0 0 / 10%);
  }

  .toggle-sidebar-btn {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: #fff;
    font-size: 16px;
    cursor: pointer;
  }

  .chat-container {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  .chat-content {
    display: flex;
    flex: 1;
    flex-direction: column;
    margin: 10px;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0 2px 10px rgb(0 0 0 / 10%);
  }

  .messages {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    background-color: #f9f9f9;
  }

  .image-preview {
    display: flex;
    justify-content: center;
    padding: 10px;
    background-color: #f0f0f0;
  }

  .image-preview img {
    max-width: 200px;
    max-height: 200px;
    object-fit: cover;
  }

  .input-container {
    padding: 20px;
    border-top: 1px solid #e0e0e0;
    background-color: #fff;
  }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    color: #666;
    font-size: 16px;
  }

  .spinner {
    width: 24px;
    height: 24px;
    margin-left: 8px;
    animation: spin 1s linear infinite;
    border: 4px solid rgb(0 0 0 / 10%);
    border-radius: 50%;
    border-left-color: #007bff;
  }

  .topic-title {
    margin: 0;
    padding-left: 8px;
    border-left: 4px solid #007bff;
    color: #2c3e50;
    font-size: 24px;
    font-weight: 600;
    line-height: 1.3;
    text-shadow: 1px 1px 2px rgb(0 0 0 / 10%);
  }

  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }
</style>
