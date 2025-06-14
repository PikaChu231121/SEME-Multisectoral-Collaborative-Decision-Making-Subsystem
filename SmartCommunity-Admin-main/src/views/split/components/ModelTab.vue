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
        <div class="tab-item" :class="{ active: activeTab === 'list' }" @click="activeTab = 'list'">
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
            <div v-for="model in modelList" :key="model.model_id">
              <div class="model-card">
                <div class="model-header">
                  <div class="toggle-icon" @click="toggleDetails(model)">
                    <RightOutlined :rotate="isExpanded(model.model_id) ? 90 : 0" />
                  </div>
                  <div class="model-info">
                    <div class="model-id">模型ID：{{ model.model_id }}</div>
                  </div>
                  <div class="card-btn-group">
                    <button class="card-btn update-btn" @click="showUpdate(model)"> 更新 </button>
                    <button class="card-btn delete-btn" @click="confirmDelete(model.model_id)">
                      删除
                    </button>
                  </div>
                </div>
                <div v-if="isExpanded(model.model_id)" class="model-detail-row">
                  <p>版本号：{{ model.version }}</p>
                  <p>存储路径：{{ model.storage_path }}</p>
                  <p>上传时间：{{ model.upload_time }}</p>
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

    <!-- 删除确认弹窗 -->
    <div v-if="showDeleteConfirm" class="alert-window">
      <div class="alert-content">
        <h4>确认删除</h4>
        <p>确定要删除此模型吗？此操作不可恢复。</p>
        <div class="alert-actions">
          <button class="cancel-btn" @click="showDeleteConfirm = false">取消</button>
          <button class="confirm-btn" :disabled="isDeleting" @click="handleDelete">
            {{ isDeleting ? '删除中...' : '确认删除' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { RightOutlined } from '@ant-design/icons-vue';
  import {
    registerModel,
    queryModelList,
    deleteModel,
    updateModel,
  } from '@/api/backend/api/splitTab';

  export default {
    name: 'ModelRegisterForm',
    components: { RightOutlined },
    data() {
      return {
        activeTab: 'register',
        formData: {
          model_id: '',
          version: '',
          storage_path: '',
        },
        updateForm: {
          version: '',
          storage_path: '',
        },
        isLoading: false,
        isUpdating: false,
        loading: false,
        error: null,
        modelList: [],
        expandedModelIds: [],
        showDetailModal: false,
        showUpdateModal: false,
        selectedModel: null,
        showDeleteConfirm: false,
        isDeleting: false,
        modelToDelete: null,
      };
    },
    watch: {
      activeTab(newTab) {
        if (newTab === 'list') {
          this.fetchModelList();
        }
      },
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
          storage_path: '',
        };
      },
      toggleDetails(model) {
        const idx = this.expandedModelIds.indexOf(model.model_id);
        if (idx >= 0) {
          this.expandedModelIds.splice(idx, 1);
        } else {
          this.expandedModelIds.push(model.model_id);
        }
      },
      isExpanded(model_id) {
        return this.expandedModelIds.includes(model_id);
      },
      confirmDelete(modelId) {
        this.modelToDelete = modelId;
        this.showDeleteConfirm = true;
      },
      async handleDelete() {
        if (!this.modelToDelete) return;

        this.isDeleting = true;
        try {
          await deleteModel({ model_id: this.modelToDelete });
          this.$message.success('删除成功');
          this.showDeleteConfirm = false;
          this.modelToDelete = null;
          await this.fetchModelList();
        } catch (error) {
          this.$message.error(error.response?.data?.message || '删除失败');
        } finally {
          this.isDeleting = false;
        }
      },
      showUpdate(model) {
        this.selectedModel = model;
        this.updateForm = {
          version: model.version,
          storage_path: model.storage_path,
        };
        this.showUpdateModal = true;
      },
      async handleUpdate() {
        if (!this.selectedModel) return;

        this.isUpdating = true;
        try {
          await updateModel({
            model_id: this.selectedModel.model_id,
            ...this.updateForm,
          });
          this.$message.success('更新成功');
          this.showUpdateModal = false;
          await this.fetchModelList();
        } catch (error) {
          this.$message.error(error.response?.data?.message || '更新失败');
        } finally {
          this.isUpdating = false;
        }
      },
    },
  };
</script>

