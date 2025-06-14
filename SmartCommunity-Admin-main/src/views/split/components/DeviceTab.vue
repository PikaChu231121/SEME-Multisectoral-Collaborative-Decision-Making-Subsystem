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
        <div class="tab-item" :class="{ active: activeTab === 'list' }" @click="activeTab = 'list'">
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
              <label>设备类型</label>
              <select v-model="formData.device_type" required>
                <option value="" disabled>请选择设备类型</option>
                <option value="edge">边缘设备</option>
                <option value="server">服务器</option>
              </select>
            </div>
            <div class="form-group">
              <label>CPU</label>
              <input v-model="formData.cpu" type="text" required />
            </div>
            <div class="form-group">
              <label>GPU</label>
              <input v-model="formData.gpu" type="text" required />
            </div>
            <div class="form-group">
              <label>内存</label>
              <input v-model="formData.ram" type="text" required />
            </div>
            <div class="form-group">
              <label>分割学习端口URL</label>
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
            <div v-for="device in deviceList" :key="device.device_id">
              <div class="device-card">
                <div class="device-header">
                  <div class="toggle-icon" @click="toggleDetails(device)">
                    <RightOutlined :rotate="isExpanded(device.device_id) ? 90 : 0" />
                  </div>
                  <div class="device-main">
                    <span class="device-id">设备ID：{{ device.device_id }}</span>
                    <span
                      class="status-circle"
                      :class="device.status === 'online' ? 'online' : 'offline'"
                    />
                    <span class="device-icon">
                      <component
                        :is="
                          device.device_type === 'edge' ? 'MobileOutlined' : 'CloudServerOutlined'
                        "
                      />
                    </span>
                  </div>
                  <div class="action-buttons">
                    <button class="card-btn update-btn" @click="showUpdate(device)">更新</button>
                    <button class="card-btn delete-btn" @click="confirmDelete(device.device_id)"
                      >删除</button
                    >
                  </div>
                </div>
                <div v-if="isExpanded(device.device_id)" class="device-detail-row">
                  <p>设备类型：{{ device.device_type === 'edge' ? '边缘设备' : '服务器' }}</p>
                  <p>CPU：{{ device.cpu }}</p>
                  <p>GPU：{{ device.gpu }}</p>
                  <p>内存：{{ device.ram }}</p>
                  <p>分割学习端口URL：{{ device.endpoint_url }}</p>
                  <p>状态：{{ device.status === 'online' ? '在线' : '离线' }}</p>
                  <p>注册时间：{{ device.create_time }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 更新弹窗 -->
    <div v-if="showUpdateDevice" class="detail-overlay">
      <div class="overlay-content">
        <h4>更新设备</h4>
        <form @submit.prevent="handleUpdate">
          <div class="form-group">
            <label>设备ID</label>
            <input v-model="updateForm.device_id" type="text" required disabled />
          </div>
          <div class="form-group">
            <label>设备类型</label>
            <select v-model="updateForm.device_type" required>
              <option value="" disabled>请选择设备类型</option>
              <option value="edge">边缘设备</option>
              <option value="server">服务器</option>
            </select>
          </div>
          <div class="form-group">
            <label>CPU</label>
            <input v-model="updateForm.cpu" type="text" required />
          </div>
          <div class="form-group">
            <label>GPU</label>
            <input v-model="updateForm.gpu" type="text" required />
          </div>
          <div class="form-group">
            <label>内存</label>
            <input v-model="updateForm.ram" type="text" required />
          </div>
          <div class="form-group">
            <label>分割学习端口URL</label>
            <input v-model="updateForm.endpoint_url" type="text" required />
          </div>
          <div class="form-group">
            <label>设备状态</label>
            <select v-model="updateForm.status" required>
              <option value="" disabled>请选择状态</option>
              <option value="online">在线</option>
              <option value="offline">离线</option>
            </select>
          </div>
          <div class="overlay-actions">
            <button type="button" class="cancel-btn" @click="showUpdateDevice = false">返回</button>
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
        <p>确定要删除此设备吗？此操作不可恢复。</p>
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
  import { RightOutlined, MobileOutlined, CloudServerOutlined } from '@ant-design/icons-vue';
  import {
    registerDevice,
    queryDeviceList,
    deleteDevice,
    updateDevice,
  } from '@/api/backend/api/splitTab';

  export default {
    name: 'DeviceRegisterForm',
    components: { RightOutlined, MobileOutlined, CloudServerOutlined },
    data() {
      return {
        activeTab: 'register',
        formData: {
          device_id: '',
          device_type: '',
          cpu: '',
          gpu: '',
          ram: '',
          endpoint_url: '',
        },
        updateForm: {
          device_id: '',
          device_type: '',
          cpu: '',
          gpu: '',
          ram: '',
          endpoint_url: '',
          status: '',
        },
        isLoading: false,
        isUpdating: false,
        loading: false,
        error: null,
        deviceList: [],
        expandedDeviceIds: [],
        showUpdateDevice: false,
        showDeleteConfirm: false,
        isDeleting: false,
        deviceToDelete: null,
      };
    },
    watch: {
      activeTab(newTab) {
        if (newTab === 'list') {
          this.fetchDeviceList();
        }
      },
    },
    methods: {
      async handleSubmit() {
        this.isLoading = true;
        try {
          await registerDevice(this.formData);
          this.$emit('success');
          this.resetForm();
        } catch (error) {
          this.$emit('error', '注册失败：' + (error.response?.data?.message || '注册错误'));
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
          device_type: '',
          cpu: '',
          gpu: '',
          ram: '',
          endpoint_url: '',
        };
      },
      toggleDetails(device) {
        const idx = this.expandedDeviceIds.indexOf(device.device_id);
        if (idx >= 0) {
          this.expandedDeviceIds.splice(idx, 1);
        } else {
          this.expandedDeviceIds.push(device.device_id);
        }
      },
      isExpanded(device_id) {
        return this.expandedDeviceIds.includes(device_id);
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
          await this.fetchDeviceList();
        } catch (error) {
          this.$emit('error', '删除失败：' + (error.response?.data?.message || '删除错误'));
        } finally {
          this.isDeleting = false;
        }
      },
      showUpdate(device) {
        this.updateForm = {
          device_id: device.device_id,
          device_type: device.device_type,
          cpu: device.cpu,
          gpu: device.gpu,
          ram: device.ram,
          endpoint_url: device.endpoint_url,
          status: device.status,
        };
        this.showUpdateDevice = true;
      },
      async handleUpdate() {
        if (!this.updateForm.device_id) return;
        this.isUpdating = true;
        try {
          await updateDevice(this.updateForm);
          this.$message.success('更新成功');
          this.showUpdateDevice = false;
          await this.fetchDeviceList();
        } catch (error) {
          this.$emit('error', '更新失败：' + (error.response?.data?.message || '更新错误'));
        } finally {
          this.isUpdating = false;
        }
      },
    },
  };
