<template>
  <div class="device-management">
    <h3>设备管理</h3>
    <div class="tabs">
      <div class="tab-header">
        <div 
          class="tab-item" 
          :class="{ active: activeTab === 'register' }"
          @click="activeTab = 'register'"
        >
          注册设备
        </div>
        <div 
          class="tab-item" 
          :class="{ active: activeTab === 'list' }"
          @click="activeTab = 'list'"
        >
          已注册设备
        </div>
      </div>
      
      <div class="tab-content">
        <!-- 注册表单 Tab -->
        <div v-show="activeTab === 'register'" class="tab-pane">
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

        <!-- 设备列表 Tab -->
        <div v-show="activeTab === 'list'" class="tab-pane">
          <div v-if="loading" class="loading">加载中...</div>
          <div v-else-if="error" class="error">{{ error }}</div>
          <div v-else class="device-list">
            <div 
              v-for="device in deviceList" 
              :key="device.device_id"
              class="device-card"
            >
              <div class="device-info">
                <div class="device-id">设备ID：{{ device.device_id }}</div>
                <div class="device-status" :class="device.status">
                  {{ device.status }}
                </div>
              </div>
              <div class="card-btn-group">
                <button class="card-btn detail-btn" @click="showDetail(device)">
                  详情
                </button>
                <button class="card-btn delete-btn" @click="confirmDelete(device.device_id)">
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 详情弹窗 -->
     <div v-if="showDetailDevice" class="overlay">
      <div class="overlay-content">
        <h4>设备详情</h4>
        <p>设备ID：{{ selectedDevice.deviceId }}</p>
        <p>CPU信息：{{ selectedDevice.cpu }}</p>
        <p>GPU信息：{{ selectedDevice.gpu }}</p>
        <p>内存信息：{{ selectedDevice.ram }}</p>
        <p>访问地址：{{ selectedDevice.endpoint_url }}</p>
        <p>设备状态：{{ selectedDevice.status }}</p>
        <div class="overlay-actions">
          <button class="cancel-btn" @click="showDetailDevice = false">关闭</button>
        </div>
      </div>
     </div>

    <!-- 删除确认弹窗 -->
    <div v-if="showDeleteConfirm" class="overlay">
      <div class="overlay-content">
        <h4>确认删除</h4>
        <p>确定要删除此设备吗？此操作不可恢复。</p>
        <div class="overlay-actions">
          <button class="cancel-btn" @click="showDeleteConfirm = false">取消</button>
          <button class="confirm-btn" @click="handleDelete" :disabled="isDeleting">
            {{ isDeleting ? '删除中...' : '确认删除' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { registerDevice, queryDeviceList, deleteDevice } from '@/api/backend/api/splitTab';

export default {
  name: 'DeviceRegisterForm',
  data() {
    return {
      activeTab: 'register',
      formData: {
        device_id: '',
        cpu: '',
        gpu: '',
        ram: '',
        endpoint_url: ''
      },
      isLoading: false,
      loading: false,
      error: null,
      deviceList: [],
      showDetailDevice: false,
      selectedDevice: null,
      showDeleteConfirm: false,
      isDeleting: false,
      deviceToDelete: null
    };
  },
  watch: {
    activeTab(newTab) {
      if (newTab === 'list') {
        this.fetchDeviceList();
      }
    }
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
    async fetchDeviceList() {
      this.loading = true;
      this.error = null;
      try {
        const response = await queryDeviceList();
        this.deviceList = response.data;
      } catch (error) {
        this.error = '获取设备列表失败';
        console.error('获取设备列表失败:', error);
      } finally {
        this.loading = false;
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
    },
    showDetail(device){
      this.selectedDevice = device;
      this.showDetailDevice = true;
    },
    confirmDelete(deviceId) {
      this.deviceToDelete = deviceId;
      this.showDeleteConfirm = true;
    },
    async handleDelete() {
      if (!this.deviceToDelete) return;
      
      this.isDeleting = true;
      try {
        await deleteDevice({ device_id: this.deviceToDelete });
        this.$message.success('删除成功');
        this.showDeleteConfirm = false;
        this.deviceToDelete = null;
        // 重新加载列表
        await this.fetchDeviceList();
      } catch (error) {
        this.$message.error(error.response?.data?.message || '删除失败');
      } finally {
        this.isDeleting = false;
      }
    }
  }
};
</script>

<style scoped>
.device-management {
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

.device-list {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  gap: 12px;
  padding: 10px 0;
  max-height: 400px;
}

.device-card {
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

.device-info {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.device-id {
  color: #2c3e50;
  font-weight: 500;
}

.device-status {
  font-size: 0.9em;
  padding: 4px 8px;
  border-radius: 4px;
  text-align: center;
}

.device-status.active {
  background: #e8f5e9;
  color: #2e7d32;
}

.device-status.inactive {
  background: #ffebee;
  color: #c62828;
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
.overlay {
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

.overlay-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 300px;
  max-width: 90%;
}

.overlay-content h4 {
  margin: 0 0 15px 0;
  color: #2c3e50;
}

.overlay-content p {
  margin: 0 0 20px 0;
  color: #666;
}

.overlay-actions {
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
.device-list::-webkit-scrollbar {
  width: 6px;
}

.device-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.device-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.device-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style> 