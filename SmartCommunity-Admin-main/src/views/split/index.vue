<template>
  <div class="container">
    <!-- 输入区域 -->
    <div class="input-section">
      <div class="upload-group">
        <label class="upload-label">1. 选择模型文件 (.onnx)：</label>
        <div class="upload-wrapper">
          <input
            id="modelUpload"
            type="file"
            accept=".onnx"
            class="upload-input"
            @change="handleModelUpload"
          />
          <label for="modelUpload" class="upload-button">选择模型</label>
          <span class="file-name">{{ modelFile ? modelFile.name : '未选择文件' }}</span>
        </div>
      </div>

      <div class="upload-group">
        <label class="upload-label">2. 选择输入图片 (.png/.jpg)：</label>
        <div class="upload-wrapper">
          <input
            id="imageUpload"
            type="file"
            accept=".png,.jpg,.jpeg"
            class="upload-input"
            @change="handleImageUpload"
          />
          <label for="imageUpload" class="upload-button">选择图片</label>
          <span class="file-name">{{ imageFile ? imageFile.name : '未选择文件' }}</span>
        </div>
        <div v-if="imagePreview" class="image-preview">
          <img :src="imagePreview" alt="预览图片" class="preview-image" />
        </div>
      </div>

      <div class="input-group">
        <label class="input-label">3. 输入网络带宽 (MB/s)：</label>
        <input v-model.number="bandwidth" type="number" min="1" step="1" class="bandwidth-input" />
      </div>
    </div>

    <button class="analyze-button" :disabled="isLoading" @click="analyze">
      <span v-if="!isLoading">开始分析</span>
      <div v-else class="loader" />
    </button>

    <div class="result-section">
      <div v-show="result" ref="chart" class="chart-container" />

      <!-- 分页按钮 -->
      <div v-if="result && totalPages > 1" class="pagination">
        <button :disabled="currentPage <= 1" @click="changePage(currentPage - 1)">上一页</button>
        <span>第 {{ currentPage }} 页 / {{ totalPages }} 页</span>
        <button :disabled="currentPage >= totalPages" @click="changePage(currentPage + 1)"
          >下一页</button
        >
      </div>

      <div v-if="result" class="text-result">
        <h3>📌 最优分割点：第 {{ result.optimal_split }} 层</h3>
        <p>层名称：{{ result.layer_names[result.optimal_split] }}</p>
        <p>⏱️ 总开销：{{ result.min_cost.toFixed(2) }} ms</p>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import * as echarts from 'echarts';

  export default {
    data() {
      return {
        modelFile: null,
        imageFile: null,
        imagePreview: null,
        bandwidth: 100,
        result: null,
        chart: null,
        isLoading: false,
        currentPage: 1,
        itemsPerPage: 30,
        totalPages: 1,
      };
    },
    methods: {
      handleModelUpload(event) {
        const file = event.target.files[0];
        if (file && file.name.endsWith('.onnx')) {
          this.modelFile = file;
        } else {
          alert('请选择有效的ONNX模型文件！');
          event.target.value = '';
        }
      },

      handleImageUpload(event) {
        const file = event.target.files[0];
        if (file && /\.(png|jpe?g)$/i.test(file.name)) {
          this.imageFile = file;
          const reader = new FileReader();
          reader.onload = (e) => {
            this.imagePreview = e.target.result;
          };
          reader.readAsDataURL(file);
        } else {
          alert('请选择有效的图片文件（PNG/JPEG）！');
          event.target.value = '';
        }
      },

      async analyze() {
        if (!this.validateInputs()) return;

        this.isLoading = true;
        const formData = new FormData();
        formData.append('model', this.modelFile);
        formData.append('image', this.imageFile);
        formData.append('bandwidth', this.bandwidth);

        try {
          const response = await axios.post(
            `http://${import.meta.env.DEV ? 'localhost' : '121.5.16.33'}:5002/analyze`,
            formData,
            {
              headers: { 'Content-Type': 'multipart/form-data' },
            },
          );
          this.result = response.data;
          this.totalPages = Math.ceil(this.result.layer_names.length / this.itemsPerPage);
          this.currentPage = 1; // Reset to first page after new analysis
          this.$nextTick(() => this.renderChart());
        } catch (error) {
          alert(`分析失败：${error.response?.data?.message || error.message}`);
        } finally {
          this.isLoading = false;
        }
      },

      validateInputs() {
        if (!this.modelFile) {
          alert('请先选择模型文件！');
          return false;
        }
        if (!this.imageFile) {
          alert('请先选择输入图片！');
          return false;
        }
        if (this.bandwidth <= 0) {
          alert('带宽必须大于0！');
          return false;
        }
        return true;
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

        // 计算当前页的分割点层名位置
        const optimalSplitIndex = this.result.optimal_split - start;
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
            data: formattedLayerNames, // 使用格式化后的层名
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
              name: '输出规模 (MB)',
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
        if (page < 1 || page > this.totalPages) return;
        this.currentPage = page;
        this.renderChart();
      },
    },
  };
</script>

<style scoped>
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  /* 输入区域样式 */
  .input-section {
    margin: 20px 0;
    padding: 20px;
    border-radius: 8px;
    background: #f8f9fa;
  }

  .upload-group {
    margin-bottom: 25px;
  }

  .upload-label {
    display: block;
    margin-bottom: 10px;
    color: #2c3e50;
    font-weight: 500;
  }

  .upload-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .upload-input {
    display: none;
  }

  .upload-button {
    padding: 8px 15px;
    transition: background 0.3s;
    border-radius: 4px;
    background: #3498db;
    color: white;
    cursor: pointer;
  }

  .upload-button:hover {
    background: #2980b9;
  }

  .file-name {
    color: #7f8c8d;
  }

  /* 图片预览 */
  .image-preview {
    margin-top: 15px;
    padding: 10px;
    border: 2px dashed #ddd;
    border-radius: 4px;
  }

  .preview-image {
    max-width: 300px;
    max-height: 200px;
    object-fit: contain;
  }

  /* 带宽输入 */
  .input-group {
    margin-top: 20px;
  }

  .input-label {
    display: block;
    margin-bottom: 10px;
  }

  .bandwidth-input {
    width: 200px;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  /* 分析按钮 */
  .analyze-button {
    width: 200px;
    padding: 12px 25px;
    transition: background 0.3s;
    border: none;
    border-radius: 4px;
    background: #27ae60;
    color: white;
    font-size: 16px;
    cursor: pointer;
  }

  .analyze-button:hover:not(:disabled) {
    background: #219a52;
  }

  .analyze-button:disabled {
    background: #95a5a6;
    cursor: not-allowed;
  }

  /* 加载动画 */
  .loader {
    width: 20px;
    height: 20px;
    margin: 0 auto;
    animation: spin 1s linear infinite;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #3498db;
    border-radius: 50%;
  }

  /* 结果展示 */
  .chart-container {
    width: 100%;
    height: 600px;
    margin-top: 30px;
  }

  .text-result {
    margin-top: 20px;
    padding: 15px;
    border-radius: 8px;
    background: #f8f9fa;
  }

  /* 其他样式保持不变 */
  .pagination {
    margin-top: 20px;
    text-align: center;
  }

  .pagination button {
    margin: 0 10px;
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
    margin: 0 10px;
    font-size: 16px;
  }
</style>
