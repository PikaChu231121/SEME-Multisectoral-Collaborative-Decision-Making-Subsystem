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
              <div class="model-info">
                <div class="model-id">模型ID：{{ model.model_id }}</div>
              </div>
              <div class="card-btn-group">
                <button class="card-btn update-btn" @click="showUpdate(model)">
                  更新
                </button>
                <button class="card-btn detail-btn" @click="showDetail(model)">
                  详情
                </button>
                <button class="card-btn delete-btn" @click="confirmDelete(model.model_id)">
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 更新弹窗 -->
  <div v-if="showUpdateModal" class="detail-overlay">
    <div class="overlay-content">
      <h4>更新模型</h4>
      <form @submit.prevent="handleUpdate">
        <div class="form-group">
          <label>版本号</label>
          <input v-model="updateForm.version" type="text" required />
        </div>
        <div class="form-group">
          <label>存储路径</label>
          <input v-model="updateForm.storage_path" type="text" required />
        </div>
        <div class="overlay-actions">
          <button type="button" class="cancel-btn" @click="showUpdateModal = false">返回</button>
          <button type="submit" class="confirm-btn" :disabled="isUpdating">
            {{ isUpdating ? '更新中...' : '提交更新' }}
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- 详情弹窗 -->
  <div v-if="showDetailModal" class="detail-overlay">
    <div class="overlay-content">
      <h4>模型详情</h4>
      <p>模型ID：{{ selectedModel.model_id }}</p>
      <p>版本号：{{ selectedModel.version }}</p>
      <p>存储路径：{{ selectedModel.storage_path }}</p>
      <div class="overlay-actions">
        <button class="cancel-btn" @click="showDetailModal = false">关闭</button>
      </div>
    </div>
  </div>

  <!-- 删除确认弹窗 -->
  <div v-if="showDeleteConfirm" class="alert-window">
    <div class="alert-content">
      <h4>确认删除</h4>
      <p>确定要删除此模型吗？此操作不可恢复。</p>
      <div class="alert-actions">
        <button class="cancel-btn" @click="showDeleteConfirm = false">取消</button>
        <button class="confirm-btn" @click="handleDelete" :disabled="isDeleting">
          {{ isDeleting ? '删除中...' : '确认删除' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { registerModel, queryModelList, deleteModel, updateModel } from '@/api/backend/api/splitTab';

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
      updateForm: {
        version: '',
        storage_path: ''
      },
      isLoading: false,
      isUpdating: false,
      loading: false,
      error: null,
      modelList: [],
      showDetailModal: false,
      showUpdateModal: false,
      selectedModel: null,
      showDeleteConfirm: false,
      isDeleting: false,
      modelToDelete: null
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
    // 提交注册表单
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
    // 查询模型列表
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
    // 清空表单
    resetForm() {
      this.formData = {
        model_id: '',
        version: '',
        storage_path: ''
      };
    },
    // 详细信息
    showDetail(model) {
      this.selectedModel = model;
      this.showDetailModal = true;
    },
    // 删除确认提示
    confirmDelete(modelId) {
      this.modelToDelete = modelId;
      this.showDeleteConfirm = true;
    },
    // 删除模型
    async handleDelete() {
      if (!this.modelToDelete) return;

      this.isDeleting = true;
      try {
        await deleteModel({ model_id: this.modelToDelete });
        this.$message.success('删除成功');
        this.showDeleteConfirm = false;
        this.modelToDelete = null;
        // 重新加载列表
        await this.fetchModelList();
      } catch (error) {
        this.$message.error(error.response?.data?.message || '删除失败');
      } finally {
        this.isDeleting = false;
      }
    },
    // 填写更新前信息
    showUpdate(model) {
      this.selectedModel = model;
      this.updateForm = {
        version: model.version,
        storage_path: model.storage_path
      };
      this.showUpdateModal = true;
    },
    // 提交更新
    async handleUpdate() {
      if (!this.selectedModel) return;
      
      this.isUpdating = true;
      try {
        await updateModel({
          model_id: this.selectedModel.model_id,
          ...this.updateForm
        });
        this.$message.success('更新成功');
        this.showUpdateModal = false;
        // 重新加载列表
        await this.fetchModelList();
      } catch (error) {
        this.$message.error(error.response?.data?.message || '更新失败');
      } finally {
        this.isUpdating = false;
      }
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.model-info {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.model-id {
  color: #2c3e50;
  font-weight: 500;
}

.card-btn-group {
  display: flex;
  gap: 10px;
}

.card-btn {
  padding: 6px 12px;
  font-size: 0.9em;
}

.detail-btn {
  background: #2ecc71;
}

.detail-btn:hover {
  background: #27ae60;
}

.delete-btn {
  background: #e74c3c;
}

.delete-btn:hover {
  background: #c0392b;
}

.update-btn {
  background: #3498db;
}

.update-btn:hover {
  background: #2980b9;
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

/* 弹窗样式 */
.detail-overlay {
  position: fixed;  /* 固定定位，覆盖整个页面 */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);  /* 半透明黑色遮罩 */
  display: flex;
  justify-content: center;  /* 水平居中 */
  align-items: center;     /* 垂直居中 */
  z-index: 1000;           /* 确保在最上层 */
}

.overlay-content {
  width: 25%;              /* 宽度占页面的 1/4 */
  min-width: 300px;        /* 最小宽度，防止在小屏幕上太小 */
  max-width: 500px;        /* 最大宽度，防止在大屏幕上太宽 */
  background: white;
  border-radius: 8px;      /* 圆角 */
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);  /* 阴影增强立体感 */
}

.overlay-content h4 {
  margin-top: 0;
  margin-bottom: 16px;     /* 标题与内容间距 */
  color: #333;
  font-size: 1.2em;
}

.overlay-content p {
  margin: 12px 0;         /* 上下间距 12px，左右 0 */
  line-height: 1.5;       /* 行高 1.5 倍，提高可读性 */
  color: #555;
  text-align: left;       /* 左对齐 */
}

.overlay-actions {
  margin-top: 20px;       /* 操作按钮与上方内容的间距 */
  display: flex;
  gap: 5px;
  justify-content: flex-end;  /* 按钮靠右 */
}

.cancel-btn {
  padding: 8px 16px;
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.cancel-btn:hover {
  background: #e0e0e0;    /* 悬停效果 */
}

.alert-window {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.alert-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 300px;
  max-width: 90%;
}

.alert-content h4 {
  margin: 0 0 15px 0;
  color: #2c3e50;
}

.alert-content p {
  margin: 0 0 20px 0;
  color: #666;
}

.alert-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-btn {
  background: #95a5a6;
}

.confirm-btn {
  background: #e74c3c;
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