<template>
  <div class="chat-container">
    <!-- 文件上传组件 -->
    <div class="upload-section">
      <a-upload
        v-model:file-list="fileList"
        list-type="picture-card"
        :before-upload="beforeUpload"
        :max-count="1"
        @change="handleImageChange"
        @remove="removePic"
      >
        <div v-if="fileList.length < 1">
          <a-icon type="plus" />
          <div class="ant-upload-text">上传图片</div>
        </div>
      </a-upload>
    </div>

    <!-- 聊天输入框 -->
    <div class="chat-input">
      <div
        ref="inputDiv"
        class="input"
        contenteditable="true"
        @input="handleInput"
        @keydown.enter.prevent="handleSend"
      />
      <a-button :disabled="!input" type="primary" @click="handleSend">
        <span class="arrow">&#8593;</span>
      </a-button>
    </div>
  </div>
</template>

<script>
  import { defineComponent, ref } from 'vue';
  import { message } from 'ant-design-vue';

  export default defineComponent({
    name: 'ChatInput',
    emits: ['sendMessage', 'sendImage'],
    setup(props, { emit }) {
      const input = ref('');
      const inputDiv = ref(null);
      const fileList = ref([]);
      const fileSend = ref('');

      // 处理输入内容
      const handleInput = (event) => {
        const target = event.target;
        input.value = target.innerText;
      };

      // 处理发送消息
      const handleSend = () => {
        if (input.value.trim()) {
          emit('sendMessage', input.value, fileSend.value);
          input.value = '';
          if (inputDiv.value) {
            inputDiv.value.innerText = '';
          }
        }
      };

      // 处理图片上传变化
      const handleImageChange = ({ fileList: newFileList }) => {
        fileList.value = newFileList;
        if (newFileList.length > 1) {
          message.warning('只允许上传一张图片');
          fileList.value = [newFileList[0]]; // 保留第一张图片
        }
      };
      const baseUrl = ref(import.meta.env.VITE_BASE_API_URL);
      if (baseUrl.value.endsWith(':8080')) {
        baseUrl.value = baseUrl.value.slice(0, -5); // 删除最后 5 个字符（":8080" 的长度）
      }
      // 自定义上传方法
      const beforeUpload = async (file) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
          message.error('只能上传图片文件！');
          return false;
        }

        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('图片大小不能超过 2MB！');
          return false;
        }
        const isValid = await checkImageSize(file);
        if (!isValid) return;
        const formData = new FormData();
        formData.append('file', file);
        // 模拟上传
        fetch(baseUrl.value + ':8080/OSS/api/upload', {
          method: 'POST',
          body: formData,
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error('图片上传失败');
            }
          })
          .then((res) => {
            console.log(res['fileUrl']);
            message.success('图片上传成功');
            fileSend.value = res['fileUrl']; // 假设返回的 URL 在 result.url 中
          })
          .catch((error) => {
            console.error('上传失败:', error);
            message.error('图片上传失败');
          });

        return false; // 阻止默认上传行为
      };
      const readFile = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      };

      // 将 Image 加载包装成 Promise
      const loadImage = (src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });
      };
      async function checkImageSize(file) {
        try {
          const dataUrl = await readFile(file); // 阻塞直到读取完成
          const img = await loadImage(dataUrl); // 阻塞直到图片加载完成

          if (img.width > 1000 || img.height > 1000) {
            message.error('上传图片分辨率不建议超过1000*1000！');
            return false;
          }
          return true;
        } catch (error) {
          message.error('图片加载失败');
          return false;
        }
      }
      const removePic = (file) => {
        fileSend.value = '';
      };

      return {
        input,
        inputDiv,
        fileList,
        handleInput,
        handleSend,
        handleImageChange,
        beforeUpload,
        removePic,
      };
    },
  });
</script>

<style scoped>
  .chat-container {
    display: flex;
    flex-direction: column;
    max-width: 100%;
    margin: 0 auto;
    padding: 20px;
    border-radius: 8px;
    background-color: #f5f5f5;
    box-shadow: 0 4px 6px rgb(0 0 0 / 10%);
    gap: 20px; /* 上下分布时的间距 */
  }

  .upload-section {
    display: flex;
    justify-content: center; /* 居中上传组件 */
  }

  .chat-input {
    display: flex;
    align-items: center;
    width: 100%; /* 宽度与 chat-container 保持一致 */
    gap: 10px; /* 输入框和按钮之间的间距 */
  }

  .input {
    flex: 1; /* 输入框占据剩余空间 */
    min-height: 80px; /* 调整输入框高度 */
    max-height: 200px;
    padding: 10px;
    overflow-y: auto;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    outline: none;
    background-color: #fff;
    color: #333;
    line-height: 1.5;
  }

  .input:focus {
    border-color: #40a9ff;
  }

  button {
    height: 40px; /* 按钮高度 */
    padding: 0 20px; /* 按钮内边距 */
  }

  .arrow {
    font-size: 16px;
    font-weight: bold;
  }
</style>
