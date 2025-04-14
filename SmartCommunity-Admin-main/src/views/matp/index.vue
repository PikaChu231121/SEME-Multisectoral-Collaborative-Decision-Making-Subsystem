<template>
  <div class="upload-container">
    <div class="file-input-group">
      <label>选择车辆历史轨迹数据文件(.pyg)：</label>
      <input type="file" accept=".pyg" @change="handlePygUpload" />
    </div>

    <div class="file-input-group">
      <label>选择地图文件(.osm)：</label>
      <input type="file" accept=".osm" @change="handleOsmUpload" />
    </div>

    <button @click="submitFiles">生成多车轨迹预测图</button>
    <!-- 新增图片展示区域 -->
    <div v-if="resultImage" class="preview-box">
      <h3>处理结果：（红色的为车辆历史轨迹，绿色为轨迹预测结果，蓝色为划分车道的车道线）</h3>
      <img :src="resultImage" alt="处理结果图" class="result-image" />
    </div>
    <!-- 新增论文信息区块 -->
    <section class="paper-info">
      <h2>相关研究成果</h2>
      <div class="performance-chart">
        <img src="@/assets/images/compare.png" alt="模型性能对比图" />
      </div>
      <div class="paper-details">
        <strong
          >Yao K, Han F, Zhao S. Attention Enhanced Transformer for Multi-agent Trajectory
          Prediction[C]//International Conference on Intelligent Computing. Singapore: Springer
          Nature Singapore, 2024: 275-286.</strong
        >
      </div>
    </section>
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner" />
      <div class="loading-text">生成预测图中，请稍候...</div>
    </div>
  </div>
</template>

<script>
  import { ref } from 'vue';
  import axios from 'axios';
  import { ElMessage } from 'element-plus'; // 新增导入

  export default {
    setup() {
      const pygFile = ref(null);
      const osmFile = ref(null);
      const resultImage = ref(null);
      const isLoading = ref(false);
      const handlePygUpload = (e) => {
        const files = e.target.files;
        if (files) pygFile.value = files[0];
      };

      const handleOsmUpload = (e) => {
        const files = e.target.files;
        if (files) osmFile.value = files[0];
      };

      const submitFiles = async () => {
        if (!pygFile.value || !osmFile.value) {
          alert('请同时选择两个文件');
          return;
        }
        isLoading.value = true;
        const formData = new FormData();
        formData.append('pyg', pygFile.value);
        formData.append('osm', osmFile.value);

        try {
          const response = await axios.post('http://106.14.24.44:8000/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            responseType: 'blob',
          });
          ElMessage.success({
            message: '预测图生成成功',
            duration: 3000,
            showClose: true,
          });
          resultImage.value = URL.createObjectURL(new Blob([response.data]));
        } catch (error) {
          ElMessage.error({
            message: `生成失败: ${error.response?.data?.error || '服务器错误'}`,
            duration: 4000,
            showClose: true,
          });
        } finally {
          isLoading.value = false; // 结束加载
        }
      };
      return {
        pygFile,
        osmFile,
        resultImage,
        isLoading,
        handlePygUpload,
        handleOsmUpload,
        submitFiles,
      };
    },
  };
</script>

<style scoped>
  .upload-container {
    max-width: 70%;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ddd;

    .file-input-group {
      margin-bottom: 15px;

      label {
        display: block;
        margin-bottom: 5px;
      }

      input[type='file'] {
        width: 100%;
        padding: 8px;
        border: 1px solid #ccc;
      }
    }

    button {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      background-color: #409eff;
      color: white;
      cursor: pointer;

      &:hover {
        background-color: #66b1ff;
      }
    }

    .preview-box {
      margin-top: 20px;
      padding: 15px;
      border-top: 1px solid #eee;

      h3 {
        margin-bottom: 10px;
      }

      .result-image {
        max-width: 100%;
        padding: 5px;
        border: 1px solid #ddd;
        background: #f8f8f8;
      }
    }

    .paper-info {
      margin-top: 40px;
      padding: 20px;
      border-top: 2px solid #eee;
      border-radius: 8px;
      background: #f9f9f9;

      h2 {
        margin-bottom: 15px;
        color: #2c3e50;
        font-size: 1.5em;
      }

      .performance-chart {
        max-width: 800px;
        margin: 0 auto 20px;
        padding: 10px;
        border: 1px solid #ddd;
        background: white;

        img {
          width: 100%;
          height: auto;
        }
      }

      .paper-details {
        padding: 15px;
        border-radius: 4px;
        background: white;
        color: #666;
        font-size: 0.95em;
        line-height: 1.8;

        strong {
          display: inline-block;
          min-width: 80px;
          color: #000;
        }
      }
    }
  }

  .loading-overlay {
    display: flex;
    position: fixed;
    z-index: 9999;
    inset: 0;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgb(255 255 255 / 80%);
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    margin-bottom: 10px;
    animation: spin 1s linear infinite;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #409eff;
    border-radius: 50%;
  }

  .loading-text {
    color: #409eff;
    font-size: 16px;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
</style>
