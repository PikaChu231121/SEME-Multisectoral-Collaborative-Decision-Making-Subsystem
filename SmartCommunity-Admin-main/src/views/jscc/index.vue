<template>
  <div>
    <h1>信源信道联合编码 演示</h1>
    <a-upload @change="handleFileChange">
      <a-button @click="clickupload">
        <upload-outlined />
        上传图片
      </a-button>

      <template #itemRender="{}">
        <a-space />
      </template>
    </a-upload>

    <!-- 显示进度条 -->
    <a-progress
      v-if="showProgress"
      :percent="progress"
      status="active"
      style="width: 50%; margin-top: 20px"
    />

    <h1 v-if="havepic == 2" style="margin-top: 2%">传输后图片：</h1>
    <a-image
      v-if="havepic == 2"
      :width="400"
      src="https://pic1.imgdb.cn/item/67b83f2fd0e0a243d40158fa.png"
    />
    <div v-if="havepic == 2">
      <p style="margin-top: 1%; font-size: large">PSNR: 30.1728</p>
      <p style="margin-top: 0.1%; font-size: large">MS-SSIM: 11.672</p>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import { message } from 'ant-design-vue';
  export default {
    name: 'VideoSearch',
    data() {
      return {
        havepic: 1,
        haveres: 0,
        streamlitUrl: '',
        isLoading: false,
        error: '',
        checkInterval: null,
        showProgress: false, // 控制进度条显示
        progress: 0, // 进度条的百分比
      };
    },
    beforeUnmount() {
      if (this.checkInterval) {
        clearInterval(this.checkInterval);
      }
    },
    methods: {
      pre() {
        this.havepic = this.value1;
      },
      handleFileChange(info) {
        if (info.fileList.length > 0) {
          // 当选择图片后显示进度条
          this.showProgress = true;
          this.progress = 0;

          // 模拟进度
          let interval = setInterval(() => {
            if (this.progress < 100) {
              this.progress += 10;
            } else {
              clearInterval(interval);
              setTimeout(() => {
                this.showProgress = false;
                this.havepic = 2; // 假设上传后显示图片
              }, 1000); // 1秒后隐藏进度条
            }
          }, 500); // 每500ms更新一次进度
        }
      },
      clickupload() {
        // 上传时的一些额外逻辑，如果需要可以在这里添加
      },
      info() {
        message.loading('处理中，请耐心等待一段时间……', 15);
        setTimeout(() => {
          this.haveres = this.havepic;
        }, 15000);
      },

      async startStreamlit() {
        this.isLoading = true;
        this.error = '';

        try {
          // 调用后端API启动Streamlit
          const response = await axios.post('http://localhost:5000/start-streamlit');

          if (response.data.success) {
            this.streamlitUrl = 'http://localhost:8501';
            // 开始检查Streamlit服务是否准备就绪
            this.checkStreamlitStatus();
          } else {
            this.error = '启动失败：' + response.data.message;
          }
        } catch (err) {
          this.error = '启动失败：' + err.message;
        } finally {
          this.isLoading = false;
        }
      },

      async checkStreamlitStatus() {
        this.checkInterval = setInterval(async () => {
          try {
            const response = await axios.get('http://localhost:8501/healthz');
            if (response.status === 200) {
              clearInterval(this.checkInterval);
              this.isLoading = false;
            }
          } catch (err) {
            // 继续等待
          }
        }, 1000);
      },
    },
  };
</script>

<style scoped>
  .video-search-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  .control-panel {
    margin-bottom: 20px;
    text-align: center;
  }

  .start-button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    background-color: #4caf50;
    color: white;
    font-size: 16px;
    cursor: pointer;
  }

  .start-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  .streamlit-container {
    overflow: hidden;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .error-message {
    margin-top: 10px;
    color: #f00;
    text-align: center;
  }
</style>
