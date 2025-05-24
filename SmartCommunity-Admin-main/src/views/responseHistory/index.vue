<template>
  <div class="response-history">
    <!-- 页面标题区域 -->
    <div class="page-header">
      <div class="header-content">
        <h1>响应历史记录</h1>
        <p>查看历史火灾应急响应方案</p>
      </div>
      <el-button type="primary" :loading="loading" @click="fetchResponseHistory" class="refresh-btn">
        <i class="el-icon-refresh" v-if="!loading"></i>
        {{ loading ? '加载中...' : '刷新历史记录' }}
      </el-button>
    </div>

    <!-- 历史记录表格 -->
    <div class="history-table-container">
      <el-table 
        :data="sortedHistoryData" 
        border 
        style="width: 100%"
        :header-cell-style="{
          background: '#f5f7fa',
          color: '#606266',
          fontWeight: 'bold',
          fontSize: '14px',
          textAlign: 'center',
          height: '50px'
        }"
        :cell-style="{
          textAlign: 'center',
          padding: '12px 0'
        }"
      >
        <el-table-column label="事件ID" width="100">
          <template #default="{ row }">
            <div class="event-id">
              <span class="id-number">{{ row.id }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="createdAt" label="创建时间" width="200">
          <template #default="{ row }">
            <div class="time-cell">
              <i class="el-icon-time"></i>
              <span>{{ formatTime(row.createdAt) }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="部门列表">
          <template #default="{ row }">
            <div class="departments-tags">
              <el-tag 
                v-for="dept in formatDepartments(row.departments)" 
                :key="dept"
                :type="getDeptTagType(dept)"
                class="dept-tag"
              >
                {{ dept }}
              </el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button 
              type="primary" 
              size="small" 
              @click="goToDetail(row.id)"
              class="detail-btn"
            >
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ElMessage } from 'element-plus';

export default {
  name: 'ResponseHistory',
  data() {
    return {
      historyData: [],
      loading: false
    };
  },
  computed: {
    // 根据创建时间降序排列
    sortedHistoryData() {
      return [...this.historyData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  },
  methods: {
    async fetchResponseHistory() {
      this.loading = true;
      try {
        const response = await axios.get('/api/response-history');
        this.historyData = response.data || [];
      } catch (error) {
        console.error('获取历史记录失败:', error);
        ElMessage.error('加载失败，请稍后重试');
      } finally {
        this.loading = false;
      }
    },
    formatTime(datetime) {
      return new Date(datetime).toLocaleString();
    },
    formatDepartments(departmentsJson) {
      try {
        const depts = JSON.parse(departmentsJson);
        return Array.isArray(depts) ? depts : [];
      } catch {
        return [];
      }
    },
    getDeptTagType(dept) {
      const typeMap = {
        '消防': 'danger',
        '医院': 'success',
        '安保': 'primary',
        '物业': 'warning'
      };
      return typeMap[dept] || 'info';
    },
    goToDetail(id) {
      this.$router.push({ name: 'response-history-detail', params: { id } });
    }
  },
  mounted() {
    this.fetchResponseHistory();
  }
};
</script>

<style scoped>
.response-history {
  padding: 24px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.header-content h1 {
  margin: 0;
  font-size: 24px;
  color: #1976d2;
  font-weight: 600;
}

.header-content p {
  margin: 8px 0 0;
  color: #606266;
  font-size: 14px;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  border-radius: 8px;
  padding: 10px 16px;
  font-weight: 500;
}

.refresh-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.2);
}

.history-table-container {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.event-id {
  display: flex;
  justify-content: center;
  align-items: center;
}

.id-number {
  width: 32px;
  height: 32px;
  background: #1976d2;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.time-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #606266;
}

.departments-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.dept-tag {
  border-radius: 4px;
  padding: 4px 8px;
}

.detail-btn {
  transition: all 0.2s ease;
}

.detail-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.2);
}
</style>
