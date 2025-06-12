<template>
  <div class="container">
    <!-- 顶部注册区域 -->
    <div class="register-section">
      <div class="register-card">
        <ModelRegisterForm
          @success="handleModelRegisterSuccess"
          @error="handleRegisterError"
        />
      </div>
      <div class="register-card">
        <DeviceRegisterForm
          @success="handleDeviceRegisterSuccess"
          @error="handleRegisterError"
        />
      </div>
    </div>

    <!-- 历史记录区域 -->
    <div class="history-section">
      <h2>历史记录</h2>
      <div v-if="loading" class="loading">加载中...</div>
      <template v-else>
        <HistoryRecordItem
          v-for="record in historyRecords"
          :key="record.task_id"
          :record="record"
        />
        
        <!-- 分页控制 -->
        <div class="pagination">
          <button
            :disabled="currentPage <= 1"
            @click="changePage(currentPage - 1)"
          >
            上一页
          </button>
          <span>第 {{ currentPage }} 页</span>
          <button
            :disabled="currentPage >= totalPages"
            @click="changePage(currentPage + 1)"
          >
            下一页
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import ModelRegisterForm from '@/views/split/components/ModelRegisterForm.vue';
import DeviceRegisterForm from '@/views/split/components/DeviceRegisterForm.vue';
import HistoryRecordItem from '@/views/split/components/HistoryRecordItem.vue';

export default {
  name: 'SplitView',
  components: {
    ModelRegisterForm,
    DeviceRegisterForm,
    HistoryRecordItem
  },
  data() {
    return {
      loading: false,
      historyRecords: [],
      currentPage: 1,
      totalPages: 1,
      pageSize: 10
    };
  },
  created() {
    this.fetchHistoryRecords();
  },
  methods: {
    async fetchHistoryRecords() {
      this.loading = true;
      try {
        const response = await axios.get('/get_split_history', {
          params: {
            page: this.currentPage,
            page_size: this.pageSize
          }
        });
        this.historyRecords = response.data.records;
        this.totalPages = response.data.total_pages;
      } catch (error) {
        console.error('获取历史记录失败:', error);
      } finally {
        this.loading = false;
      }
    },
    async changePage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
      await this.fetchHistoryRecords();
    },
    handleModelRegisterSuccess() {
      this.$message.success('模型注册成功');
    },
    handleDeviceRegisterSuccess() {
      this.$message.success('设备注册成功');
    },
    handleRegisterError(error) {
      this.$message.error(error);
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.register-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.register-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.history-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.history-section h2 {
  margin-bottom: 20px;
  color: #2c3e50;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #666;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}

.pagination button {
  padding: 8px 15px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button:disabled {
  background: #95a5a6;
  cursor: not-allowed;
}

.pagination span {
  color: #2c3e50;
}
</style>
