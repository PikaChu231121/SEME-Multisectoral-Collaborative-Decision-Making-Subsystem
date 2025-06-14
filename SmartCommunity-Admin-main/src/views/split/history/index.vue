<template>
  <div class="container">
    <h2>历史记录</h2>
    <div v-if="loading" class="loading">加载中...</div>
    <template v-else>
      <HistoryRecordItem
        v-for="record in processedRecords"
        :key="record.task_id"
        :record="record"
        :detail-data="getDetailData(record.task_id)"
      />
      <!-- 分页控制 -->
      <div class="pagination">
        <button :disabled="currentPage <= 1" @click="changePage(currentPage - 1)">上一页</button>
        <span>第 {{ currentPage }} 页</span>
        <button :disabled="currentPage >= totalPages" @click="changePage(currentPage + 1)"
          >下一页</button
        >
      </div>
    </template>
  </div>
</template>

<script>
  import HistoryRecordItem from '@/views/split/components/HistoryRecordItem.vue';
  import { getSplitHistory } from '@/api/backend/api/splitTab';

  export default {
    name: 'HistoryPage',
    components: { HistoryRecordItem },
    data() {
      return {
        loading: false,
        historyRecords: [],
        currentPage: 1,
        totalPages: 1,
        pageSize: 10,
      };
    },
    computed: {
      processedRecords() {
        return this.historyRecords.map((record) => ({
          task_id: record.task_id,
          created_at: record.created_at,
          model_id: record.model_id,
          edge_id: record.edge_id,
          server_id: record.server_id,
          bandwidth: record.bandwidth,
        }));
      },
    },
    created() {
      this.fetchHistoryRecords();
    },
    methods: {
      async fetchHistoryRecords() {
        this.loading = true;
        try {
          const { data: response } = await getSplitHistory({
            page: this.currentPage,
            page_size: this.pageSize,
          });
          if (response && response.records) {
            this.historyRecords = response.records;
            this.totalPages = Math.ceil(response.total / this.pageSize);
          } else {
            console.error('返回数据格式不正确:', response);
            this.$message.error('获取数据失败：返回格式不正确');
          }
        } catch (error) {
          console.error('获取历史记录失败:', error);
          this.$message.error('获取历史记录失败');
        } finally {
          this.loading = false;
        }
      },
      async changePage(page) {
        if (page < 1 || page > this.totalPages) return;
        this.currentPage = page;
        await this.fetchHistoryRecords();
      },
      getDetailData(taskId) {
        return this.historyRecords.find((record) => record.task_id === taskId);
      },
    },
  };
</script>

<style scoped>
  /* ...existing container, loading, pagination 样式... */
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    border-radius: 8px;
    background: white;
    box-shadow: 0 2px 4px rgb(0 0 0 / 10%);
  }

  .loading {
    padding: 20px;
    color: #666;
    text-align: center;
  }

  .pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    gap: 10px;
  }

  .pagination button {
    padding: 8px 15px;
    border: none;
    border-radius: 4px;
    background: #3498db;
    color: white;
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
