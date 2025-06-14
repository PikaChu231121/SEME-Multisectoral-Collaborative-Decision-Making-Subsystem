<template>
  <div class="history-record">
    <div class="record-header">
      <div class="toggle-icon" @click="toggleDetails">
        <RightOutlined :rotate="isExpanded ? 90 : 0" />
      </div>
      <div>
        <div class="record-metadata">
          <span>{{ record.created_at }}</span>
        </div>
        <div class="record-info">
          <span>模型ID: {{ record.model_id }}</span>
          <span>边缘设备: {{ record.edge_id }}</span>
          <span>服务器: {{ record.server_id }}</span>
          <span>带宽：{{ record.bandwidth }} KB/s</span>
        </div>
      </div>
    </div>

    <div v-if="isExpanded" class="record-details">
      <div v-if="loading" class="loading">加载中...</div>
      <template v-else>
        <!-- 新增：任务信息区域，显示任务ID、输入文本和带宽 -->
        <div class="task-info">
          <h3>输入文本</h3>
          <p>{{ detailData.input_text }}</p>
        </div>
        <div ref="chart" class="chart-container" />
        <!-- 图表分页按钮 -->
        <div v-if="chartTotalPages > 1" class="pagination">
          <button :disabled="chartCurrentPage <= 1" @click="changePage(chartCurrentPage - 1)"
            >上一页</button
          >
          <span>第 {{ chartCurrentPage }} 页 / {{ chartTotalPages }} 页</span>
          <button
            :disabled="chartCurrentPage >= chartTotalPages"
            @click="changePage(chartCurrentPage + 1)"
            >下一页</button
          >
        </div>
        <div class="text-result">
          <h3>最优分割点：第 {{ detailData.optimal_split }} 层</h3>
          <p>层名称：{{ detailData.layer_names[detailData.optimal_split] }}</p>
          <p>端到端时延：{{ detailData.predicted_latency.toFixed(2) }} ms</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  import * as echarts from 'echarts';
  import { RightOutlined } from '@ant-design/icons-vue';

  export default {
    name: 'HistoryRecordItem',
    components: {
      RightOutlined,
    },
    props: {
      record: {
        type: Object,
        required: true,
      },
      detailData: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        isExpanded: false,
        loading: false,
        chart: null,
        chartCurrentPage: 1,
        chartTotalPages: 1,
        chartItemsPerPage: 30,
      };
    },
    beforeUnmount() {
      if (this.chart) {
        this.chart.dispose();
      }
    },
    methods: {
      toggleDetails() {
        this.isExpanded = !this.isExpanded;
        if (this.isExpanded) {
          // 计算图表总页数
          this.chartTotalPages = Math.ceil(
            this.detailData.layer_names.length / this.chartItemsPerPage,
          );
          // 自动跳转到最优分割点所在的图表页（最优分割点为1基索引）
          this.chartCurrentPage =
            Math.ceil(this.detailData.optimal_split / this.chartItemsPerPage) || 1;
          this.$nextTick(() => this.renderChart());
        }
      },

      renderChart() {
        if (this.chart) this.chart.dispose();

        const chartDom = this.$refs.chart;
        this.chart = echarts.init(chartDom);

        const start = (this.chartCurrentPage - 1) * this.chartItemsPerPage;
        const end = Math.min(start + this.chartItemsPerPage, this.detailData.layer_names.length);
        const layersToDisplay = this.detailData.layer_names.slice(start, end);
        const latenciesToDisplay = this.detailData.layer_latencies.slice(start, end);
        const sizesToDisplay = this.detailData.output_sizes.slice(start, end);

        const optimalSplitIndex = this.detailData.optimal_split - start;
        const formattedLayerNames = layersToDisplay.map((name, index) => {
          return index === optimalSplitIndex ? `{red|${name}}` : name;
        });

        const option = {
          tooltip: { trigger: 'axis' },
          legend: {
            data: ['层时延', '输出规模'],
            top: 30,
          },
          grid: {
            top: 80,
            bottom: 100,
          },
          xAxis: {
            type: 'category',
            data: formattedLayerNames,
            axisLabel: {
              rotate: 45,
              rich: { red: { color: 'red', fontWeight: 'bold' } },
            },
          },
          yAxis: [
            {
              type: 'value',
              name: '层时延 (ms)',
              axisLine: { lineStyle: { color: '#9CC0CF' } },
            },
            {
              type: 'value',
              name: '输出规模 (KB)',
              axisLine: { lineStyle: { color: '#3A3458' } },
            },
          ],
          series: [
            {
              name: '层时延',
              type: 'bar',
              data: latenciesToDisplay,
              itemStyle: { color: '#9CC0CF' },
              barMaxWidth: 30,
            },
            {
              name: '输出规模',
              type: 'bar',
              yAxisIndex: 1,
              data: sizesToDisplay,
              itemStyle: { color: '#3A3458' },
              barMaxWidth: 30,
            },
          ],
        };

        this.chart.setOption(option);
      },

      changePage(page) {
        if (page < 1 || page > this.chartTotalPages) return;
        this.chartCurrentPage = page;
        this.renderChart();
      },
    },
  };
</script>

<style scoped>
  .history-record {
    margin-bottom: 15px;
    overflow: hidden;
    border: 1px solid #ddd;
    border-radius: 8px;
  }

  .record-header {
    display: flex;
    gap: 40px;
    align-items: center;
    padding: 15px;
    background: #f8f9fa;
    cursor: pointer;
  }

  .record-metadata {
    display: flex;
    gap: 20px;
    margin-bottom: 10px;
    font-size: large;
    font-weight: bold;
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
    border: none;
    border-radius: 4px;
    background: #3498db;
    color: white;
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
    padding: 5px 15px;
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

  .task-info {
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: #f9f9f9;
  }

  .task-info p {
    margin: 5px 0;
    color: #333;
  }
</style>
