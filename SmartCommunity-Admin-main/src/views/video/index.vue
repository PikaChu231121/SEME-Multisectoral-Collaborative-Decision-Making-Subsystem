<template>
  <div id="app">
    <section class="embed-video-section">
      <h2>上传视频</h2>
      <form @submit.prevent="handleVideoUpload">
        <div class="form-group">
          <label for="video">选择视频文件:</label>
          <input id="video" type="file" accept="video/*" required @change="handleVideoFile" />
        </div>
        <button type="submit" :disabled="!selectedVideo">上传视频</button>
      </form>

      <div v-if="videoUploadStatus">
        <p>{{ videoUploadStatus }}</p>
      </div>
    </section>

    <hr />

    <!-- 搜索视频部分 -->
    <section class="search-section">
      <h2>搜索视频</h2>
      <form @submit.prevent="handleSearch">
        <div class="form-group">
          <label for="query">文本查询:</label>
          <input id="query" v-model="searchQuery" type="text" placeholder="输入文本查询" required />
        </div>
        <div class="form-group">
          <label for="k">返回视频个数:</label>
          <select id="k" v-model.number="searchK">
            <option v-for="num in kOptions" :key="num" :value="num">
              {{ num }}
            </option>
          </select>
        </div>
        <button type="submit">搜索</button>
      </form>

      <div v-if="searchResults.length" class="results">
        <h3>搜索结果 (Top {{ searchK }}):</h3>
        <ul>
          <li v-for="(result, index) in searchResults" :key="index" class="result-item">
            <strong>视频:</strong> {{ result.video }} <br />
            <strong>相似度:</strong> {{ result.similarity.toFixed(4) }}
            <div class="video-player">
              <video :src="result.videoUrl" controls width="600">
                您的浏览器不支持 video 标签。
              </video>
            </div>
          </li>
        </ul>
      </div>
      <div v-else-if="searchStatus">
        <p>{{ searchStatus }}</p>
      </div>
    </section>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'App',
    data() {
      return {
        // 搜索视频
        searchQuery: '',
        searchK: 1,
        kOptions: [1, 3, 5, 10],
        searchResults: [],
        searchStatus: '',

        // 上传视频
        selectedVideo: null,
        videoUploadStatus: '',
      };
    },
    created() {
      axios.defaults.baseURL = 'http://121.5.16.33:8080'; // 根据实际情况修改
      // axios.defaults.baseURL = 'http://localhost:8080';
    },
    methods: {
      async handleSearch() {
        this.searchResults = [];
        this.searchStatus = '正在搜索...';
        try {
          const response = await axios.post('/Video/search', {
            text: this.searchQuery,
            k: this.searchK,
          });
          if (response.data && response.data.results) {
            this.searchResults = response.data.results;
            this.searchStatus = '';
          } else {
            this.searchStatus = '未找到搜索结果。';
          }
        } catch (error) {
          console.error(error);
          this.searchStatus = `搜索失败: ${error.response?.data?.error || error.message}`;
        }
      },

      handleVideoFile(event) {
        const file = event.target.files[0];
        if (file) {
          this.selectedVideo = file;
        } else {
          this.selectedVideo = null;
        }
      },

      async handleVideoUpload() {
        if (!this.selectedVideo) {
          this.videoUploadStatus = '请先选择一个视频文件。';
          return;
        }

        this.videoUploadStatus = '正在上传并处理视频...';

        const formData = new FormData();
        formData.append('video', this.selectedVideo);

        try {
          const response = await axios.post('/Video/upload/video', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          if (response.data && response.data.status === 'success') {
            this.videoUploadStatus = '视频上传并处理完成。';
          } else {
            this.videoUploadStatus = '视频上传失败。';
          }
        } catch (error) {
          console.error(error);
          this.videoUploadStatus = `视频上传失败: ${error.response?.data?.error || error.message}`;
        }
      },
    },
  };
</script>

<style scoped>
  #app {
    max-width: 800px;
    margin: auto;
    padding: 20px;
    font-family: Avenir, Helvetica, Arial, sans-serif;
  }

  h1 {
    margin-bottom: 40px;
    text-align: center;
  }

  section {
    margin-bottom: 40px;
  }

  .form-group {
    margin-bottom: 15px;
  }

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }

  input[type='text'],
  textarea,
  select {
    box-sizing: border-box;
    width: 100%;
    padding: 8px;
  }

  button {
    padding: 10px 20px;
    border: none;
    background-color: #42b983;
    color: white;
    cursor: pointer;
  }

  button:disabled {
    background-color: #a5d6a7;
    cursor: not-allowed;
  }

  button:hover:not(:disabled) {
    background-color: #369870;
  }

  .results ul {
    padding: 0;
    list-style-type: none;
  }

  .results li {
    margin-bottom: 20px;
    padding: 10px;
    border-radius: 5px;
    background-color: #f9f9f9;
  }

  .video-player {
    margin-top: 10px;
  }

  .embedding-result textarea {
    box-sizing: border-box;
    width: 100%;
    padding: 10px;
    resize: vertical;
  }
</style>
