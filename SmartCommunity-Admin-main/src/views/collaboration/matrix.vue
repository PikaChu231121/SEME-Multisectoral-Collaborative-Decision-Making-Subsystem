<template>
    <div class="collaboration-matrix-system">
      <!-- 导航栏 -->
      <div class="nav-header">
        <div class="nav-container">
          <div class="nav-brand">
            <div>
              <h1>多部门协同决策矩阵</h1>
              <p>火灾应急处理 · 多方协同 · 阶段规划</p>
            </div>
          </div>
          <div class="nav-menu">
            <a href="#" class="nav-item active">协同矩阵</a>
            <a href="#" class="nav-item">应急预案</a>
            <a href="#" class="nav-item">资源配置</a>
          </div>
          <div class="system-status">
            <div class="status-indicator">
              <div class="status-dot" />
              系统正常
            </div>
            <div class="emergency-type">
              <div class="status-dot warning" />
              火灾应急
            </div>
          </div>
        </div>
      </div>
  
      <div class="main-content">
        <!-- 时间线表格 -->
        <div class="timeline-matrix">
          <div class="timeline-header">
            <h3>应急处理时间线</h3>
            <el-button type="primary" :loading="loading" @click="handleButtonClick" class="refresh-btn">
              <i class="el-icon-refresh" v-if="!loading"></i>
              {{ loading ? '刷新中...' : '刷新数据' }}
            </el-button>
          </div>
          
          <el-table 
            :data="timelineData" 
            border 
            style="width: 100%; margin-bottom: 20px;"
            class="timeline-table"
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
              v-for="department in timelineDepartments"
              :key="department"
              :label="department"
              :prop="department"
            >
              <template #header>
                <div class="dept-header">
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

        <!-- 事件信息卡片 -->
        <div class="event-info-card">
          <div class="event-header">
            <div class="event-title">
              <h2>阳光花园小区火灾事件</h2>
              <span class="event-time">{{ currentTime }}</span>
            </div>
            <div class="event-tags">
              <span class="event-tag"><i class="el-icon-warning"></i> 沙尘暴</span>
              <span class="event-tag"><i class="el-icon-wind-power"></i> 风力8级</span>
              <span class="event-tag"><i class="el-icon-hot-water"></i> 中度火势</span>
              <span class="event-tag"><i class="el-icon-user"></i> 约10人被困</span>
            </div>
          </div>
          <div class="event-description">
            <div class="info-item">
              <div class="info-label"><i class="el-icon-location"></i> 火灾发生地点</div>
              <div class="info-value">阳光花园小区，3号楼，5楼</div>
            </div>
            <div class="info-item">
              <div class="info-label"><i class="el-icon-warning-outline"></i> 火势等级</div>
              <div class="info-value">中度（黑烟明显，有明火）</div>
            </div>
            <div class="info-item">
              <div class="info-label"><i class="el-icon-bell"></i> 报警来源</div>
              <div class="info-value">烟感报警器 + 居民电话报警</div>
            </div>
            <div class="info-item">
              <div class="info-label"><i class="el-icon-date"></i> 时间</div>
              <div class="info-value">2025年4月15日 08:32</div>
            </div>
            <div class="info-item">
              <div class="info-label"><i class="el-icon-partly-cloudy"></i> 天气</div>
              <div class="info-value">沙尘暴，风力8级</div>
            </div>
            <div class="info-item">
              <div class="info-label"><i class="el-icon-user"></i> 人员情况</div>
              <div class="info-value">楼内可能有10人被困</div>
            </div>
          </div>
        </div>
  
        <!-- 阶段标签导航 -->
        <div class="phase-tabs-container">
          <div class="phase-tabs">
            <div
              v-for="(phaseName, phaseKey) in phaseNames"
              :key="phaseKey"
              :class="['phase-tab', { active: activePhase === phaseKey }]"
              @click="activePhase = phaseKey"
            >
              <div class="tab-content">
                <div class="phase-number">{{ phaseKey.replace('阶段', '') }}</div>
                <div class="phase-name">{{ phaseName }}</div>
              </div>
              <div class="active-indicator" v-if="activePhase === phaseKey"></div>
            </div>
          </div>
        </div>
  
        <!-- 阶段描述 -->
        <div class="phase-description">
          <h3>{{ phaseDescriptions[activePhase].title }}</h3>
          <p>{{ phaseDescriptions[activePhase].description }}</p>
        </div>
  
        <!-- 部门职责表格组件 -->
        <div class="department-tasks-table">
          <div class="task-table-header">
            <h3>各部门阶段职责表</h3>
            <div class="current-phase-indicator">
              <span class="phase-dot"></span>
              当前阶段：{{ phaseNames[activePhase] }}
            </div>
          </div>
          <div class="task-table-body">
            <div class="task-departments">
              <div 
                v-for="dept in departments" 
                :key="dept" 
                :class="['task-department-item', { active: activeDepartment === dept }]"
                @click="activeDepartment = dept"
              >
                <div class="dept-indicator" :class="getDeptColorClass(dept)"></div>
                <span>{{ dept }}</span>
                <i class="el-icon-arrow-right" v-if="activeDepartment === dept"></i>
              </div>
            </div>
            <div class="task-content-display">
              <div v-if="activeDepartment" class="task-content-card">
                <div class="task-content-header">
                  <h4><span :class="getDeptColorClass(activeDepartment)"></span>{{ activeDepartment }}职责</h4>
                </div>
                <div class="task-content-body">
                  <div v-if="phases[activePhase] && phases[activePhase][activeDepartment]" class="task-list">
                    <div 
                      v-for="(task, index) in phases[activePhase][activeDepartment]" 
                      :key="index" 
                      class="task-item-row"
                    >
                      <div class="task-number">{{ index + 1 }}</div>
                      <div class="task-description">{{ task }}</div>
                    </div>
                  </div>
                  <div v-else class="no-tasks-message">
                    请选择部门查看职责
                  </div>
                </div>
              </div>
              <div v-else class="select-department-prompt">
                <i class="el-icon-d-arrow-left"></i>
                请点击左侧部门查看职责
              </div>
            </div>
          </div>
        </div>
  
        
  
        <!-- 优先级和资源显示区域 -->
        <div class="priority-resource-grid">
          <div class="priority-card">
            <div class="card-header">
              <h3><i class="el-icon-star-on"></i> 任务优先级</h3>
            </div>
            <ul class="priority-list">
              <li class="priority-item">
                <span class="priority-high">紧急</span> 
                <span class="priority-text">疏散被困人员</span>
              </li>
              <li class="priority-item">
                <span class="priority-high">紧急</span> 
                <span class="priority-text">控制火源蔓延</span>
              </li>
              <li class="priority-item">
                <span class="priority-medium">中等</span> 
                <span class="priority-text">保护周边财产</span>
              </li>
              <li class="priority-item">
                <span class="priority-low">常规</span> 
                <span class="priority-text">记录损失情况</span>
              </li>
            </ul>
          </div>
          <div class="resource-card">
            <div class="card-header">
              <h3><i class="el-icon-help"></i> 资源配置</h3>
            </div>
            <div class="resource-list">
              <div class="resource-item">
                <div class="resource-icon">🚒</div>
                <div class="resource-info">
                  <strong>消防车</strong>
                  <span class="resource-status"><i class="el-icon-finished"></i> 2辆 已调派</span>
                </div>
              </div>
              <div class="resource-item">
                <div class="resource-icon">🚑</div>
                <div class="resource-info">
                  <strong>救护车</strong>
                  <span class="resource-status"><i class="el-icon-time"></i> 1辆 待命</span>
                </div>
              </div>
              <div class="resource-item">
                <div class="resource-icon">👮</div>
                <div class="resource-info">
                  <strong>安保人员</strong>
                  <span class="resource-status"><i class="el-icon-present"></i> 4名 现场</span>
                </div>
              </div>
              <div class="resource-item">
                <div class="resource-icon">👥</div>
                <div class="resource-info">
                  <strong>志愿者</strong>
                  <span class="resource-status"><i class="el-icon-time"></i> 6名 待命</span>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- 部门协同示意图 -->
        <div class="collaboration-diagram-section">
          <div class="section-header">
            <h3><i class="el-icon-share"></i> 部门协同示意图</h3>
          </div>
          <div class="diagram-container">
            <div class="department-nodes">
              <div class="dept-node firefighter" @click="showDeptResponsibilities('消防员')">
                <i class="el-icon-user"></i>
                <span>消防员</span>
              </div>
              <div class="dept-node doctor" @click="showDeptResponsibilities('医生')">
                <i class="el-icon-first-aid-kit"></i>
                <span>医生</span>
              </div>
              <div class="dept-node security" @click="showDeptResponsibilities('保安')">
                <i class="el-icon-lock"></i>
                <span>保安</span>
              </div>
              <div class="dept-node property" @click="showDeptResponsibilities('物业')">
                <i class="el-icon-house"></i>
                <span>物业</span>
              </div>
            </div>
            <svg class="connection-lines" width="100%" height="100%">
              <!-- 水平连线 -->
              <line x1="25%" y1="50%" x2="40%" y2="50%" stroke="#1976d2" stroke-width="2" stroke-dasharray="5,5" />
              <line x1="60%" y1="50%" x2="75%" y2="50%" stroke="#1976d2" stroke-width="2" stroke-dasharray="5,5" />
              
              <!-- 垂直连线 -->
              <line x1="50%" y1="25%" x2="50%" y2="40%" stroke="#1976d2" stroke-width="2" stroke-dasharray="5,5" />
              <line x1="50%" y1="60%" x2="50%" y2="75%" stroke="#1976d2" stroke-width="2" stroke-dasharray="5,5" />
              
              <!-- 对角线连线 -->
              <line x1="30%" y1="30%" x2="40%" y2="40%" stroke="#1976d2" stroke-width="2" stroke-dasharray="5,5" />
              <line x1="70%" y1="30%" x2="60%" y2="40%" stroke="#1976d2" stroke-width="2" stroke-dasharray="5,5" />
              <line x1="30%" y1="70%" x2="40%" y2="60%" stroke="#1976d2" stroke-width="2" stroke-dasharray="5,5" />
              <line x1="70%" y1="70%" x2="60%" y2="60%" stroke="#1976d2" stroke-width="2" stroke-dasharray="5,5" />
            </svg>
          </div>
          
          <!-- 部门职责显示区域 -->
          <div v-if="selectedDept" class="dept-responsibilities">
            <div class="dept-responsibilities-header">
              <h4><span :class="getDeptColorClass(selectedDept)"></span>{{ selectedDept }}职责</h4>
              <button class="close-btn" @click="selectedDept = null">×</button>
            </div>
            <div class="responsibilities-content">
              <div v-for="(phaseName, phaseKey) in phaseNames" :key="phaseKey" class="phase-responsibilities">
                <h5>{{ phaseName }}</h5>
                <ul>
                  <li v-for="(task, index) in phases[phaseKey][selectedDept]" :key="index">
                    {{ task }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, reactive } from 'vue';
  import axios from 'axios';
  
  // 基础数据
  const currentTime = ref(new Date().toLocaleString('zh-CN'));
  const activePhase = ref('阶段一');
  
  // 部门和阶段信息
  const departments = ['消防员', '医生', '保安', '物业'];
  const phaseNames = {
    '阶段一': '报警初期（0-5分钟）',
    '阶段二': '救援中期（5-30分钟）',
    '阶段三': '善后阶段（30分钟后）'
  };
  
  // 选中的部门
  const selectedDept = ref(null);
  // 当前活跃的部门（用于任务表格）
  const activeDepartment = ref(null);
  
  // 显示部门职责
  function showDeptResponsibilities(dept) {
    selectedDept.value = dept;
  }
  
  // 获取部门对应的颜色类名
  function getDeptColorClass(dept) {
    switch(dept) {
      case '消防员': return 'firefighter-color';
      case '医生': return 'doctor-color';
      case '保安': return 'security-color';
      case '物业': return 'property-color';
      default: return '';
    }
  }
  
  const phaseDescriptions = reactive({
    '阶段一': {
      title: '报警初期（0-5分钟）',
      description: '此阶段重点是快速响应、初步评估火情，并开始组织人员疏散。各部门需迅速到位并建立协调机制。'
    },
    '阶段二': {
      title: '救援中期（5-30分钟）',
      description: '此阶段重点是全面开展救援行动，控制火势，疏散被困人员，救治伤员，并防止火势蔓延。'
    },
    '阶段三': {
      title: '善后阶段（30分钟后）',
      description: '此阶段重点是确保火灾彻底扑灭，对现场进行安全评估，安置受灾人员，开展后续恢复工作。'
    }
  });
  
  // 协同矩阵数据
  const phases = reactive({
    '阶段一': {
      '消防员': [
        '在接警出发途中调度指挥中心查阅3号楼建筑结构图，了解主要通道、疏散楼梯、易燃物分布。',
        '到场后外部侦查火势，使用热成像仪侦测5层及相邻楼层火源蔓延迹象，随时汇报火势与蔓延方向，并联合物业查监控判断被困人员位置。'
      ],
      '医生': [
        '联合消防收集现场反馈，初步统计被困及受伤人员数量、伤情类型（吸烟、烧伤等）。',
        '组织急救组携急救装备前往现场，设立火场附近临时医疗点准备急救。'
      ],
      '保安': [
        '启动应急广播及手提喇叭，协助物业指引楼内居民有序撤离，优先老人、儿童及行动不便者。',
        '安排保安在主要出口、楼道拐角组织撤离、并在安全区域集合清点人数、控制现场秩序。'
      ],
      '物业': [
        '整理发放3号楼结构图、疏散通道、电源总闸等信息，并现场指引消防、医疗人员快速进入目标区域。',
        '启动社区紧急广播，统计并汇报各楼层已疏散/未撤离人数，协助安保和急救组锁定被困及危险人群。'
      ]
    },
    '阶段二': {
      '消防员': [
        '侦查组携空气呼吸器、热成像仪、应急照明沿疏散路线快速到达5层，配合水枪压制火源，优先清理救援通道。',
        '实施分批疏散，优先撤离5层被困人员并协同急救组转移伤员，同时根据沙尘暴及8级风力灵活调整救援策略，防控火势外延扩散。'
      ],
      '医生': [
        '一组随消防救援队待命火场内外并进行现场急救，另一组在建筑外急救区接收伤员，优先处理吸入性和烧伤患者。',
        '与医院和急救车密切协作，依据伤情分级送医，保证重伤员通道畅通，实时通报伤情及收治需求。'
      ],
      '保安': [
        '在外围设立警戒线，配合消防封锁危险区，严禁无关人员靠近现场，封控小区道路、辅助医疗车辆通行。',
        '协助物业持续清点疏散与被困人员，并针对围观、混乱等风险加强现场秩序维护，安抚群众情绪。'
      ],
      '物业': [
        '持续更新被困、已撤离和失联人员数据，动态传递给指挥中心和各救援队伍。',
        '指派专人陪同消防及医疗队入内救援，确保设备（如楼梯照明）、安全出口畅通，协助相关后勤调度（如担架取用、紧急断电等）。'
      ]
    },
    '阶段三': {
      '消防员': [
        '全面搜索5层及相邻楼层，确认无残留火点，防止复燃。',
        '协同物业和保安清理火场、评估结构安全性，对外通报火灾处置结果。'
      ],
      '医生': [
        '追踪受伤居民救治情况，参与卫生防疫，监测吸入性损伤并安排心理援助。',
        '整理伤员信息并与医院做好交接，为居民提供后续健康咨询与医疗指导。'
      ],
      '保安': [
        '协助清点最终在场人数，维护火灾现场秩序和受灾居民情绪，防止人员私自返回楼内。',
        '把控火场警戒范围，协助物业人员开展善后恢复与安全评估。'
      ],
      '物业': [
        '统计失踪、受伤、受灾情况，协助住户妥善安置，安排临时居住及物资发放。',
        '协调维修公司评估楼体损坏情况，跟进设施检修、清理及通风消杀等后续恢复工作，及时向住户和相关部门通报进展。'
      ]
    }
  });
  
  // 新增时间线相关的数据
  const timelineData = ref([]);
  const timelineDepartments = ref([]);
  const showDetails = reactive({});
  const loading = ref(false);
  
  // 新增时间线相关的方法
  const handleButtonClick = async () => {
    loading.value = true;
    try {
      await runPythonScript();
      await fetchTimelineData();
      console.log("数据已刷新");
    } catch (error) {
      console.error("刷新数据时发生错误", error);
    } finally {
      loading.value = false;
    }
  };
  
  const fetchTimelineData = () => {
    return axios.get("/api/get-timeline-detail")
      .then(response => {
        timelineData.value = [...response.data.timeline];
        timelineDepartments.value = [...response.data.departments];
      })
      .catch(error => {
        console.error("获取时间表数据失败：", error);
      });
  };
  
  const runPythonScript = () => {
    return axios.post("/api/refresh-response");
  };
  
  const toggleDetail = (rowIndex, department) => {
    const key = `${rowIndex}-${department}`;
    showDetails[key] = !showDetails[key];
  };
  
  const isShowingDetail = (rowIndex, department) => {
    const key = `${rowIndex}-${department}`;
    return showDetails[key];
  };
  
  // 更新时间
  onMounted(() => {
    setInterval(() => {
      currentTime.value = new Date().toLocaleString('zh-CN');
    }, 1000);
    
    // 新增：加载时间线数据
    fetchTimelineData();
  });
  
  // 获取部门对应的CSS类名
  function getDeptClass(dept) {
    switch(dept) {
      case '消防': return 'firefighter-dept';
      case '医院': return 'doctor-dept';
      case '安保': return 'security-dept';
      case '物业': return 'property-dept';
      default: return 'default-dept';
    }
  }
  </script>
  
  <style scoped>
  /* 基础样式 */
  .collaboration-matrix-system {
    min-height: 100vh;
    background-color: #f5f7fa;
    font-family: "PingFang SC", "Helvetica Neue", Helvetica, Arial, sans-serif;
  }
  
  /* 导航栏样式 */
  .nav-header {
    position: sticky;
    z-index: 1000;
    top: 0;
    padding: 0;
    background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
    box-shadow: 0 2px 12px rgb(0 0 0 / 10%);
  }
  
  .nav-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1400px;
    height: 60px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  .nav-brand h1 {
    margin: 0;
    color: white;
    font-size: 20px;
  }
  
  .nav-brand p {
    margin: 4px 0 0;
    color: rgb(255 255 255 / 80%);
    font-size: 12px;
  }
  
  .nav-menu {
    display: flex;
    gap: 20px;
  }
  
  .nav-item {
    position: relative;
    padding: 20px 15px;
    color: white;
    font-size: 14px;
    text-decoration: none;
  }
  
  .nav-item.active {
    background: rgb(255 255 255 / 10%);
  }
  
  .nav-item.active::after {
    content: '';
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 3px;
    background: white;
  }
  
  .system-status {
    display: flex;
    gap: 15px;
  }
  
  .status-indicator, .emergency-type {
    display: flex;
    align-items: center;
    padding: 4px 8px;
    border-radius: 12px;
    background: rgb(255 255 255 / 10%);
    color: white;
    font-size: 12px;
    gap: 5px;
  }
  
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #4caf50;
  }
  
  .status-dot.warning {
    background: #ff9800;
  }
  
  /* 主内容区域 */
  .main-content {
    max-width: 1400px;
    margin: 20px auto;
    padding: 0 20px;
  }
  
  /* 事件信息卡片 */
  .event-info-card {
    padding: 25px;
    margin-bottom: 30px;
    border-radius: 12px;
    background: white;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
  }
  
  .event-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #eaedf2;
  }
  
  .event-title h2 {
    margin: 0 0 8px 0;
    font-size: 24px;
    font-weight: 600;
    color: #1976d2;
    letter-spacing: -0.5px;
  }
  
  .event-time {
    font-size: 14px;
    color: #606266;
    font-weight: 500;
  }
  
  .event-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .event-tag {
    padding: 6px 12px;
    border-radius: 20px;
    background: #f0f7ff;
    color: #1976d2;
    font-size: 13px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 5px;
    box-shadow: 0 2px 5px rgba(25, 118, 210, 0.1);
    transition: all 0.2s ease;
  }
  
  .event-tag:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(25, 118, 210, 0.15);
  }
  
  .event-description {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }
  
  .info-item {
    background: #f8fafd;
    padding: 15px;
    border-radius: 10px;
    transition: all 0.2s ease;
  }
  
  .info-item:hover {
    background: #f0f7ff;
    transform: translateY(-2px);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
  }
  
  .info-label {
    font-weight: 600;
    color: #606266;
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
  }
  
  .info-value {
    color: #303133;
    font-size: 15px;
  }
  
  /* 阶段标签样式 */
  .phase-tabs-container {
    margin-bottom: 30px;
  }
  
  .phase-tabs {
    display: flex;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    background: white;
  }
  
  .phase-tab {
    flex: 1;
    padding: 20px 15px;
    position: relative;
    text-align: center;
    background-color: white;
    color: #606266;
    cursor: pointer;
    transition: all 0.3s ease;
    border-right: 1px solid #eaedf2;
  }
  
  .phase-tab:last-child {
    border-right: none;
  }
  
  .tab-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }
  
  .phase-number {
    font-size: 20px;
    font-weight: 700;
    color: #909399;
    transition: all 0.3s ease;
  }
  
  .phase-name {
    font-size: 14px;
    transition: all 0.3s ease;
  }
  
  .phase-tab.active {
    background-color: #f0f7ff;
  }
  
  .phase-tab.active .phase-number {
    color: #1976d2;
  }
  
  .phase-tab.active .phase-name {
    color: #1976d2;
    font-weight: 600;
  }
  
  .active-indicator {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: #1976d2;
  }
  
  /* 阶段描述样式 */
  .phase-description {
    margin-bottom: 30px;
    padding: 20px;
    border-radius: 12px;
    background-color: #f0f7ff;
    border-left: 4px solid #1976d2;
    box-shadow: 0 4px 12px rgba(25, 118, 210, 0.1);
  }
  
  .phase-description h3 {
    margin-top: 0;
    margin-bottom: 10px;
    color: #1976d2;
    font-size: 18px;
    font-weight: 600;
  }
  
  .phase-description p {
    margin: 0;
    color: #606266;
    line-height: 1.6;
  }
  
  /* 部门任务表格样式 */
  .department-tasks-table {
    margin-bottom: 30px;
    border-radius: 12px;
    background: white;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    overflow: hidden;
  }
  
  .task-table-header {
    padding: 20px 25px;
    background-color: #f8fafd;
    border-bottom: 1px solid #eaedf2;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .task-table-header h3 {
    margin: 0;
    color: #1976d2;
    font-size: 18px;
    font-weight: 600;
  }
  
  .current-phase-indicator {
    padding: 8px 15px;
    background-color: #f0f7ff;
    color: #1976d2;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .phase-dot {
    width: 8px;
    height: 8px;
    background: #1976d2;
    border-radius: 50%;
    display: block;
  }
  
  .task-table-body {
    display: flex;
    min-height: 400px;
  }
  
  .task-departments {
    width: 180px;
    background-color: #f8fafd;
    border-right: 1px solid #eaedf2;
  }
  
  .task-department-item {
    padding: 15px 20px;
    border-bottom: 1px solid #eaedf2;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
  }
  
  .task-department-item.active {
    background-color: #f0f7ff;
    font-weight: 600;
  }
  
  .task-department-item.active::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background-color: #1976d2;
  }
  
  .task-department-item:hover {
    background-color: #f0f7ff;
  }
  
  .dept-indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-right: 12px;
  }
  
  .task-department-item i {
    margin-left: auto;
    color: #1976d2;
    font-size: 14px;
  }
  
  .task-content-display {
    flex: 1;
    padding: 25px;
    background-color: white;
  }
  
  .task-content-card {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .task-content-header {
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #eaedf2;
  }
  
  .task-content-header h4 {
    margin: 0;
    font-size: 18px;
    display: flex;
    align-items: center;
    color: #303133;
  }
  
  .task-content-header span {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-right: 10px;
  }
  
  .task-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .task-item-row {
    display: flex;
    background-color: #f8fafd;
    padding: 15px;
    border-radius: 10px;
    transition: all 0.3s ease;
  }
  
  .task-item-row:hover {
    background-color: #f0f7ff;
    transform: translateX(5px);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
  }
  
  .task-number {
    width: 28px;
    height: 28px;
    background-color: #1976d2;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    margin-right: 15px;
    flex-shrink: 0;
  }
  
  .task-description {
    flex: 1;
    line-height: 1.6;
    color: #303133;
  }
  
  .select-department-prompt, .no-tasks-message {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #909399;
    font-size: 16px;
    background-color: #f8fafd;
    border-radius: 10px;
    padding: 30px;
    text-align: center;
    gap: 10px;
  }
  
  /* 新增时间线表格样式 */
  .timeline-matrix {
    margin-bottom: 30px;
    padding: 25px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
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
    position: relative;
  }
  
  .timeline-header h3:after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 40px;
    height: 3px;
    background: #1976d2;
    border-radius: 3px;
  }
  
  .refresh-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s ease;
    border-radius: 8px;
    padding: 10px 16px;
    font-weight: 500;
  }
  
  .refresh-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(25, 118, 210, 0.2);
  }
  
  .timeline-table {
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #eaedf2;
  }
  
  .time-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    color: #606266;
    font-weight: 600;
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
    overflow: hidden;
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
  
  .action-block:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.1);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .action-block:hover:after {
    opacity: 1;
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
  
  /* 优先级和资源区域 */
  .priority-resource-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 25px;
    margin-bottom: 30px;
  }
  
  .priority-card, .resource-card {
    padding: 0;
    border-radius: 12px;
    background: white;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    transition: all 0.3s ease;
  }
  
  .priority-card:hover, .resource-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
  
  .card-header {
    padding: 20px 25px;
    background-color: #f8fafd;
    border-bottom: 1px solid #eaedf2;
  }
  
  .card-header h3 {
    margin: 0;
    color: #1976d2;
    font-size: 18px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .priority-list {
    list-style: none;
    padding: 20px 25px;
    margin: 0;
  }
  
  .priority-item {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    padding: 12px 15px;
    border-radius: 10px;
    background: #f8fafd;
    transition: all 0.3s ease;
  }
  
  .priority-item:last-child {
    margin-bottom: 0;
  }
  
  .priority-item:hover {
    transform: translateX(8px);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
    background: #f0f7ff;
  }
  
  .priority-high, .priority-medium, .priority-low {
    display: inline-block;
    min-width: 48px;
    margin-right: 15px;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 13px;
    text-align: center;
    font-weight: 600;
  }
  
  .priority-high {
    background: #ffebee;
    color: #c62828;
  }
  
  .priority-medium {
    background: #fff3e0;
    color: #ef6c00;
  }
  
  .priority-low {
    background: #e8f5e9;
    color: #2e7d32;
  }
  
  .priority-text {
    font-size: 15px;
    color: #303133;
  }
  
  .resource-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    padding: 20px 25px;
  }
  
  .resource-item {
    display: flex;
    align-items: center;
    padding: 15px;
    border-radius: 10px;
    background: #f8fafd;
    transition: all 0.3s ease;
    gap: 15px;
  }
  
  .resource-item:hover {
    transform: translateY(-3px);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
    background: #f0f7ff;
  }
  
  .resource-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
    color: white;
    font-size: 22px;
    box-shadow: 0 4px 8px rgba(25, 118, 210, 0.2);
  }
  
  .resource-info {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  
  .resource-info strong {
    font-size: 15px;
    color: #303133;
    font-weight: 600;
  }
  
  .resource-status {
    font-size: 13px;
    color: #606266;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  
  /* 部门协同示意图样式 */
  .collaboration-diagram-section {
    padding: 0;
    border-radius: 12px;
    background: white;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    margin-bottom: 30px;
    overflow: hidden;
  }
  
  .section-header {
    padding: 20px 25px;
    background-color: #f8fafd;
    border-bottom: 1px solid #eaedf2;
  }
  
  .section-header h3 {
    margin: 0;
    color: #1976d2;
    font-size: 18px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .diagram-container {
    position: relative;
    height: 350px;
    padding: 20px;
  }
  
  .department-nodes {
    position: relative;
    width: 100%;
    height: 100%;
  }
  
  .dept-node {
    position: absolute;
    width: 110px;
    height: 110px;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    z-index: 2;
    cursor: pointer;
    transition: all 0.3s ease;
    gap: 8px;
  }
  
  .dept-node i {
    font-size: 24px;
  }
  
  .firefighter {
    top: 20px;
    left: 20%;
    background: linear-gradient(135deg, #e53935 0%, #c62828 100%);
  }
  
  .doctor {
    top: 20px;
    right: 20%;
    background: linear-gradient(135deg, #43a047 0%, #2e7d32 100%);
  }
  
  .security {
    bottom: 20px;
    left: 20%;
    background: linear-gradient(135deg, #1e88e5 0%, #1565c0 100%);
  }
  
  .property {
    bottom: 20px;
    right: 20%;
    background: linear-gradient(135deg, #fb8c00 0%, #ef6c00 100%);
  }
  
  .connection-lines {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  
  .dept-node:hover {
    transform: scale(1.08);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }
  
  /* 部门职责显示区域样式 */
  .dept-responsibilities {
    margin: 0 20px 20px;
    padding: 20px;
    border-radius: 10px;
    background-color: #f8fafd;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    animation: slideIn 0.3s ease;
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .dept-responsibilities-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid #eaedf2;
  }
  
  .dept-responsibilities-header h4 {
    margin: 0;
    font-size: 18px;
    display: flex;
    align-items: center;
    color: #303133;
  }
  
  .dept-responsibilities-header span {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-right: 10px;
  }
  
  .close-btn {
    background: none;
    border: none;
    font-size: 22px;
    color: #909399;
    cursor: pointer;
    padding: 0 5px;
    transition: all 0.2s ease;
  }
  
  .close-btn:hover {
    color: #303133;
    transform: rotate(90deg);
  }
  
  .responsibilities-content {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .phase-responsibilities {
    background-color: white;
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
  }
  
  .phase-responsibilities:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
  
  .phase-responsibilities h5 {
    margin-top: 0;
    margin-bottom: 12px;
    color: #1976d2;
    font-size: 16px;
    font-weight: 600;
  }
  
  .phase-responsibilities ul {
    margin: 0;
    padding-left: 25px;
  }
  
  .phase-responsibilities li {
    margin-bottom: 10px;
    line-height: 1.6;
    color: #303133;
  }
  
  .phase-responsibilities li:last-child {
    margin-bottom: 0;
  }
  
  /* 响应式设计 */
  @media (max-width: 1024px) {
    .priority-resource-grid {
      grid-template-columns: 1fr;
    }
    
    .resource-list {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (max-width: 768px) {
    .event-description {
      grid-template-columns: 1fr;
    }
    
    .resource-list {
      grid-template-columns: 1fr;
    }
    
    .dept-node {
      width: 90px;
      height: 90px;
      font-size: 14px;
    }
    
    .nav-container {
      flex-direction: column;
      height: auto;
      padding: 10px;
    }
    
    .nav-menu {
      margin: 10px 0;
    }
  }
  </style>