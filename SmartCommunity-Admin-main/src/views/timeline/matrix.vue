<template>
  <div class="timeline-matrix">
    <!-- 火灾报警信息表单 -->
    <el-form :model="fireAlarmInfo" label-width="100px" style="margin-bottom: 20px">
      <el-form-item label="地点">
        <el-input v-model="fireAlarmInfo.location" placeholder="如：阳光花园小区，3号楼，5楼" />
      </el-form-item>
      <el-form-item label="火势等级">
        <el-input v-model="fireAlarmInfo.level" placeholder="如：中度（黑烟明显，有明火）" />
      </el-form-item>
      <el-form-item label="报警来源">
        <el-input v-model="fireAlarmInfo.source" placeholder="如：烟感报警器 + 居民电话报警" />
      </el-form-item>
      <el-form-item label="时间">
        <el-input v-model="fireAlarmInfo.time" placeholder="如：2025年4月15日 08:30" />
      </el-form-item>
      <el-form-item label="天气">
        <el-input v-model="fireAlarmInfo.weather" placeholder="如：沙尘暴，风力8级" />
      </el-form-item>
      <el-form-item label="人员情况">
        <el-input v-model="fireAlarmInfo.people" placeholder="如：楼内可能有10人被困" />
      </el-form-item>
    </el-form>

    <!-- 修改：单独设备选择部分，仅显示边缘设备和服务器下拉框 -->
    <el-form :model="splitConfig" label-width="100px" style="margin-bottom: 20px">
      <el-form-item label="边缘设备">
        <el-select v-model="splitConfig.edge_id" placeholder="请选择边缘设备" style="width: 100%">
          <el-option
            v-for="device in onlineEdgeDevices"
            :key="device.device_id"
            :label="device.device_id"
            :value="device.device_id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="服务器">
        <el-select v-model="splitConfig.server_id" placeholder="请选择服务器" style="width: 100%">
          <el-option
            v-for="device in onlineServerDevices"
            :key="device.device_id"
            :label="device.device_id"
            :value="device.device_id"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <!-- 当边缘与服务器都已选择后显示模型选择 -->
    <el-form
      v-if="splitConfig.edge_id && splitConfig.server_id"
      :model="splitConfig"
      label-width="100px"
      style="margin-bottom: 20px"
    >
      <el-form-item label="模型">
        <el-select v-model="splitConfig.model_id" placeholder="请选择模型" style="width: 100%">
          <el-option v-for="model in availableModels" :key="model" :label="model" :value="model" />
        </el-select>
      </el-form-item>
    </el-form>

    <el-form-item>
      <el-button type="primary" @click="submitFireAlarmInfo">保存报警信息</el-button>
    </el-form-item>

    <!-- 刷新按钮 -->
    <el-button
      type="primary"
      :loading="loading"
      style="margin-bottom: 15px"
      @click="handleButtonClick"
    >
      {{ loading ? '刷新中' : '刷新数据' }}
    </el-button>

    <!-- 表格 -->
    <el-table :data="timelineData" border style="width: 100%">
      <!-- 时间列 -->
      <el-table-column prop="time" label="时间" width="150">
        <template #default="{ row }">
          <span>{{ row.time }}</span>
        </template>
      </el-table-column>

      <!-- 动态生成部门列 -->
      <el-table-column
        v-for="department in departments"
        :key="department"
        :label="department"
        :prop="department"
      >
        <template #default="{ row, $index }">
          <div
            v-if="row[department]"
            class="block"
            :style="{ backgroundColor: '#409eff', cursor: 'pointer' }"
            @click="toggleDetail($index, department)"
          >
            {{
              isShowingDetail($index, department) ? row[department].detail : row[department].name
            }}
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import axios from 'axios';
  import {
    queryModelList,
    queryDeviceList,
    queryDeviceModels,
    handleSPDetect,
  } from '@/api/backend/api/splitTab';
  import { baseApiUrl } from '@/utils/request';

  export default {
    name: 'Matrix',
    data() {
      return {
        departments: [],
        timelineData: [],
        showDetails: {}, // 用于记录每个单元格是否显示 detail
        loading: false, // 用于控制加载状态
        // 新增：火灾报警信息
        fireAlarmInfo: {
          location: '',
          level: '',
          source: '',
          time: '',
          weather: '',
          people: '',
        },
        // 新增：分割配置相关数据
        splitConfig: {
          model_id: '',
          edge_id: '',
          server_id: '',
        },
        modelList: [],
        deviceList: [],
        availableModels: [], // 新增：保存所选边缘和服务器上都部署的模型ID数组
      };
    },
    computed: {
      // 过滤出在线的边缘设备
      onlineEdgeDevices() {
        return this.deviceList.filter(
          (device) => device.status === 'online' && device.device_type === 'edge',
        );
      },
      // 过滤出在线的服务器设备
      onlineServerDevices() {
        return this.deviceList.filter(
          (device) => device.status === 'online' && device.device_type === 'server',
        );
      },
    },
    watch: {
      // 当边缘设备和服务器都选好时，获取这两个设备部署的模型交集
      'splitConfig.edge_id': function (newVal) {
        if (newVal && this.splitConfig.server_id) {
          this.fetchAvailableModels();
        } else {
          this.availableModels = [];
          this.splitConfig.model_id = '';
        }
      },
      'splitConfig.server_id': function (newVal) {
        if (newVal && this.splitConfig.edge_id) {
          this.fetchAvailableModels();
        } else {
          this.availableModels = [];
          this.splitConfig.model_id = '';
        }
      },
    },
    mounted() {
      this.fetchTimelineData(); // 页面加载时自动获取一次
      this.fetchModelList(); // 新增：获取模型列表
      this.fetchDeviceList(); // 新增：获取设备列表
    },
    methods: {
      async handleButtonClick() {
        this.loading = true;
        try {
          await this.runPythonScript(); // 等待后端脚本运行完成
          await this.fetchTimelineData(); // 然后才拉新数据
          console.log('数据已刷新');
        } catch (error) {
          console.error('刷新数据时发生错误', error);
        } finally {
          this.loading = false;
        }
      },
      // 新增：提交火灾报警信息
      submitFireAlarmInfo() {
        // 检查所有必填字段是否已填写
        if (
          !this.fireAlarmInfo.location ||
          !this.fireAlarmInfo.level ||
          !this.fireAlarmInfo.source ||
          !this.fireAlarmInfo.time ||
          !this.fireAlarmInfo.weather ||
          !this.fireAlarmInfo.people
        ) {
          this.$message.warning('请填写完整的火灾报警信息');
          return;
        }

        // 检查模型和设备是否已选择
        if (
          !this.splitConfig.model_id ||
          !this.splitConfig.edge_id ||
          !this.splitConfig.server_id
        ) {
          this.$message.warning('请选择模型、边缘设备和服务器');
          return;
        }

        // 拼接火灾报警信息
        const inputText = `
          【火灾报警信息】
          火灾发生地点：${this.fireAlarmInfo.location}
          火势等级：${this.fireAlarmInfo.level}
          报警来源：${this.fireAlarmInfo.source}
          时间：${this.fireAlarmInfo.time}
          天气：${this.fireAlarmInfo.weather}
          人员情况：${this.fireAlarmInfo.people}

          【任务指令】
          请组织消防员、医生、保安、物业四个角色分别从专业角度出发，
          结合上述火灾报警信息制定一个完整的火灾应急响应方案，
          分为报警初期（0-5分钟）、救援中期（5-30分钟）和善后阶段（30分钟后）。
          请确保输出格式为如下 JSON 格式：
          {
            "阶段一": {
                "消防员": ["任务1", "任务2"],
                "医生": ["任务1", "任务2"],
                "保安": ["任务1", "任务2"],
                "物业": ["任务1", "任务2"]
            },
            "阶段二": { ... },
            "阶段三": { ... }
          }
          不要输出任何解释文字，只返回 JSON。
          `;

        // 先保存火灾报警信息
        axios
          .post(`${baseApiUrl}/api/set-fire-alarm-info`, this.fireAlarmInfo)
          .then(() => {
            this.$message.success('报警信息已保存');

            // 调用分割算法接口
            return handleSPDetect({
              model_id: this.splitConfig.model_id,
              edge_id: this.splitConfig.edge_id,
              server_id: this.splitConfig.server_id,
              input_text: inputText,
            });
          })
          .then(() => {
            this.$message.success('分割算法执行成功');
          })
          .catch((error) => {
            console.error('操作失败:', error);
            this.$message.error('操作失败：' + (error.message || '未知错误'));
          });
      },
      async fetchAvailableModels() {
        try {
          const [edgeResp, serverResp] = await Promise.all([
            // 查询所选边缘设备部署的模型
            queryDeviceModels({ device_id: this.splitConfig.edge_id }),
            // 查询所选服务器部署的模型
            queryDeviceModels({ device_id: this.splitConfig.server_id }),
          ]);
          let edgeModels =
            edgeResp.data && edgeResp.data.deployed_models ? edgeResp.data.deployed_models : [];
          let serverModels =
            serverResp.data && serverResp.data.deployed_models
              ? serverResp.data.deployed_models
              : [];
          // 可选模型为在两个设备上都部署的模型（交集）
          this.availableModels = edgeModels.filter((model) => serverModels.includes(model));
          // 若当前选中的模型不在交集中，重置
          if (!this.availableModels.includes(this.splitConfig.model_id)) {
            this.splitConfig.model_id = '';
          }
        } catch (error) {
          console.error('获取可选模型失败', error);
          this.$message.error('获取可选模型失败');
        }
      },
      // 封装数据请求方法
      fetchTimelineData() {
        return axios
          .get(`${baseApiUrl}/api/get-timeline-detail`)
          .then((response) => {
            this.timelineData = [...response.data.timeline]; // 替换为新实例
            this.departments = [...response.data.departments]; // 替换为新实例
          })
          .catch((error) => {
            console.error('获取时间表数据失败：', error);
          });
      },
      // 触发后端运行 Python 脚本
      runPythonScript() {
        // 返回 promise 以便链式调用
        return axios.post(`${baseApiUrl}/api/refresh-response`);
      },
      toggleDetail(rowIndex, department) {
        const key = `${rowIndex}-${department}`;
        this.showDetails[key] = !this.showDetails[key];
      },
      isShowingDetail(rowIndex, department) {
        const key = `${rowIndex}-${department}`;
        return this.showDetails[key];
      },
      // 新增：获取模型列表
      async fetchModelList() {
        try {
          const { data } = await queryModelList();
          this.modelList = data;
        } catch (error) {
          console.error('获取模型列表失败:', error);
          this.$message.error('获取模型列表失败');
        }
      },
      // 新增：获取设备列表
      async fetchDeviceList() {
        try {
          const { data } = await queryDeviceList();
          this.deviceList = data;
        } catch (error) {
          console.error('获取设备列表失败:', error);
          this.$message.error('获取设备列表失败');
        }
      },
    },
  };
</script>

<style scoped>
  .block {
    padding: 5px;
    border-radius: 4px;
    color: #fff;
    text-align: center;
  }
</style>
