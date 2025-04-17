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
        <!-- 事件信息卡片 -->
        <div class="event-info-card">
          <div class="event-header">
            <div class="event-title">
              <h2>阳光花园小区火灾事件</h2>
              <span class="event-time">{{ currentTime }}</span>
            </div>
            <div class="event-tags">
              <span class="event-tag">沙尘暴</span>
              <span class="event-tag">风力8级</span>
              <span class="event-tag">中度火势</span>
              <span class="event-tag">约10人被困</span>
            </div>
          </div>
          <div class="event-description">
            <p><strong>火灾发生地点：</strong>阳光花园小区，3号楼，5楼</p>
            <p><strong>火势等级：</strong>中度（黑烟明显，有明火）</p>
            <p><strong>报警来源：</strong>烟感报警器 + 居民电话报警</p>
            <p><strong>时间：</strong>2025年4月15日 08:32</p>
            <p><strong>天气：</strong>沙尘暴，风力8级</p>
            <p><strong>人员情况：</strong>楼内可能有10人被困</p>
          </div>
        </div>
  
        <!-- 阶段标签导航 -->
        <div class="phase-tabs">
          <div
            v-for="(phaseName, phaseKey) in phaseNames"
            :key="phaseKey"
            :class="['phase-tab', { active: activePhase === phaseKey }]"
            @click="activePhase = phaseKey"
          >
            {{ phaseName }}
          </div>
        </div>
  
        <!-- 阶段描述 -->
        <div class="phase-description">
          <h3>{{ phaseDescriptions[activePhase].title }}</h3>
          <p>{{ phaseDescriptions[activePhase].description }}</p>
        </div>
  
        <!-- 添加部门职责表格组件 -->
        <div class="department-tasks-table">
          <div class="task-table-header">
            <h3>各部门阶段职责表</h3>
            <div class="current-phase-indicator">当前阶段：{{ phaseNames[activePhase] }}</div>
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
                请点击左侧部门查看职责
              </div>
            </div>
          </div>
        </div>
  
        
  
        <!-- 优先级和资源显示区域 -->
        <div class="priority-resource-grid">
          <div class="priority-card">
            <h3>任务优先级</h3>
            <ul class="priority-list">
              <li><span class="priority-high">紧急</span> 疏散被困人员</li>
              <li><span class="priority-high">紧急</span> 控制火源蔓延</li>
              <li><span class="priority-medium">中等</span> 保护周边财产</li>
              <li><span class="priority-low">常规</span> 记录损失情况</li>
            </ul>
          </div>
          <div class="resource-card">
            <h3>资源配置</h3>
            <div class="resource-list">
              <div class="resource-item">
                <div class="resource-icon">🚒</div>
                <div class="resource-info">
                  <strong>消防车</strong>
                  <span>2辆 已调派</span>
                </div>
              </div>
              <div class="resource-item">
                <div class="resource-icon">🚑</div>
                <div class="resource-info">
                  <strong>救护车</strong>
                  <span>1辆 待命</span>
                </div>
              </div>
              <div class="resource-item">
                <div class="resource-icon">👮</div>
                <div class="resource-info">
                  <strong>安保人员</strong>
                  <span>4名 现场</span>
                </div>
              </div>
              <div class="resource-item">
                <div class="resource-icon">👥</div>
                <div class="resource-info">
                  <strong>志愿者</strong>
                  <span>6名 待命</span>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- 部门协同示意图 -->
        <div class="collaboration-diagram-section">
          <h3>部门协同示意图</h3>
          <div class="diagram-container">
            <div class="department-nodes">
              <div class="dept-node firefighter" @click="showDeptResponsibilities('消防员')">消防员</div>
              <div class="dept-node doctor" @click="showDeptResponsibilities('医生')">医生</div>
              <div class="dept-node security" @click="showDeptResponsibilities('保安')">保安</div>
              <div class="dept-node property" @click="showDeptResponsibilities('物业')">物业</div>
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
  
  // 更新时间
  onMounted(() => {
    setInterval(() => {
      currentTime.value = new Date().toLocaleString('zh-CN');
    }, 1000);
  });
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
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 8px;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .event-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }
  
  .event-title {
    display: flex;
    flex-direction: column;
  }
  
  .event-title h2 {
    margin: 0;
    font-size: 22px;
    color: #1976d2;
  }
  
  .event-time {
    font-size: 14px;
    color: #666;
  }
  
  .event-tags {
    display: flex;
    gap: 8px;
  }
  
  .event-tag {
    padding: 4px 10px;
    border-radius: 16px;
    background: #e3f2fd;
    color: #1976d2;
    font-size: 12px;
  }
  
  .event-description {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 15px;
  }
  
  .event-description p {
    margin: 0;
    padding: 10px;
    border-radius: 6px;
    background: #f5f7fa;
  }
  
  /* 阶段标签样式 */
  .phase-tabs {
    display: flex;
    margin-bottom: 20px;
    border-radius: 4px;
    overflow: hidden;
  }
  
  .phase-tab {
    flex: 1;
    padding: 15px;
    text-align: center;
    background-color: #e0e0e0;
    color: #555;
    cursor: pointer;
    transition: all 0.3s ease;
    border-right: 1px solid rgba(0, 0, 0, 0.1);
  }
  
  .phase-tab:first-child {
    border-radius: 4px 0 0 4px;
  }
  
  .phase-tab:last-child {
    border-radius: 0 4px 4px 0;
    border-right: none;
  }
  
  .phase-tab.active {
    background-color: #1976d2;
    color: white;
  }
  
  /* 阶段描述样式 */
  .phase-description {
    margin-bottom: 20px;
    padding: 15px;
    border-radius: 8px;
    background-color: #f0f8ff;
    border-left: 4px solid #1976d2;
  }
  
  .phase-description h3 {
    margin-top: 0;
    margin-bottom: 10px;
    color: #1976d2;
  }
  
  .phase-description p {
    margin: 0;
    color: #555;
    line-height: 1.5;
  }
  
  /* 部门任务矩阵样式 */
  .department-matrix {
    display: flex;
    margin-bottom: 30px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .department-sidebar {
    width: 150px;
    background-color: #f5f5f5;
    border-right: 1px solid #e0e0e0;
  }
  
  .department-header {
    padding: 15px;
    background-color: #1976d2;
    color: white;
    font-weight: bold;
    text-align: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .department-item {
    padding: 20px 15px;
    border-bottom: 1px solid #e0e0e0;
    background-color: #f9f9f9;
    font-weight: bold;
    color: #333;
  }
  
  .tasks-container {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  .department-tasks {
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .department-tasks:last-child {
    border-bottom: none;
  }
  
  .task-content {
    flex: 1;
    background-color: white;
  }
  
  .task-item {
    padding: 20px;
    border-bottom: 1px solid #f0f0f0;
    color: #333;
    line-height: 1.5;
  }
  
  .task-item:last-child {
    border-bottom: none;
  }
  
  /* 优先级和资源区域 */
  .priority-resource-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 30px;
  }
  
  .priority-card, .resource-card {
    padding: 20px;
    border-radius: 8px;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .priority-card h3, .resource-card h3 {
    margin-top: 0;
    margin-bottom: 15px;
    color: #1976d2;
    font-size: 18px;
    position: relative;
  }
  
  .priority-card h3::after, .resource-card h3::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -5px;
    width: 50px;
    height: 3px;
    background-color: #1976d2;
  }
  
  .priority-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .priority-list li {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    padding: 10px 15px;
    border-radius: 6px;
    background: #f8f9fa;
    transition: all 0.2s ease;
  }
  
  .priority-list li:hover {
    transform: translateX(5px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  }
  
  .priority-high, .priority-medium, .priority-low {
    display: inline-block;
    min-width: 45px;
    margin-right: 12px;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 12px;
    text-align: center;
    font-weight: bold;
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
  
  .resource-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  .resource-item {
    display: flex;
    align-items: center;
    padding: 15px;
    border-radius: 8px;
    background: #f8f9fa;
    transition: all 0.2s ease;
    gap: 12px;
  }
  
  .resource-item:hover {
    transform: translateY(-3px);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  }
  
  .resource-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #1976d2;
    color: white;
    font-size: 20px;
  }
  
  .resource-info {
    display: flex;
    flex-direction: column;
  }
  
  .resource-info strong {
    font-size: 15px;
    color: #333;
    margin-bottom: 4px;
  }
  
  .resource-info span {
    font-size: 13px;
    color: #666;
  }
  
  /* 部门协同示意图样式 */
  .collaboration-diagram-section {
    padding: 25px;
    border-radius: 8px;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 30px;
  }
  
  .collaboration-diagram-section h3 {
    margin-top: 0;
    margin-bottom: 20px;
    color: #1976d2;
    text-align: center;
    font-size: 18px;
  }
  
  .diagram-container {
    position: relative;
    height: 300px;
  }
  
  .department-nodes {
    position: relative;
    width: 100%;
    height: 100%;
  }
  
  .dept-node {
    position: absolute;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    z-index: 2;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .firefighter {
    top: 20px;
    left: 20%;
    background: #e53935;
  }
  
  .doctor {
    top: 20px;
    right: 20%;
    background: #43a047;
  }
  
  .security {
    bottom: 20px;
    left: 20%;
    background: #1e88e5;
  }
  
  .property {
    bottom: 20px;
    right: 20%;
    background: #fb8c00;
  }
  
  .connection-lines {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  
  /* 部门职责显示区域样式 */
  .dept-responsibilities {
    margin-top: 20px;
    padding: 20px;
    border-radius: 8px;
    background-color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }
  
  .dept-responsibilities-header h4 {
    margin: 0;
    font-size: 18px;
    display: flex;
    align-items: center;
  }
  
  .dept-responsibilities-header span {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-right: 8px;
  }
  
  .firefighter-color {
    background-color: #e53935;
  }
  
  .doctor-color {
    background-color: #43a047;
  }
  
  .security-color {
    background-color: #1e88e5;
  }
  
  .property-color {
    background-color: #fb8c00;
  }
  
  .close-btn {
    background: none;
    border: none;
    font-size: 20px;
    color: #999;
    cursor: pointer;
    padding: 0 5px;
  }
  
  .close-btn:hover {
    color: #333;
  }
  
  .responsibilities-content {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .phase-responsibilities {
    background-color: #f9f9f9;
    padding: 15px;
    border-radius: 6px;
  }
  
  .phase-responsibilities h5 {
    margin-top: 0;
    margin-bottom: 10px;
    color: #1976d2;
    font-size: 16px;
  }
  
  .phase-responsibilities ul {
    margin: 0;
    padding-left: 20px;
  }
  
  .phase-responsibilities li {
    margin-bottom: 8px;
    line-height: 1.5;
    color: #333;
  }
  
  .phase-responsibilities li:last-child {
    margin-bottom: 0;
  }
  
  /* 部门节点悬停效果 */
  .dept-node:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
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
    
    .department-matrix {
      flex-direction: column;
    }
    
    .department-sidebar {
      width: 100%;
      border-right: none;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .department-item {
      padding: 10px 15px;
    }
    
    .dept-node {
      width: 80px;
      height: 80px;
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
  
  /* 部门任务表格样式 */
  .department-tasks-table {
    margin-bottom: 30px;
    border-radius: 8px;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .task-table-header {
    padding: 15px 20px;
    background-color: #f5f7fa;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .task-table-header h3 {
    margin: 0;
    color: #1976d2;
    font-size: 18px;
  }
  
  .current-phase-indicator {
    padding: 5px 12px;
    background-color: #e3f2fd;
    color: #1976d2;
    border-radius: 16px;
    font-size: 14px;
    font-weight: 600;
  }
  
  .task-table-body {
    display: flex;
    min-height: 350px;
  }
  
  .task-departments {
    width: 160px;
    background-color: #f5f5f5;
    border-right: 1px solid #e0e0e0;
  }
  
  .task-department-item {
    padding: 15px;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
  }
  
  .task-department-item.active {
    background-color: #e3f2fd;
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
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 10px;
  }
  
  .task-content-display {
    flex: 1;
    padding: 20px;
    background-color: white;
  }
  
  .task-content-card {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .task-content-header {
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }
  
  .task-content-header h4 {
    margin: 0;
    font-size: 16px;
    display: flex;
    align-items: center;
    color: #333;
  }
  
  .task-content-header span {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-right: 8px;
  }
  
  .task-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .task-item-row {
    display: flex;
    background-color: #f9f9f9;
    padding: 15px;
    border-radius: 6px;
    transition: all 0.2s ease;
  }
  
  .task-item-row:hover {
    background-color: #f0f7ff;
    transform: translateX(5px);
  }
  
  .task-number {
    width: 24px;
    height: 24px;
    background-color: #1976d2;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    margin-right: 12px;
    flex-shrink: 0;
  }
  
  .task-description {
    flex: 1;
    line-height: 1.5;
  }
  
  .select-department-prompt, .no-tasks-message {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    font-size: 15px;
    background-color: #f9f9f9;
    border-radius: 6px;
    padding: 20px;
    text-align: center;
  }
  </style>