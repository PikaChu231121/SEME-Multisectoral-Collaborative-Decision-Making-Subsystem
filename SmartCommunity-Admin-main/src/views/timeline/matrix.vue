<template>
  <div class="timeline-matrix">
    <!-- 新增：火灾报警信息编辑表单 -->
    <el-form :model="fireAlarmInfo" label-width="100px" style="margin-bottom: 20px;">
      <el-form-item label="地点">
        <el-input v-model="fireAlarmInfo.location" placeholder="如：阳光花园小区，3号楼，5楼"></el-input>
      </el-form-item>
      <el-form-item label="火势等级">
        <el-input v-model="fireAlarmInfo.level" placeholder="如：中度（黑烟明显，有明火）"></el-input>
      </el-form-item>
      <el-form-item label="报警来源">
        <el-input v-model="fireAlarmInfo.source" placeholder="如：烟感报警器 + 居民电话报警"></el-input>
      </el-form-item>
      <el-form-item label="时间">
        <el-input v-model="fireAlarmInfo.time" placeholder="如：2025年4月15日 08:30"></el-input>
      </el-form-item>
      <el-form-item label="天气">
        <el-input v-model="fireAlarmInfo.weather" placeholder="如：沙尘暴，风力8级"></el-input>
      </el-form-item>
      <el-form-item label="人员情况">
        <el-input v-model="fireAlarmInfo.people" placeholder="如：楼内可能有10人被困"></el-input>
      </el-form-item>

      <!-- 新增：模型和设备选择表单 -->
      <el-form :model="splitConfig" label-width="100px" style="margin-bottom: 20px;">
        <el-form-item label="模型">
          <el-select v-model="splitConfig.model_id" placeholder="请选择模型" style="width: 100%">
            <el-option
              v-for="model in modelList"
              :key="model.model_id"
              :label="model.model_id"
              :value="model.model_id"
            />
          </el-select>
        </el-form-item>
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

      <el-form-item>
        <el-button type="primary" @click="submitFireAlarmInfo">保存报警信息</el-button>
      </el-form-item>
    </el-form>

    <!-- 刷新按钮 -->
    <el-button type="primary" :loading="loading" @click="handleButtonClick" style="margin-bottom: 15px;">
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
          {{ isShowingDetail($index, department) ? row[department].detail : row[department].name }}
        </div>
      </template>

      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from "axios"; // 开启后端接入时取消注释
import { queryModelList, queryDeviceList, handleSPDetect } from '@/api/backend/api/splitTab';

export default {
  name: "Matrix",
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
        people: ''
      },
      // 新增：分割配置相关数据
      splitConfig: {
        model_id: '',
        edge_id: '',
        server_id: ''
      },
      modelList: [],
      deviceList: []
    };
  },
  computed: {
    // 过滤出在线的边缘设备
    onlineEdgeDevices() {
      return this.deviceList.filter(device => 
        device.status === 'online'
      );
    },
    // 过滤出在线的服务器设备
    onlineServerDevices() {
      return this.deviceList.filter(device => 
        device.status === 'online'
      );
    }
  },
  methods: {
    async handleButtonClick() {
      this.loading = true;
      try {
        await this.runPythonScript();       // 等待后端脚本运行完成
        await this.fetchTimelineData();     // 然后才拉新数据
        console.log("数据已刷新");
      } catch (error) {
        console.error("刷新数据时发生错误", error);
      }finally {
        this.loading = false;
      }
    },
    // 新增：提交火灾报警信息
    submitFireAlarmInfo() {
      // 检查所有必填字段是否已填写
      if (!this.fireAlarmInfo.location || !this.fireAlarmInfo.level || 
          !this.fireAlarmInfo.source || !this.fireAlarmInfo.time || 
          !this.fireAlarmInfo.weather || !this.fireAlarmInfo.people) {
        this.$message.warning('请填写完整的火灾报警信息');
        return;
      }

      // 检查模型和设备是否已选择
      if (!this.splitConfig.model_id || !this.splitConfig.edge_id || !this.splitConfig.server_id) {
        this.$message.warning('请选择模型、边缘设备和服务器');
        return;
      }

      // 拼接火灾报警信息
      const inputText = `地点：${this.fireAlarmInfo.location}\n` +
                       `火势等级：${this.fireAlarmInfo.level}\n` +
                       `报警来源：${this.fireAlarmInfo.source}\n` +
                       `时间：${this.fireAlarmInfo.time}\n` +
                       `天气：${this.fireAlarmInfo.weather}\n` +
                       `人员情况：${this.fireAlarmInfo.people}`;

      // 先保存火灾报警信息
      axios.post('/api/set-fire-alarm-info', this.fireAlarmInfo)
        .then(() => {
          this.$message.success('报警信息已保存');
          
          // 调用分割算法接口
          return handleSPDetect({
            model_id: this.splitConfig.model_id,
            edge_id: this.splitConfig.edge_id,
            server_id: this.splitConfig.server_id,
            input_text: inputText
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
    // 封装数据请求方法
    fetchTimelineData() {
      return axios.get("/api/get-timeline-detail")
        .then(response => {
          this.timelineData = [...response.data.timeline];     // 替换为新实例
          this.departments = [...response.data.departments];   // 替换为新实例
        })
        .catch(error => {
          console.error("获取时间表数据失败：", error);
        });
    },
    // 触发后端运行 Python 脚本
    runPythonScript() {
      // 返回 promise 以便链式调用
      return axios.post("/api/refresh-response");
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
    }
  },
  mounted() {
    this.fetchTimelineData(); // 页面加载时自动获取一次
    this.fetchModelList();    // 新增：获取模型列表
    this.fetchDeviceList();   // 新增：获取设备列表
  }
};
</script>

<style scoped>
.block {
  color: #fff;
  padding: 5px;
  text-align: center;
  border-radius: 4px;
}
</style>