</script>

<style scoped>
  .device-management {
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

  input,
  select {
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

  .device-list {
    display: flex;
    flex-direction: column;
    max-height: 60vh;
    padding: 10px 0;
    overflow-y: auto;
    gap: 12px;
  }

  .device-card {
    border: 1px solid #eee;
    border-radius: 12px;
    background: #fbfcfd;
    box-shadow: 0 2px 4px rgb(0 0 0 / 5%);
  }

  .device-header {
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

  .device-main {
    display: flex;
    flex: 1;
    align-items: center;
    gap: 10px;
  }

  .device-id {
    color: #2c3e50;
    font-weight: 500;
  }

  .status-circle {
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-left: 5px;
    border-radius: 50%;
  }

  .status-circle.online {
    background: #2e7d32; /* 绿圈 */
  }

  .status-circle.offline {
    background: #c62828; /* 红圈 */
  }

  .action-buttons {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
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

  /* 设备详情展开行 */
  .device-detail-row {
    margin-top: 5px;
    padding: 10px 20px;
    border-radius: 0 0 8px 8px;
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
  .device-list::-webkit-scrollbar {
    width: 6px;
  }

  .device-list::-webkit-scrollbar-track {
    border-radius: 3px;
    background: #f1f1f1;
  }

  .device-list::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background: #c1c1c1;
  }

  .device-list::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }

  .device-icon {
    margin-right: 5px;
    font-size: 1.2em;
    vertical-align: middle;
  }
</style>
