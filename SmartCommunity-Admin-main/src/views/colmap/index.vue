<template>
  <div>
    <a-row :gutter="24">
      <a-col :span="12">
        <a-space>
          <a-select
            ref="select"
            v-model:value="value1"
            placeholder="请选择预设图片组"
            style="width: 280px"
            @focus="focus"
            @change="handleChange"
          >
            <a-select-option value="1">预设1（摄像头组）</a-select-option>
            <a-select-option value="2">预设2（摄像头组）</a-select-option>
            <a-select-option value="3">预设3（摄像头组）</a-select-option>
          </a-select>
          <a-button type="success" @click="pre">选择预设项</a-button>
          <a-upload directory>
            <a-button @click="clickupload">
              <upload-outlined />
              选择图片文件夹
            </a-button>

            <template #itemRender="{}">
              <a-space />
            </template>
          </a-upload>
        </a-space>

        <h1 style="margin-top: 20px">待建模图片预览</h1>
        <div
          v-if="havepic == 1"
          style="height: 300px; margin-top: 2%; padding: 20px; background-color: #ececec"
        >
          <div style="margin-top: 10px">
            <a-row :gutter="8">
              <a-col :span="6">
                <a-image
                  :width="120"
                  src="https://pic1.imgdb.cn/item/677cce3fd0e0a243d4f117df.jpg"
                />
              </a-col>
              <a-col :span="6">
                <a-image
                  :width="120"
                  src="https://pic1.imgdb.cn/item/677cce3fd0e0a243d4f117df.jpg"
                />
              </a-col>
              <a-col :span="6">
                <a-image
                  :width="120"
                  src="https://pic1.imgdb.cn/item/677cce3fd0e0a243d4f117de.jpg"
                />
              </a-col>
              <a-col :span="6">
                <a-image
                  :width="120"
                  src="https://pic1.imgdb.cn/item/677cce3ed0e0a243d4f117dd.jpg"
                />
              </a-col>
            </a-row>
            <a-row :gutter="8">
              <a-col :span="6">
                <a-image
                  :width="120"
                  src="https://pic1.imgdb.cn/item/677cce3ed0e0a243d4f117dc.jpg"
                />
              </a-col>
              <a-col :span="6">
                <a-image
                  :width="120"
                  src="https://pic1.imgdb.cn/item/677cce3ed0e0a243d4f117db.jpg"
                />
              </a-col>
              <a-col :span="6">
                <a-image
                  :width="120"
                  src="https://pic1.imgdb.cn/item/677cce36d0e0a243d4f117d9.jpg"
                />
              </a-col>
              <a-col :span="6">
                <a-image
                  :width="120"
                  src="https://pic1.imgdb.cn/item/677cce35d0e0a243d4f117d8.jpg"
                />
              </a-col>
            </a-row>
            <a-row :gutter="8">
              <a-col :span="6">
                <a-image
                  :width="120"
                  src="https://pic1.imgdb.cn/item/677cce35d0e0a243d4f117d7.jpg"
                />
              </a-col>
              <a-col :span="6">
                <a-image
                  :width="120"
                  src="https://pic1.imgdb.cn/item/677cce34d0e0a243d4f117d5.jpg"
                />
              </a-col>
              <a-col :span="6">
                <a-image
                  :width="120"
                  src="https://pic1.imgdb.cn/item/677cce34d0e0a243d4f117d5.jpg"
                />
              </a-col>
            </a-row>
          </div>
        </div>
        <div
          v-if="havepic == 2"
          style="height: 300px; margin-top: 2%; padding: 20px; background-color: #ececec"
        >
          <div style="margin-top: 10px">
            <a-row :gutter="8">
              <a-col :span="6">
                <a-image
                  :width="120"
                  src="https://pic1.imgdb.cn/item/6785280ad0e0a243d4f3fc2b.jpg"
                />
              </a-col>
              <a-col :span="6">
                <a-image
                  :width="120"
                  src="https://pic1.imgdb.cn/item/6785280ad0e0a243d4f3fc29.jpg"
                />
              </a-col>
              <a-col :span="6">
                <a-image
                  :width="120"
                  src="https://pic1.imgdb.cn/item/67851ab0d0e0a243d4f3f7b1.jpg"
                />
              </a-col>
              <a-col :span="6">
                <a-image
                  :width="120"
                  src="https://pic1.imgdb.cn/item/67851ab0d0e0a243d4f3f7b0.jpg"
                />
              </a-col>
            </a-row>
            <a-row :gutter="8">
              <a-col :span="6">
                <a-image
                  :width="120"
                  src="https://pic1.imgdb.cn/item/67851ab0d0e0a243d4f3f7af.jpg"
                />
              </a-col>
              <a-col :span="6">
                <a-image
                  :width="120"
                  src="https://pic1.imgdb.cn/item/67851aafd0e0a243d4f3f7ae.jpg"
                />
              </a-col>
              <a-col :span="6">
                <a-image
                  :width="120"
                  src="https://pic1.imgdb.cn/item/67851aafd0e0a243d4f3f7ad.jpg"
                />
              </a-col>
              <a-col :span="6">
                <a-image
                  :width="120"
                  src="https://pic1.imgdb.cn/item/67851a5bd0e0a243d4f3f799.jpg"
                />
              </a-col>
            </a-row>
            <a-row :gutter="8">
              <a-col :span="6">
                <a-image
                  :width="120"
                  src="https://pic1.imgdb.cn/item/67851a5ad0e0a243d4f3f796.jpg"
                />
              </a-col>
              <a-col :span="6">
                <a-image
                  :width="120"
                  src="https://pic1.imgdb.cn/item/67851a5ad0e0a243d4f3f797.jpg"
                />
              </a-col>
              <a-col :span="6">
                <a-image
                  :width="120"
                  src="https://pic1.imgdb.cn/item/67851a59d0e0a243d4f3f795.jpg"
                />
              </a-col>
              <a-col :span="6">
                <a-image
                  :width="120"
                  src="https://pic1.imgdb.cn/item/67851a5ad0e0a243d4f3f798.jpg"
                />
              </a-col>
            </a-row>
          </div>
        </div>
        <div
          v-if="havepic == 3"
          style="height: 300px; margin-top: 2%; padding: 20px; background-color: #ececec"
        >
          <div style="margin-top: 10px">
            <a-row :gutter="8">
              <a-col :span="6">
                <a-image
                  :width="120"
                  src="https://pic1.imgdb.cn/item/67852981d0e0a243d4f3fc6e.jpg"
                />
              </a-col>
              <a-col :span="6">
                <a-image
                  :width="120"
                  src="https://pic1.imgdb.cn/item/67852981d0e0a243d4f3fc6f.jpg"
                />
              </a-col>
              <a-col :span="6">
                <a-image
                  :width="120"
                  src="https://pic1.imgdb.cn/item/67852982d0e0a243d4f3fc70.jpg"
                />
              </a-col>
              <a-col :span="6">
                <a-image
                  :width="120"
                  src="https://pic1.imgdb.cn/item/67852982d0e0a243d4f3fc71.jpg"
                />
              </a-col>
            </a-row>
            <a-row :gutter="8">
              <a-col :span="6">
                <a-image
                  :width="120"
                  src="https://pic1.imgdb.cn/item/67852982d0e0a243d4f3fc72.jpg"
                />
              </a-col>
              <a-col :span="6">
                <a-image
                  :width="120"
                  src="https://pic1.imgdb.cn/item/6785298cd0e0a243d4f3fc74.jpg"
                />
              </a-col>
              <a-col :span="6">
                <a-image
                  :width="120"
                  src="https://pic1.imgdb.cn/item/6785298dd0e0a243d4f3fc75.jpg"
                />
              </a-col>
              <a-col :span="6">
                <a-image
                  :width="120"
                  src="https://pic1.imgdb.cn/item/6785298dd0e0a243d4f3fc76.jpg"
                />
              </a-col>
            </a-row>
            <a-row :gutter="8">
              <a-col :span="6">
                <a-image
                  :width="120"
                  src="https://pic1.imgdb.cn/item/6785298dd0e0a243d4f3fc77.jpg"
                />
              </a-col>
              <a-col :span="6">
                <a-image
                  :width="120"
                  src="https://pic1.imgdb.cn/item/6785298ed0e0a243d4f3fc78.jpg"
                />
              </a-col>
              <a-col :span="6">
                <a-image
                  :width="120"
                  src="https://pic1.imgdb.cn/item/67852997d0e0a243d4f3fc79.jpg"
                />
              </a-col>
            </a-row>
          </div>
        </div>
        <a-button type="primary" style="margin-top: 2%" @click="info">生成建模结果</a-button>
      </a-col>
      <a-col :span="12">
        <h1>建模结果预览</h1>

        <a-image
          v-if="haveres == 1"
          style="margin-top: 2%"
          :width="375"
          :height="300"
          src="https://pic1.imgdb.cn/item/677cc81dd0e0a243d4f113a0.png"
        />
        <a-image
          v-if="haveres == 2"
          style="margin-top: 2%"
          :width="375"
          :height="300"
          src="https://pic1.imgdb.cn/item/67853030d0e0a243d4f3fe1d.jpg"
        />
        <a-image
          v-if="haveres == 3"
          style="margin-top: 2%"
          :width="375"
          :height="300"
          src="https://pic1.imgdb.cn/item/67853030d0e0a243d4f3fe1e.jpg"
        />
        <div>
          <a-button v-if="haveres >= 1" style="margin-top: 2%" @click="open"
            >保存结果文件（.ply）</a-button
          ></div
        >
      </a-col>
    </a-row>
  </div>
</template>

<script>
  import axios from 'axios';
  import { message } from 'ant-design-vue';
  export default {
    name: 'VideoSearch',
    data() {
      return {
        value1: '1',
        havepic: 1,
        haveres: 0,
        streamlitUrl: '',
        isLoading: false,
        error: '',
        checkInterval: null,
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
      clickupload() {
        this.havepic = 2;
        setTimeout(() => {
          this.havepic = 3;
        }, 5000);
      },
      open() {
        window.open('/src/views/colmap/example/COLMAP_RESULT.ply', '_self');
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
