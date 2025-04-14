<template>
  <div class="sidebar">
    <button class="add-topic-btn" @click="addTopic">新增话题</button>
    <ul>
      <li v-for="topic in topics" :key="topic.id" @click="selectTopic(topic)">
        <span class="topic-name">{{ topic.name }}</span>
        <button class="delete-topic-btn" @click.stop="deleteTopic(topic.id)">删除</button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';

  export default defineComponent({
    name: 'Sidebar',
    emits: ['topicSelected'],
    setup(_, { emit }) {
      const topics = ref<{ id: number; name: string }[]>([]);
      const userid = 1;

      // 页面加载时加载话题
      onMounted(() => {
        //console.log(baseUrl.value);
        updateTopic();
      });
      const baseUrl = ref(import.meta.env.VITE_BASE_API_URL);
      if (baseUrl.value.endsWith(':8080')) {
        baseUrl.value = baseUrl.value.slice(0, -5); // 删除最后 5 个字符（":8080" 的长度）
      }
      // 更新话题列表
      const updateTopic = () => {
        fetch(baseUrl.value + `:8080/api/ai-assistant/topics/${userid}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((response) => response.json())
          .then((data) => {
            topics.value = [];
            data.forEach((element) => {
              const mid = {
                id: element.id,
                name: element.topicName,
              };
              topics.value.push(mid);
            });
          });
      };

      // 选择话题
      const selectTopic = (topic: { id: number; name: string }) => {
        emit('topicSelected', topic);
      };

      // 新增话题
      const addTopic = () => {
        const now = new Date();
        const timeString = now.toLocaleString();
        const params = new URLSearchParams({
          userId: userid.toString(),
          topicName: `话题${timeString}`,
        });

        fetch(baseUrl.value + `:8080/api/ai-assistant/newTopic?${params}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }).then(() => {
          updateTopic();
        });
      };

      // 删除话题
      const deleteTopic = (id: number) => {
        fetch(baseUrl.value + `:8080/api/ai-assistant/deleteTopic/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }).then(() => {
          updateTopic();
        });
      };

      return {
        topics,
        selectTopic,
        addTopic,
        deleteTopic,
      };
    },
  });
</script>

<style scoped>
  .sidebar {
    width: 300px; /* 固定宽度 */
    height: 100vh; /* 高度占满整个视口 */
    padding: 20px;
    overflow-y: auto; /* 允许侧边栏滚动 */
    background-color: #f8f9fa;
    box-shadow: 2px 0 5px rgb(0 0 0 / 10%);
  }

  .add-topic-btn {
    width: 100%;
    margin-bottom: 20px;
    padding: 10px;
    transition: background-color 0.3s;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
  }

  .add-topic-btn:hover {
    background-color: #0056b3;
  }

  ul {
    padding: 0;
    list-style: none;
  }

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    padding: 10px;
    transition: background-color 0.3s;
    border-radius: 5px;
    background-color: white;
    box-shadow: 0 2px 4px rgb(0 0 0 / 10%);
    cursor: pointer;
  }

  li:hover {
    background-color: #f1f1f1;
  }

  .topic-name {
    flex: 1;
    margin-right: 10px;
  }

  .delete-topic-btn {
    padding: 5px 10px;
    transition: background-color 0.3s;
    border: none;
    border-radius: 3px;
    background-color: #dc3545;
    color: white;
    cursor: pointer;
  }

  .delete-topic-btn:hover {
    background-color: #c82333;
  }
</style>
