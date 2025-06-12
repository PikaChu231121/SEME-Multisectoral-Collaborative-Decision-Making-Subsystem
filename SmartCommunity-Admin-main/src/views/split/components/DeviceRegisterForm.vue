<template>
  <div class="register-form">
    <h3>设备注册</h3>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>设备ID</label>
        <input v-model="formData.device_id" type="text" required />
      </div>
      <div class="form-group">
        <label>CPU信息</label>
        <input v-model="formData.cpu" type="text" required />
      </div>
      <div class="form-group">
        <label>GPU信息</label>
        <input v-model="formData.gpu" type="text" required />
      </div>
      <div class="form-group">
        <label>内存信息</label>
        <input v-model="formData.ram" type="text" required />
      </div>
      <div class="form-group">
        <label>访问地址</label>
        <input v-model="formData.endpoint_url" type="text" required />
      </div>
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? '注册中...' : '注册设备' }}
      </button>
    </form>
  </div>
</template>

<script>
import { registerDevice } from '@/api/backend/api/splitTab';

export default {
  name: 'DeviceRegisterForm',
  data() {
    return {
      formData: {
        device_id: '',
        cpu: '',
        gpu: '',
        ram: '',
        endpoint_url: ''
      },
      isLoading: false
    };
  },
  methods: {
    async handleSubmit() {
      this.isLoading = true;
      try {
        await registerDevice(this.formData);
        this.$emit('success');
        this.resetForm();
      } catch (error) {
        this.$emit('error', error.response?.data?.message || '注册失败');
      } finally {
        this.isLoading = false;
      }
    },
    resetForm() {
      this.formData = {
        device_id: '',
        cpu: '',
        gpu: '',
        ram: '',
        endpoint_url: ''
      };
    }
  }
};
</script>

<style scoped>
.register-form {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #2c3e50;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background: #95a5a6;
  cursor: not-allowed;
}
</style> 