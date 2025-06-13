<template>
  <div class="model-management">
    <h3>模型管理</h3>
    <div class="tabs">
      <div class="tab-header">
        <div 
          class="tab-item" 
          :class="{ active: activeTab === 'register' }"
          @click="activeTab = 'register'"
        >
          注册模型
        </div>
        <div 
          class="tab-item" 
          :class="{ active: activeTab === 'list' }"
          @click="activeTab = 'list'"
        >
          已注册模型
        </div>
      </div>
      
      <div class="tab-content">
        <!-- 注册表单 Tab -->
        <div v-show="activeTab === 'register'" class="tab-pane">
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

        <!-- 模型列表 Tab -->
        <div v-show="activeTab === 'list'" class="tab-pane">
          <div v-if="loading" class="loading">加载中...</div>
          <div v-else-if="error" class="error">{{ error }}</div>
          <div v-else class="model-list">
            <div 
              v-for="model in modelList" 
              :key="model.model_id"
              class="model-card"
            >
              <div class="model-id">模型ID：{{ model.model_id }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { registerModel, queryModelList } from '@/api/backend/api/splitTab';

export default {
  name: 'ModelRegisterForm',
  data() {
    return {
      activeTab: 'register',
      formData: {
        model_id: '',
        version: '',
        storage_path: ''
      },
      isLoading: false,
      loading: false,
      error: null,
      modelList: []
    };
  },
  watch: {
    activeTab(newTab) {
      if (newTab === 'list') {
        this.fetchModelList();
      }
    }
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
    async fetchModelList() {
      this.loading = true;
      this.error = null;
      try {
        const response = await queryModelList();
        this.modelList = response.data;
      } catch (error) {
        this.error = '获取模型列表失败';
        console.error('获取模型列表失败:', error);
      } finally {
        this.loading = false;
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
.model-management {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tabs {
  margin-top: 20px;
}

.tab-header {
  display: flex;
  border-bottom: 2px solid #eee;
  margin-bottom: 20px;
}

.tab-item {
  padding: 10px 20px;
  cursor: pointer;
  color: #666;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: all 0.3s;
}

.tab-item.active {
  color: #3498db;
  border-bottom-color: #3498db;
}

.tab-content {
  min-height: 200px;
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

.model-list {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  gap: 12px;
  padding: 10px 0;
  max-height: 400px;
}

.model-card {
  width: 100%;
  padding: 12px 20px;
  background: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid #eee;
}

.model-id {
  color: #2c3e50;
  font-weight: 500;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #666;
}

.error {
  text-align: center;
  padding: 20px;
  color: #e74c3c;
}

/* 自定义滚动条样式 */
.model-list::-webkit-scrollbar {
  width: 6px;
}

.model-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.model-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.model-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style> 