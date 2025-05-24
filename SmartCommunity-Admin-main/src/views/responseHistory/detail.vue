<template>
  <div class="timeline-matrix">
    <!-- 响应详情头部 -->
    <div class="page-header">
      <el-page-header @back="$router.back()" content="响应详情" />
      <div class="header-actions">
        <el-button type="primary" @click="exportData">
          <i class="el-icon-download"></i>
          导出数据
        </el-button>
        <el-button type="success" @click="showReplay = true">
          <i class="el-icon-video-play"></i>
          流程回放
        </el-button>
      </div>
    </div>

    <!-- 事件信息卡片 -->
    <div class="event-info-card">
      <div class="event-header">
        <div class="event-title">
          <h2>火灾事件详情</h2>
          <span class="event-time">{{ formatTime(new Date()) }}</span>
        </div>
        <div class="event-tags">
          <el-tag type="danger" effect="dark">火灾应急</el-tag>
          <el-tag type="warning">多部门协同</el-tag>
        </div>
      </div>
    </div>

    <!-- 时间线表格 -->
    <div class="timeline-container">
      <div class="timeline-header">
        <h3>应急处理时间线</h3>
        <div class="timeline-legend">
          <div class="legend-item" v-for="dept in departments" :key="dept">
            <span class="legend-color" :class="getDeptClass(dept)"></span>
            <span>{{ dept }}</span>
          </div>
        </div>
      </div>

      <el-table 
        :data="timelineData" 
        border 
        style="width: 100%"
        :header-cell-style="{
          background: '#f5f7fa',
          color: '#606266',
          fontWeight: 'bold',
          fontSize: '14px',
          textAlign: 'center',
          height: '50px'
        }"
        :cell-style="{
          textAlign: 'center',
          padding: '8px 0'
        }"
      >
        <el-table-column prop="time" label="时间" width="150" fixed>
          <template #default="{ row }">
            <div class="time-cell">
              <i class="el-icon-time"></i>
              <span>{{ row.time }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          v-for="department in departments"
          :key="department"
          :label="department"
          :prop="department"
        >
          <template #header>
            <div class="dept-header" :class="getDeptClass(department)">
              {{ department }}
            </div>
          </template>
          <template #default="{ row, $index }">
            <div
              v-if="row[department]"
              class="action-block"
              :class="getDeptClass(department)"
              @click="toggleDetail($index, department)"
            >
              <div class="block-content">
                {{ isShowingDetail($index, department) ? row[department].detail : row[department].name }}
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 流程回放弹窗 -->
    <el-dialog v-model="showReplay" title="事件流程回放" width="70%" :close-on-click-modal="false">
      <div class="replay-timeline" ref="replayTimeline">
        <div v-for="(row, idx) in timelineData" :key="idx" class="replay-row" :class="{ active: idx === replayStep }" :ref="idx === replayStep ? 'activeRow' : null">
          <div class="replay-time">{{ row.time }}</div>
          <div class="replay-actions">
            <div v-for="dept in departments" :key="dept" class="replay-action-block" :class="[getDeptClass(dept), { 'replay-highlight': idx === replayStep }]">
              <span v-if="row[dept]">{{ row[dept].name }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="replay-controls">
        <el-button class="replay-btn" @click="replayPrev" :disabled="replayStep === 0 || timelineData.length === 0">上一步</el-button>
        <el-button class="replay-btn" @click="toggleReplay" :disabled="timelineData.length === 0">{{ replayPlaying ? '暂停' : '播放' }}</el-button>
        <el-button class="replay-btn" @click="replayNext" :disabled="replayStep === timelineData.length - 1 || timelineData.length === 0">下一步</el-button>
        <el-button class="replay-btn" @click="replayRestart" :disabled="timelineData.length === 0">重播</el-button>
        <el-progress :percentage="timelineData.length === 0 ? 0 : ((replayStep + 1) / timelineData.length) * 100" style="width: 200px; margin-left: 20px;"/>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios';
import { ElMessage } from 'element-plus';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default {
  name: 'ResponseDetail',
  data() {
    return {
      departments: [],
      timelineData: [],
      showDetails: {},
      eventId: null,
      // 回放相关
      showReplay: false,
      replayStep: 0,
      replayPlaying: false,
      replayTimer: null,
    };
  },
  methods: {
    async fetchTimelineDetail() {
      const id = this.$route.params.id;
      try {
        const response = await axios.get(`/api/response-history/${id}`);
        const rawData = response.data;
        // 优先从接口返回数据中获取事件ID
        if (rawData.id) {
          this.eventId = rawData.id;
        } else if (Array.isArray(rawData) && rawData.length > 0 && rawData[0].eventId) {
          this.eventId = rawData[0].eventId;
        } else if (Array.isArray(rawData) && rawData.length > 0 && rawData[0].id) {
          this.eventId = rawData[0].id;
        } else {
          this.eventId = id; // 兜底用路由参数
        }

        // 提取部门列表
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
    },
    getDeptClass(dept) {
      switch(dept) {
        case '消防': return 'firefighter-dept';
        case '医院': return 'doctor-dept';
        case '安保': return 'security-dept';
        case '物业': return 'property-dept';
        default: return 'default-dept';
      }
    },
    formatTime(date) {
      return date.toLocaleString('zh-CN');
    },
    exportData() {
      // 获取事件ID
      const eventId = this.eventId;
      // 1. 生成表头
      const headers = ['时间', ...this.departments];
      // 2. 生成数据
      const data = this.timelineData.map(row => {
        const rowData = [row.time];
        this.departments.forEach(dept => {
          rowData.push(row[dept] ? (row[dept].name + (row[dept].detail ? '：' + row[dept].detail : '')) : '');
        });
        return rowData;
      });
      // 3. 合并表头和数据，并在顶部插入事件ID
      const sheetData = [[`事件ID: ${eventId}`], headers, ...data];
      // 4. 创建工作表和工作簿
      const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, '应急处理时间线');
      // 5. 导出
      const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      saveAs(new Blob([wbout], { type: 'application/octet-stream' }), `应急处理时间线_${eventId}.xlsx`);
    },
    // 回放控制
    toggleReplay() {
      if (this.replayPlaying) {
        this.replayPlaying = false;
        clearInterval(this.replayTimer);
      } else {
        this.replayPlaying = true;
        this.replayTimer = setInterval(() => {
          if (this.replayStep < this.timelineData.length - 1) {
            this.replayStep++;
          } else {
            this.replayPlaying = false;
            clearInterval(this.replayTimer);
          }
        }, 1200);
      }
    },
    replayPrev() {
      if (this.replayStep > 0) this.replayStep--;
    },
    replayNext() {
      if (this.replayStep < this.timelineData.length - 1) this.replayStep++;
    },
    replayRestart() {
      this.replayStep = 0;
      this.replayPlaying = false;
      clearInterval(this.replayTimer);
    },
    scrollToActiveRow() {
      // 自动滚动到当前高亮行
      const timeline = this.$refs.replayTimeline;
      const activeRow = this.$refs.activeRow;
      if (timeline && activeRow && activeRow[0]) {
        const rowEl = activeRow[0];
        const top = rowEl.offsetTop - timeline.scrollTop;
        timeline.scrollTo({ top: top - 40, behavior: 'smooth' });
      }
    },
  },
  watch: {
    showReplay(val) {
      if (val) {
        this.replayStep = 0;
        this.replayPlaying = false;
        clearInterval(this.replayTimer);
        this.$nextTick(() => {
          this.scrollToActiveRow();
        });
      } else {
        this.replayPlaying = false;
        clearInterval(this.replayTimer);
        this.replayStep = 0;
      }
    },
    replayStep() {
      this.$nextTick(() => {
        this.scrollToActiveRow();
      });
    }
  },
  mounted() {
    this.fetchTimelineDetail();
  }
};
</script>

<style scoped>
.timeline-matrix {
  padding: 24px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.header-actions {
  display: flex;
  gap: 12px;
}

.event-info-card {
  padding: 25px;
  margin-bottom: 30px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.event-title h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
  color: #1976d2;
  font-weight: 600;
}

.event-time {
  font-size: 14px;
  color: #f3f4f6;
}

.event-tags {
  display: flex;
  gap: 10px;
}

.timeline-container {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eaedf2;
}

.timeline-header h3 {
  margin: 0;
  color: #1976d2;
  font-size: 20px;
  font-weight: 600;
}

.timeline-legend {
  display: flex;
  gap: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #606266;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.time-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #606266;
  font-weight: 500;
}

.dept-header {
  font-weight: 600;
  padding: 4px 0;
}

.action-block {
  position: relative;
  padding: 10px 12px;
  border-radius: 6px;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  margin: 6px;
}

.block-content {
  position: relative;
  z-index: 2;
  text-align: center;
  line-height: 1.4;
}

.action-block:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 部门颜色类 */
.firefighter-dept {
  background: linear-gradient(135deg, #e53935 0%, #c62828 100%);
}

.doctor-dept {
  background: linear-gradient(135deg, #43a047 0%, #2e7d32 100%);
}

.security-dept {
  background: linear-gradient(135deg, #1e88e5 0%, #1565c0 100%);
}

.property-dept {
  background: linear-gradient(135deg, #fb8c00 0%, #ef6c00 100%);
}

.default-dept {
  background: linear-gradient(135deg, #409eff 0%, #337ecc 100%);
}

/* 图例颜色 */
.legend-color.firefighter-dept {
  background: linear-gradient(135deg, #e53935 0%, #c62828 100%);
}

.legend-color.doctor-dept {
  background: linear-gradient(135deg, #43a047 0%, #2e7d32 100%);
}

.legend-color.security-dept {
  background: linear-gradient(135deg, #1e88e5 0%, #1565c0 100%);
}

.legend-color.property-dept {
  background: linear-gradient(135deg, #fb8c00 0%, #ef6c00 100%);
}

.dept-header.firefighter-dept,
.dept-header.doctor-dept,
.dept-header.security-dept,
.dept-header.property-dept {
  color: #fff !important;
}

.replay-timeline {
  margin: 20px 0;
  max-height: 350px;
  overflow-y: auto;
  scroll-behavior: smooth;
}
.replay-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px 0;
  border-radius: 12px;
  transition: background 0.5s, box-shadow 0.5s, transform 0.4s;
  background: #fff;
}
.replay-row.active {
  background: linear-gradient(90deg, #e3f2fd 60%, #bbdefb 100%);
  box-shadow: 0 4px 18px rgba(25, 118, 210, 0.18);
  transform: scale(1.03);
  z-index: 2;
  animation: replayRowPop 0.5s;
}
@keyframes replayRowPop {
  0% { transform: scale(0.98); box-shadow: 0 0 0 rgba(25,118,210,0); }
  60% { transform: scale(1.05); box-shadow: 0 8px 24px rgba(25,118,210,0.18); }
  100% { transform: scale(1.03); }
}
.replay-time {
  width: 120px;
  font-weight: bold;
  color: #1976d2;
  text-align: center;
}
.replay-actions {
  display: flex;
  gap: 16px;
  flex: 1;
}
.replay-action-block {
  min-width: 120px;
  min-height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-size: 15px;
  color: #fff;
  opacity: 0.7;
  background: #bdbdbd;
  transition: all 0.3s, box-shadow 0.3s;
  position: relative;
}
.replay-row.active .replay-action-block {
  opacity: 1;
  font-weight: bold;
  animation: actionPop 0.5s;
  box-shadow: 0 0 16px 2px #90caf9;
}
@keyframes actionPop {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 #90caf9; }
  60% { transform: scale(1.08); box-shadow: 0 0 24px 6px #90caf9; }
  100% { transform: scale(1); box-shadow: 0 0 16px 2px #90caf9; }
}
.replay-highlight {
  border: 2px solid #1976d2;
  box-shadow: 0 0 12px 2px #1976d2;
}
.replay-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
}
.replay-btn {
  transition: transform 0.1s;
}
.replay-btn:active {
  transform: scale(0.93);
}
</style>