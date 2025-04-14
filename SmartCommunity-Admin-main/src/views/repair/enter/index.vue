<template>
  <div class="repair-upload">
    <form class="form-container" @submit.prevent="submitRepairForm">
      <!-- 报修标题 -->
      <div class="form-group">
        <label for="repairIssueTitle">报修标题：</label>
        <input
          id="repairIssueTitle"
          v-model="repairForm.repairIssueTitle"
          placeholder="请输入报修标题"
          required
          class="input"
        />
      </div>

      <!-- 报修类型 -->
      <div class="form-group">
        <label for="repairIssueCategory">报修类型：</label>
        <select
          id="repairIssueCategory"
          v-model="repairForm.repairIssueCategory"
          required
          class="input"
        >
          <option value="" disabled>请选择报修类型</option>
          <option value="Plumbing">管道</option>
          <option value="Electrical">电器</option>
          <option value="Network">网络</option>
          <option value="Window">门窗</option>
          <option value="Elevator">电梯</option>
          <option value="Lighting">照明</option>
          <option value="Other">其他</option>
        </select>
      </div>

      <!-- 报修细节描述 -->
      <div class="form-group">
        <label for="repairIssueDetails">报修细节描述：</label>
        <textarea
          id="repairIssueDetails"
          v-model="repairForm.repairIssueDetails"
          placeholder="请输入详细描述"
          required
          class="input"
        />
      </div>

      <!-- 报修位置 -->
      <div class="form-group">
        <label for="repairAddress">报修位置：</label>
        <div class="location-group">
          <select id="repairAddress" v-model="repairForm.repairAddress" required class="input">
            <option value="" disabled>请选择建筑名称</option>
            <option value="惟新馆">惟新馆</option>
            <option value="友元10号楼">友元10号楼</option>
            <option value="济事楼">济事楼</option>
            <option value="体育中心">体育中心</option>
            <option value="图书馆">图书馆</option>
          </select>
          <input
            v-if="repairForm.repairAddress"
            v-model="repairForm.floor"
            placeholder="楼层"
            type="number"
            required
            class="input-inline"
          />
          <input
            v-if="repairForm.repairAddress"
            v-model="repairForm.roomNumber"
            placeholder="房间号"
            required
            class="input-inline"
          />
        </div>
      </div>

      <!-- 图片上传 -->
      <div class="form-group">
        <label>上传图片（最多1张）：</label>
        <input type="file" accept="image/*" @change="handleImageChange" />
        <div v-if="imagePreview" class="preview">
          <img :src="imagePreview" alt="图片预览" />
        </div>
      </div>

      <!-- 视频上传 -->
      <div class="form-group">
        <label>上传视频（最多1个）：</label>
        <input type="file" accept="video/*" @change="handleVideoChange" />
        <div v-if="videoPreview" class="preview">
          <video :src="videoPreview" controls />
        </div>
      </div>

      <!-- 提交按钮 -->
      <div class="form-group">
        <button type="submit" class="submit" :disabled="!validateForm()">提交报修</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, ref } from 'vue';

  export default defineComponent({
    name: 'NewRepairForm',
    setup() {
      const repairForm = reactive({
        residentID: 2,
        repairIssueTitle: '',
        repairIssueCategory: 'Plumbing',
        otherCategory: '',
        repairIssueDetails: '',
        repairAddress: '',
        floor: '',
        roomNumber: '',
      });

      const imageFile = ref<File | null>(null);
      const videoFile = ref<File | null>(null);
      const imagePreview = ref<string | null>(null);
      const videoPreview = ref<string | null>(null);

      // 处理图片上传
      const handleImageChange = (event: Event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          imageFile.value = file;
          imagePreview.value = URL.createObjectURL(file);
        }
      };

      // 处理视频上传
      const handleVideoChange = (event: Event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          videoFile.value = file;
          videoPreview.value = URL.createObjectURL(file);
        }
      };

      // 表单验证
      const validateForm = () => {
        return (
          repairForm.repairIssueTitle &&
          repairForm.repairIssueCategory &&
          repairForm.repairIssueDetails &&
          repairForm.repairAddress &&
          repairForm.floor &&
          repairForm.roomNumber
        );
      };

      // 提交表单
      const submitRepairForm = async () => {
        if (!validateForm()) {
          alert('请完整填写表单！');
          return;
        }

        const formData = new FormData();

        // 合并地址信息
        repairForm.repairAddress = `${repairForm.repairAddress} ${repairForm.floor}层 ${repairForm.roomNumber}`;

        // 添加表单数据
        formData.append('residentID', repairForm.residentID);
        formData.append('repairIssueTitle', repairForm.repairIssueTitle);
        formData.append('repairIssueCategory', repairForm.repairIssueCategory);
        formData.append('repairIssueDetails', repairForm.repairIssueDetails);
        formData.append('repairAddress', repairForm.repairAddress);

        // 添加文件
        if (imageFile.value) {
          formData.append('image', imageFile.value);
        }
        if (videoFile.value) {
          formData.append('video', videoFile.value);
        }

        try {
          const response = await fetch(
            'http://localhost:8080/api/repair-issues/uploadRepairIssue',
            {
              method: 'POST',
              body: formData,
            },
          );

          const result = await response.json();
          if (response.ok) {
            alert('提交成功！');
            // 刷新页面
            window.location.reload();
          } else {
            alert(`提交失败：${result.message}`);
          }
        } catch (error) {
          console.error('上传失败', error);
          alert('上传失败，请稍后再试。');
        }
      };

      return {
        repairForm,
        imageFile,
        videoFile,
        imagePreview,
        videoPreview,
        handleImageChange,
        handleVideoChange,
        submitRepairForm,
        validateForm,
      };
    },
  });
</script>

<style scoped>
  .repair-upload {
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background: #f9f9f9;
    font-family: Arial, sans-serif;
    font-size: 16px;
  }

  .form-container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 25px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  label {
    margin-bottom: 5px;
    padding-bottom: 10px;
    font-weight: bold;
  }

  .input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .input-inline {
    display: inline-block;
    width: calc(50% - 10px);
    margin-top: 5px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .location-group {
    display: flex;
    gap: 10px;
  }

  .button {
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    background: #007bff;
    color: white;
    cursor: pointer;
  }

  .button:hover {
    background: #0056b3;
  }

  .preview img,
  .preview video {
    max-width: 100%;
    margin-top: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .submit {
    padding: 10px;
    border: none;
    border-radius: 4px;
    background: #28a745;
    color: white;
    font-size: 16px;
    cursor: pointer;
  }

  .submit:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
</style>
