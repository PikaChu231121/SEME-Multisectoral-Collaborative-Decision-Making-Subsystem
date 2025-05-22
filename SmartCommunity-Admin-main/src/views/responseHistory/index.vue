<template>
  <div class="response-history">
    <!-- 刷新按钮 -->
    <el-button type="primary" :loading="loading" @click="fetchResponseHistory" style="margin-bottom: 15px;">
      {{ loading ? '加载中...' : '刷新历史记录' }}
    </el-button>

    <!-- 历史记录表格 -->
    <el-table :data="sortedHistoryData" border style="width: 100%">
      <!-- 替代原 ID，用行号+1 显示顺序编号 -->
      <el-table-column label="事件ID" width="100">
        <template #default="scope">
          <span>{{ sortedHistoryData.length - scope.$index }}</span>
        </template>
      </el-table-column>


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
