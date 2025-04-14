<template>
  <div class="fire-monitoring-system">
    <div class="nav-header">
      <div class="nav-container">
        <div class="nav-brand">
          <h1>实时检测系统</h1>
        </div>
        <div class="system-status">
          <div class="status-indicator">
            <div class="status-dot" />
            系统正常
          </div>
          <div class="status-indicator">
            <div class="status-dot warning" />
            <select v-model="selectedModel" class="model-select" @change="handleModelChange">
              <option value="">请选择摄像头</option>
              <option v-for="model in modelList" :key="model.label" :value="model.label">
                {{ model.label }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="main-content">
      <div class="content-grid">
        <!-- 左侧原始视频 -->
        <div class="left-panel">
          <h1>原始视频</h1>
          <div class="camera-feed">
            <video ref="videoLeft" :key="selectedModel" controls autoplay>
              <source :src="getVideoSource1(selectedModel)" type="video/mp4" />
              您的浏览器不支持视频播放。
            </video>
          </div>
        </div>

        <!-- 右侧标注视频 -->
        <div class="right-panel">
          <h1>标注视频</h1>
          <div class="camera-feed">
            <video v-if="videoLoaded" ref="videoRight" :key="selectedModel" controls autoplay>
              <source :src="getVideoSource2(selectedModel)" type="video/mp4" />
              您的浏览器不支持视频播放。
            </video>
            <div v-else class="placeholder">请点击“开始检测”开启高空抛物检测</div>
          </div>
          <button class="detect-button" @click="startDetection">开始/关闭检测</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, nextTick } from 'vue';
  import originVideo from './assets/origin.mp4';
  import kuangVideo from './assets/kuang.mp4';

  const modelList = ref([
    { label: '示例', value: '示例' },
    { label: '摄像头1', value: '摄像头1' },
    { label: '摄像头2', value: '摄像头2' },
  ]);

  const selectedModel = ref('');
  const videoLoaded = ref(false); //右侧视频是否需要加载
  const videoLeft = ref(null); //存储左侧视频的url
  const videoRight = ref(null); //存储右侧视频的url

  // 切换摄像头时触发此函数，重置右侧视频状态
  const handleModelChange = () => {
    console.log('选择的摄像头：', selectedModel.value);
    videoLoaded.value = false; // 重置右侧视频状态
  };

  const getVideoSource1 = (model) => {
    switch (model) {
      case '示例':
        return originVideo;
      case '摄像头1':
        return ''; // 替换为实际视频流 URL
      case '摄像头2':
        return ''; // 替换为实际视频流 URL
      default:
        return originVideo;
    }
  };

  const getVideoSource2 = (model) => {
    switch (model) {
      case '示例':
        return kuangVideo;
      case '摄像头1':
        return ''; // 替换为实际视频流 URL
      case '摄像头2':
        return ''; // 替换为实际视频流 URL
      default:
        return kuangVideo;
    }
  };

  // 点击 "开始检测" 后加载右侧视频
  const startDetection = async () => {
    if (videoLoaded.value) {
      videoRight.value.pause();
      videoLoaded.value = false;
    } else {
      videoLoaded.value = true;
      await nextTick();
      if (videoRight.value) {
        videoRight.value.load();
      }
      // videoLoaded.value = false;
      // await nextTick();
      // videoLoaded.value = true;

      // await nextTick();
      // if (videoRight.value) {
      //   videoRight.value.load(); // 重新加载视频
    }
  };
</script>

<style scoped>
  .fire-monitoring-system {
    min-height: 100vh;
    background-color: #f5f7fa;
  }

  .nav-header {
    position: sticky;
    z-index: 1000;
    top: 0;
    background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
    box-shadow: 0 2px 12px rgb(0 0 0 / 10%);
  }

  .nav-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1400px;
    height: 60px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .system-status {
    display: flex;
    gap: 15px;
  }

  .status-indicator {
    display: flex;
    align-items: center;
    padding: 4px 8px;
    border-radius: 12px;
    background: rgb(255 255 255 / 10%);
    color: white;
    font-size: 12px;
    gap: 5px;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #4caf50;
  }

  .status-dot.warning {
    background: #ff9800;
  }

  .main-content {
    max-width: 1400px;
    margin: 20px auto;
    padding: 0 20px;
  }

  .content-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .left-panel,
  .right-panel {
    width: 100%;
  }

  .camera-feed {
    position: relative;
    height: 300px;
    margin-bottom: 20px;
    overflow: hidden;
    border-radius: 8px;
    background: #000;
  }

  .camera-feed video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: white;
    font-size: 18px;
  }

  .detect-button {
    display: block;
    width: 50%;
    padding: 10px;
    border: none;
    border-radius: 4px;
    background: #409eff;
    color: white;
    font-size: 16px;
    cursor: pointer;
  }

  .detect-button:hover {
    background: #409eff;
  }

  .model-select {
    margin-left: 10px;
    padding: 5px 10px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    outline: none;
    background-color: #fff;
    color: #606266;
    font-size: 14px;
  }

  .model-select:hover {
    border-color: #c0c4cc;
  }

  .model-select:focus {
    border-color: #409eff;
  }

  .nav-brand h1 {
    margin: 0;
    color: white;
    font-size: 20px;
  }
</style>
