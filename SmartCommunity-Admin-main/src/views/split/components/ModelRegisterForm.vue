<template>
  <div class="register-form">
    <h3>模型注册</h3>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>模型ID</label>
        <input v-model="formData.model_id" type="text" required />
      </div>
      <div class="form-group">
        <label>版本号</label>
        <input v-model="formData.version" type="text" required />
      </div>
      <div class="form-group">
        <label>存储路径</label>
        <input v-model="formData.storage_path" type="text" required />
      </div>
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? '注册中...' : '注册模型' }}
      </button>
    </form>
  </div>
</template>

<script>
import { registerModel } from '@/api/backend/api/splitTab';

export default {
  name: 'ModelRegisterForm',
  data() {
    return {
      formData: {
        model_id: '',
        version: '',
        storage_path: ''
      },
      isLoading: false
    };
  },
  methods: {
    async handleSubmit() {
      this.isLoading = true;
      try {
        await registerModel(this.formData);
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
        model_id: '',
        version: '',
        storage_path: ''
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