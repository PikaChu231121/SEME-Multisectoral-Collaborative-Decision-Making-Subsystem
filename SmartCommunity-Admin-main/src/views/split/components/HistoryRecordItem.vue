<template>
  <div class="history-record">
    <div class="record-header" @click="toggleDetails">
      <div class="record-info">
        <span>任务ID: {{ record.task_id }}</span>
        <span>模型ID: {{ record.model_id }}</span>
        <span>边缘设备: {{ record.edge_id }}</span>
        <span>服务器: {{ record.server_id }}</span>
      </div>
      <button class="detail-button">
        {{ isExpanded ? '收起' : '详情' }}
      </button>
    </div>

    <div v-if="isExpanded" class="record-details">
      <div v-if="loading" class="loading">加载中...</div>
      <template v-else>
        <div ref="chart" class="chart-container"></div>
        <!-- 分页按钮 -->
        <div class="pagination" v-if="totalPages > 1">
          <button :disabled="currentPage <= 1" @click="changePage(currentPage - 1)">上一页</button>
          <span>第 {{ currentPage }} 页 / {{ totalPages }} 页</span>
          <button :disabled="currentPage >= totalPages" @click="changePage(currentPage + 1)">下一页</button>
        </div>

        <div class="text-result">
          <h3>最优分割点：第 {{ result.optimal_split }} 层</h3>
          <p>层名称：{{ result.layer_names[result.optimal_split] }}</p>
          <p>端到端时延：{{ result.predicted_latency.toFixed(2) }} ms</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { getSplitHistoryDetail } from '@/api/backend/api/splitTab';

export default {
  name: 'HistoryRecordItem',
  props: {
    record: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isExpanded: false,
      loading: false,
      result: null,
      chart: null,
      currentPage: 1,
      totalPages: 1,
      itemsPerPage: 30
    };
  },
  methods: {
    async toggleDetails() {
      this.isExpanded = !this.isExpanded;
      if (this.isExpanded && !this.result) {
        await this.fetchDetails();
      }
    },
    
    async fetchDetails() {
      this.loading = true;
      try {
        const response = await getSplitHistoryDetail(this.record.task_id);
        this.result = response.data;
        this.totalPages = Math.ceil(this.result.layer_names.length / this.itemsPerPage);
        this.currentPage = 1; // Reset to first page after new analysis
        this.$nextTick(() => this.renderChart());
      } catch (error) {
        console.error('获取详情失败:', error);
      } finally {
        this.loading = false;
      }
    },

    renderChart() {
      if (this.chart) this.chart.dispose();

      const chartDom = this.$refs.chart;
      this.chart = echarts.init(chartDom);

      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = Math.min(start + this.itemsPerPage, this.result.layer_names.length);
      const layersToDisplay = this.result.layer_names.slice(start, end);
      const latenciesToDisplay = this.result.layer_latencies.slice(start, end);
      const sizesToDisplay = this.result.output_sizes.slice(start, end);

      const optimalSplitIndex = this.result.optimal_split - start;
      const formattedLayerNames = layersToDisplay.map((name, index) => {
        return index === optimalSplitIndex ? `{red|${name}}` : name;
      });

      const option = {
        tooltip: { trigger: 'axis' },
        legend: {
          data: ['层时延', '输出规模'],
          top: 30
        },
        grid: {
          top: 80,
          bottom: 100
        },
        xAxis: {
          type: 'category',
          data: formattedLayerNames,
          axisLabel: {
            rotate: 45,
            rich: { red: { color: 'red', fontWeight: 'bold' } }
          }
        },
        yAxis: [
          {
            type: 'value',
            name: '层时延 (ms)',
            axisLine: { lineStyle: { color: '#9CC0CF' } }
          },
          {
            type: 'value',
            name: '输出规模 (MB)',
            axisLine: { lineStyle: { color: '#3A3458' } }
          }
        ],
        series: [
          {
            name: '层时延',
            type: 'bar',
            data: latenciesToDisplay,
            itemStyle: { color: '#9CC0CF' },
            barMaxWidth: 30
          },
          {
            name: '输出规模',
            type: 'bar',
            yAxisIndex: 1,
            data: sizesToDisplay,
            itemStyle: { color: '#3A3458' },
            barMaxWidth: 30
          }
        ]
      };

      this.chart.setOption(option);
    },

    changePage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
      this.renderChart();
    }
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
  }
};
</script>

<style scoped>
.history-record {
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  cursor: pointer;
}

.record-info {
  display: flex;
  gap: 20px;
}

.record-info span {
  color: #2c3e50;
}

.detail-button {
  padding: 5px 15px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.record-details {
  padding: 20px;
  background: white;
}

.chart-container {
  height: 600px;
  margin-bottom: 20px;
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
  padding: 5px 15px;
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
</style> 