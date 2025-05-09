<template>
  <div class="timeline-matrix">
    
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

export default {
  name: "Matrix",
  data() {
    return {
      departments: [],
      timelineData: [],
      showDetails: {}, // 用于记录每个单元格是否显示 detail
      loading: false // 用于控制加载状态
    };
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
    }
  },
  mounted() {
    this.fetchTimelineData(); // 页面加载时自动获取一次
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
