<template>
  <div class="timeline-matrix">
    <!-- 响应详情头部 -->
    <el-page-header @back="$router.back()" content="响应详情" style="margin-bottom: 20px" />

    <!-- 表格 -->
    <el-table :data="timelineData" border style="width: 100%">
      <!-- 时间列 -->
      <el-table-column prop="time" label="时间" width="150" />

      <!-- 部门列（动态生成） -->
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
import axios from 'axios';
import { ElMessage } from 'element-plus';

export default {
  name: 'ResponseDetail',
  data() {
    return {
      departments: [],
      timelineData: [],
      showDetails: {}, // 控制是否显示 detail
    };
  },
  methods: {
    async fetchTimelineDetail() {
      const id = this.$route.params.id;
      try {
        const response = await axios.get(`/api/response-history/${id}`);
        const rawData = response.data;

        // 提取部门列表（从所有阶段中聚合）
        const deptSet = new Set();
        rawData.forEach(stage => {
          stage.actions.forEach(action => {
            deptSet.add(action.departmentName);
          });
        });
        this.departments = [...deptSet];

        // 转换数据为矩阵形式
        this.timelineData = rawData.map(stage => {
          const row = { time: stage.timeRange };
          stage.actions.forEach(action => {
            row[action.departmentName] = {
              name: action.actionName,
              detail: action.actionDetail
            };
          });
          return row;
        });

      } catch (err) {
        console.error('加载失败', err);
        ElMessage.error('获取响应详情失败，请稍后重试');
      }
    },
    toggleDetail(rowIndex, department) {
      const key = `${rowIndex}-${department}`;
      this.showDetails[key] = !this.showDetails[key];
    },
    isShowingDetail(rowIndex, department) {
      return this.showDetails[`${rowIndex}-${department}`];
    }
  },
  mounted() {
    this.fetchTimelineDetail();
  }
};
</script>

<style scoped>
.timeline-matrix {
  padding: 10px;
}

.block {
  color: #fff;
  padding: 5px;
  text-align: center;
  border-radius: 4px;
  transition: all 0.2s;
}
</style>