<template>
  <div class="response-history">
    <!-- 刷新按钮 -->
    <el-button type="primary" :loading="loading" @click="fetchResponseHistory" style="margin-bottom: 15px;">
      {{ loading ? '加载中...' : '刷新历史记录' }}
    </el-button>

    <!-- 历史记录表格 -->
    <el-table :data="historyData" border style="width: 100%">
      <el-table-column prop="id" label="事件 ID" width="100" />

      <el-table-column prop="createdAt" label="创建时间" width="200">
        <template #default="{ row }">
          <span>{{ formatTime(row.createdAt) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="部门列表">
        <template #default="{ row }">
          <span>{{ formatDepartments(row.departments) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button size="small" @click="goToDetail(row.id)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
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
        return Array.isArray(depts) ? depts.join(', ') : '-';
      } catch {
        return '-';
      }
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
  padding: 10px;
}
</style>
