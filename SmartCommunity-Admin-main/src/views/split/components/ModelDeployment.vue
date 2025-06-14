<template>
  <div class="model-deployment">
    <h2>模型部署信息设置</h2>
    <!-- 模型列表展示 -->
    <div v-if="models.length">
      <div v-for="model in models" :key="model.model_id" class="model-card">
        <h3
          >模型ID: {{ model.model_id }} <small>版本: {{ model.version }}</small></h3
        >
        <!-- 已部署设备展示 -->
        <div class="section">
          <h4>已部署设备</h4>
          <div v-if="model.deployedDevices.length">
            <ul>
              <li v-for="device in model.deployedDevices" :key="device">
                <!-- 调整：先显示状态和类型图标，再显示设备ID -->
                <span v-if="getDeviceInfo(device)">
                  <span
                    class="status-circle"
                    :class="getDeviceInfo(device).status === 'online' ? 'online' : 'offline'"
                  />
                  <component
                    :is="
                      getDeviceInfo(device).device_type === 'edge'
                        ? 'MobileOutlined'
                        : 'CloudServerOutlined'
                    "
                  />
                </span>
                <span v-if="getDeviceInfo(device)" class="device-info"
                  >{{ getDeviceInfo(device).device_type === 'edge' ? '边缘设备' : '服务器' }} /
                  {{ getDeviceInfo(device).status === 'online' ? '在线' : '离线' }}</span
                >
                <span class="device-id">{{ device }}</span>
                <button class="action-button" @click="handleUndeploy(model, device)">卸载</button>
              </li>
            </ul>
          </div>
          <div v-else>
            <p>暂未部署到任何设备。</p>
          </div>
        </div>
        <!-- 部署新设备 -->
        <div class="section">
          <h4>部署模型到设备</h4>
          <div>
            <select v-model="model.selectedDevice">
              <option disabled value="">请选择设备</option>
              <!-- 过滤掉该模型已部署的设备 -->
              <option
                v-for="device in availableDevices(model)"
                :key="device.device_id"
                :value="device.device_id"
              >
                {{ device.device_type === 'edge' ? '边缘设备' : '服务器' }} /
                {{ device.status === 'online' ? '在线' : '离线' }}：{{ device.device_id }}
              </option>
            </select>
            <button
              class="action-button"
              :disabled="!model.selectedDevice"
              @click="handleDeploy(model)"
            >
              部署
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p>暂无模型信息。</p>
    </div>
  </div>
</template>

<script>
  import { ref, onMounted, getCurrentInstance } from 'vue';
  import {
    queryModelList,
    queryModelDevices,
    queryDeviceList,
    deployModel,
    undeployModel,
  } from 'd:/ProjectCommunity/SmartCommunity-Admin/src/api/backend/api/splitTab';
  import { MobileOutlined, CloudServerOutlined } from '@ant-design/icons-vue';

  export default {
    name: 'ModelDeployment',
    components: { MobileOutlined, CloudServerOutlined },
    setup() {
      const models = ref([]);
      const registeredDevices = ref([]);
      const { proxy } = getCurrentInstance();

      const fetchRegisteredDevices = async () => {
        try {
          const res = await queryDeviceList();
          // 保存完整设备对象
          registeredDevices.value = res.data ? res.data : [];
        } catch (error) {
          console.error('获取注册设备失败', error);
        }
      };

      const fetchModels = async () => {
        try {
          const res = await queryModelList();
          if (res.data) {
            models.value = res.data.map((model) => ({
              ...model,
              deployedDevices: [],
              selectedDevice: '',
            }));
            // 对每个模型获取部署设备
            models.value.forEach((model) => {
              fetchDeployedDevices(model);
            });
          }
        } catch (error) {
          console.error('获取模型列表失败', error);
        }
      };

      const fetchDeployedDevices = async (model) => {
        try {
          const res = await queryModelDevices({ model_id: model.model_id });
          model.deployedDevices =
            res.data && res.data.deployed_devices ? res.data.deployed_devices : [];
        } catch (error) {
          console.error(`获取模型 ${model.model_id} 部署设备失败`, error);
        }
      };

      const handleDeploy = async (model) => {
        try {
          await deployModel({ model_id: model.model_id, device_id: model.selectedDevice });
          await fetchDeployedDevices(model);
          model.selectedDevice = '';
          proxy.$message.success(`模型 ${model.model_id} 部署成功`);
        } catch (error) {
          console.error(`模型 ${model.model_id} 部署失败`, error);
          proxy.$message.error(
            `模型 ${model.model_id} 部署失败: ${error.response?.data?.error || error.message || error}`,
          );
        }
      };

      const handleUndeploy = async (model, device) => {
        try {
          await undeployModel({ model_id: model.model_id, device_id: device });
          await fetchDeployedDevices(model);
          proxy.$message.success(`模型 ${model.model_id} 卸载成功`);
        } catch (error) {
          console.error(`模型 ${model.model_id} 卸载失败`, error);
          proxy.$message.error(
            `模型 ${model.model_id} 卸载失败: ${error.response?.data?.error || error.message || error}`,
          );
        }
      };

      // 新增方法：过滤掉该模型已部署的设备
      const availableDevices = (model) => {
        return registeredDevices.value.filter(
          (device) => !model.deployedDevices.includes(device.device_id),
        );
      };

      // 新增方法：根据 device_id 查找设备详细信息
      const getDeviceInfo = (deviceId) => {
        return registeredDevices.value.find((device) => device.device_id === deviceId);
      };

      onMounted(async () => {
        await fetchRegisteredDevices();
        await fetchModels();
      });

      return {
        models,
        registeredDevices,
        handleDeploy,
        handleUndeploy,
        availableDevices,
        getDeviceInfo,
      };
    },
  };
</script>

<style scoped>
  .model-deployment {
    margin-bottom: 15px;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: #fff;
  }

  .model-deployment h2 {
    margin-bottom: 15px;
    color: #2c3e50;
  }

  .model-card {
    margin-bottom: 20px;
    padding: 15px;
    border: 1px solid #f0f0f0;
    border-radius: 6px;
    background: #fafafa;
  }

  .model-card h3 {
    margin-bottom: 10px;
    color: #3498db;
  }

  .section {
    margin-bottom: 15px;
  }

  .section h4 {
    margin-bottom: 8px;
    color: #2c3e50;
  }

  ul {
    padding: 0;
    list-style: none;
  }

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #eee;
  }

  select {
    margin-right: 10px;
    padding: 5px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .action-button {
    padding: 5px 15px;
    border: none;
    border-radius: 4px;
    background: #3498db;
    color: white;
    cursor: pointer;
  }

  .action-button:disabled {
    background: #95a5a6;
    cursor: not-allowed;
  }

  .status-circle {
    display: inline-block;
    width: 10px;
    height: 10px;
    margin: 0 5px;
    border-radius: 50%;
  }

  .status-circle.online {
    background: #2e7d32;
  }

  .status-circle.offline {
    background: #c62828;
  }

  .device-id {
    flex-grow: 1;
    padding-left: 10px;
    font-weight: bold;
    text-align: left;
  }

  .device-info {
    flex-grow: 1;
    padding-left: 10px;
  }
</style>