<style scoped>
  .model-management {
    padding: 20px;
    border-radius: 8px;
    background: white;
    box-shadow: 0 2px 4px rgb(0 0 0 / 10%);
  }

  .tabs {
    margin-top: 20px;
  }

  .tab-header {
    display: flex;
    margin-bottom: 20px;
    border-bottom: 2px solid #eee;
  }

  .tab-item {
    margin-bottom: -2px;
    padding: 10px 20px;
    transition: all 0.3s;
    border-bottom: 2px solid transparent;
    color: #666;
    cursor: pointer;
  }

  .tab-item.active {
    border-bottom-color: #3498db;
    color: #3498db;
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
    border: none;
    border-radius: 4px;
    background: #3498db;
    color: white;
    cursor: pointer;
  }

  button:disabled {
    background: #95a5a6;
    cursor: not-allowed;
  }

  .model-list {
    display: flex;
    flex-direction: column;
    max-height: 60vh;
    padding: 10px 0;
    overflow-y: auto;
    gap: 12px;
  }

  .model-card {
    border: 1px solid #eee;
    border-radius: 12px;
    background: #fbfcfd;
    box-shadow: 0 2px 4px rgb(0 0 0 / 5%);
  }

  .model-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 12px 20px;
    background: #f8f9fa;
    box-shadow: 0 2px 4px rgb(0 0 0 / 5%);
  }

  .toggle-icon {
    margin-right: 10px;
    cursor: pointer;
  }

  .model-info {
    display: flex;
    flex: 1;
    align-items: center;
    gap: 16px;
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

  .detail-overlay {
    display: flex;
    position: fixed;
    z-index: 1000;
    align-items: center;
    justify-content: center;
    background: rgb(0 0 0 / 50%);
    inset: 0;
  }

  .overlay-content {
    width: 25%;
    min-width: 300px;
    max-width: 500px;
    padding: 20px;
    border-radius: 8px;
    background: white;
    box-shadow: 0 4px 12px rgb(0 0 0 / 15%);
  }

  /* 模型详情展开行 */
  .model-detail-row {
    margin-top: 5px;
    padding: 10px 20px;
    border-radius: 0 0 8px 8px;
  }

  .loading {
    padding: 20px;
    color: #666;
    text-align: center;
  }

  .error {
    padding: 20px;
    color: #e74c3c;
    text-align: center;
  }

  /* 弹窗样式 */
  .detail-overlay {
    display: flex;
    position: fixed; /* 固定定位，覆盖整个页面 */
    z-index: 1000; /* 确保在最上层 */
    inset: 0;
    align-items: center; /* 垂直居中 */
    justify-content: center; /* 水平居中 */
    background: rgb(0 0 0 / 50%); /* 半透明黑色遮罩 */
  }

  .overlay-content {
    width: 25%; /* 宽度占页面的 1/4 */
    min-width: 300px; /* 最小宽度，防止在小屏幕上太小 */
    max-width: 500px; /* 最大宽度，防止在大屏幕上太宽 */
    padding: 20px;
    border-radius: 8px; /* 圆角 */
    background: white;
    box-shadow: 0 4px 12px rgb(0 0 0 / 15%); /* 阴影增强立体感 */
  }

  .overlay-content h4 {
    margin-top: 0;
    margin-bottom: 16px; /* 标题与内容间距 */
    color: #333;
    font-size: 1.2em;
  }

  .overlay-content p {
    margin: 12px 0; /* 上下间距 12px，左右 0 */
    color: #555;
    line-height: 1.5; /* 行高 1.5 倍，提高可读性 */
    text-align: left; /* 左对齐 */
  }

  .overlay-actions {
    display: flex;
    justify-content: flex-end; /* 按钮靠右 */
    margin-top: 20px; /* 操作按钮与上方内容的间距 */
    gap: 5px;
  }

  .cancel-btn {
    padding: 8px 16px;
    transition: background 0.2s;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: #f0f0f0;
    cursor: pointer;
  }

  .cancel-btn:hover {
    background: #e0e0e0; /* 悬停效果 */
  }

  .alert-window {
    display: flex;
    position: fixed;
    z-index: 1000;
    inset: 0;
    align-items: center;
    justify-content: center;
    background: rgb(0 0 0 / 50%);
  }

  .alert-content {
    min-width: 300px;
    max-width: 90%;
    padding: 20px;
    border-radius: 8px;
    background: white;
  }

  .alert-content h4 {
    margin: 0 0 15px;
    color: #2c3e50;
  }

  .alert-content p {
    margin: 0 0 20px;
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
    border-radius: 3px;
    background: #f1f1f1;
  }

  .model-list::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background: #c1c1c1;
  }

  .model-list::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
</style>
