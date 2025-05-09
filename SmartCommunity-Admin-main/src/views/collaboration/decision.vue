<template>
  <div class="fire-monitoring-system">
    <!-- 导航栏 -->
    <div class="nav-header">
      <div class="nav-container">
        <div class="nav-brand">
          <div>
            <h1>智能火灾检测与多方协同决策系统</h1>
            <p>实时监控 · 智能预警 · 协同决策</p>
          </div>
        </div>
        <div class="nav-menu">
          <a href="#" class="nav-item active">监控中心</a>
          <a href="#" class="nav-item">历史记录</a>
          <a href="#" class="nav-item">系统设置</a>
        </div>
        <div class="system-status">
          <div class="status-indicator">
            <div class="status-dot" />
            系统正常
          </div>
          <div class="status-indicator">
            <div class="status-dot warning" />
            <select v-model="selectedModel" class="model-select" @change="handleModelChange">
              <option value="">请选择模型</option>
              <option v-for="model in modelList" :key="model.value" :value="model.value">
                {{ model.label }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="main-content">
      <div class="content-grid">
        <!-- 左侧面板 -->
        <div class="left-panel">
          <div class="alert-card">
            <div class="camera-alert">
              <span>⚠️ 摄像头#A-23检测到火情！</span>
              <span>时间：{{ currentTime }}</span>
            </div>

            <div class="camera-feed">
              <div class="alert-overlay">火灾警报！</div>
              <img
                src="https://pic.nfapp.southcn.com/nfplus/ossfs/pic/xy/202211/26/b3ee569e-b4e0-4aa6-9af2-f1346e1720d4.jpeg?x-oss-process=style/w640"
                alt="监控画面"
                @error="handleImageError"
              />
            </div>

            <div class="detection-info">
              <h3>AI识别结果</h3>
              <div class="detection-details">
                <div class="detail-item"> <strong>位置：</strong> 6号楼2单元 </div>
                <div class="detail-item"> <strong>火势等级：</strong> 中度 </div>
                <div class="detail-item"> <strong>蔓延风险：</strong> 高 </div>
                <div class="detail-item"> <strong>烟雾浓度：</strong> 75% </div>
              </div>
            </div>
          </div>

          <!-- 思考过程展示区域 -->
          <div v-if="displayedThinkContent" class="think-card">
            <h3>AI思考过程</h3>
            <div class="think-content">
              <pre>{{ displayedThinkContent }}</pre>
            </div>
          </div>
        </div>

        <!-- 右侧面板 -->
        <div class="right-panel">
          <!-- 思考中的占位内容 -->
          <div v-if="!thinkingCompleted" class="thinking-placeholder">
            <div class="thinking-indicator">
              <div class="thinking-dot" />
              <div class="thinking-dot" />
              <div class="thinking-dot" />
            </div>
            <h3>AI正在思考决策方案...</h3>
            <p>正在分析火情数据并制定最佳应对策略</p>
            <div class="thinking-progress">
              <div
                class="thinking-bar"
                :style="{ width: (displayedThinkContent.length / thinkContent.length) * 100 + '%' }"
              />
            </div>
          </div>

          <!-- 决策内容 - 使用过渡效果 -->
          <transition name="fade">
            <div v-if="thinkingCompleted" class="decision-content">
              <div class="decision-card">
                <h3>部门决策进展</h3>
                <div class="departments-grid">
                  <div v-for="dept in departments" :key="dept.id" class="department-decision">
                    <div class="decision-header">
                      <h4>{{ dept.name }}</h4>
                      <span :class="['decision-status', dept.statusClass]">{{
                        dept.statusText
                      }}</span>
                    </div>
                    <div class="decision-progress">
                      <div class="progress-bar" :style="{ width: dept.progress + '%' }" />
                    </div>
                    <p>{{ dept.message }}</p>
                  </div>
                </div>
              </div>

              <div v-if="showFinalDecision" class="final-decision">
                <h3>综合决策方案</h3>
                <div class="priority-list">
                  <h4>优先级排序：</h4>
                  <ul>
                    <li
                      v-for="(action, index) in visiblePriorityActions"
                      :key="index"
                      class="priority-action-item"
                      :class="{ 'fade-in': true }"
                    >
                      <span :class="['priority-tag', action.priorityClass]">{{
                        action.priority
                      }}</span>
                      {{ action.content }}
                    </li>
                  </ul>
                </div>

                <div v-if="showResources" class="resource-allocation">
                  <h4>资源调配：</h4>
                  <div class="resource-grid">
                    <div
                      v-for="resource in visibleResources"
                      :key="resource.id"
                      class="resource-item"
                      :class="{ 'fade-in': true }"
                    >
                      <div class="resource-icon">{{ resource.icon }}</div>
                      <div class="resource-info">
                        <strong>{{ resource.name }}</strong>
                        <span>{{ resource.status }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, onUnmounted } from 'vue';

  const currentTime = ref(new Date().toLocaleString('zh-CN'));
  const fallbackImage = ref('/assets/images/fallback.jpg');
  const thinkContent = ref(''); // 存储<think>标签内容
  const displayedThinkContent = ref(''); // 用于逐字显示的内容
  let typingTimer = null;
  const thinkingCompleted = ref(false); // 新增：标记思考过程是否完成

  // 加载并解析<think>内容
  const loadThinkContent = async () => {
    try {
      const response = await fetch('/ds-r1输出结果.txt');
      const text = await response.text();

      // 提取<think>标签中的内容
      const thinkMatch = text.match(/<think>([\s\S]*?)<\/think>/);
      if (thinkMatch) {
        thinkContent.value = thinkMatch[1].trim();
        console.log('成功提取think内容');
        startTypingEffect(); // 开始逐字显示效果
      } else {
        console.error('未找到<think>标签内容');
        thinkingCompleted.value = true; // 如果没有思考内容，也标记为完成
      }
    } catch (error) {
      console.error('加载think内容失败:', error);
      thinkingCompleted.value = true; // 出错时也标记为完成
    }
  };

  // 实现逐字显示效果
  const startTypingEffect = () => {
    let index = 0;
    const fullText = thinkContent.value;
    displayedThinkContent.value = '';
    thinkingCompleted.value = false; // 重置思考完成状态

    clearInterval(typingTimer);

    typingTimer = setInterval(() => {
      if (index < fullText.length) {
        displayedThinkContent.value += fullText.charAt(index);
        index++;
      } else {
        clearInterval(typingTimer);
        thinkingCompleted.value = true; // 标记思考过程完成
        console.log('AI思考过程展示完毕，开始加载决策内容');
        loadModelOutput(); // 思考完成后加载模型输出
      }
    }, 20); // 调整速度，数值越小越快
  };

  // 解析模型输出的函数
  const parseModelOutput = (outputText) => {
    try {
      const contentMatch = outputText.match(/content='([^']+)'/);
      if (!contentMatch) {
        console.error('无法找到content内容');
        return null;
      }

      const content = contentMatch[1].replace(/\\n/g, '\n');
      console.log('提取的content:', content);

      // 添加调试日志
      console.log('开始解析文本:', content);

      const timelineRegex = /(\d+)-(\d+)\s*分钟：([^。]+)/g;
      const timelineData = {};
      let match;

      // 预定义所有部门及其初始状态
      const departments = ['消防员', '医生', '社区安保人员', '社区物业人员'];

      // 初始化每个部门的时间线
      departments.forEach((dept) => {
        timelineData[dept] = {
          0: '待命准备中',
        };
      });

      // 解析每个时间段的行动
      while ((match = timelineRegex.exec(content)) !== null) {
        const [_, startTime, endTime, actionText] = match;
        const timePoint = parseInt(startTime);

        // 添加调试日志
        console.log(`处理时间点 ${timePoint}:`, actionText);

        departments.forEach((dept) => {
          if (actionText.includes(dept)) {
            console.log(`在时间点 ${timePoint} 找到部门 ${dept} 的行动:`, actionText);
            timelineData[dept][timePoint] = actionText.trim();
          } else {
            const prevTimePoints = Object.keys(timelineData[dept])
              .map(Number)
              .filter((t) => t < timePoint);

            if (prevTimePoints.length > 0) {
              const lastTimePoint = Math.max(...prevTimePoints);
              timelineData[dept][timePoint] = timelineData[dept][lastTimePoint];
            }
          }
        });
      }

      // 确保最后一个时间段的物业人员状态被正确设置
      if (timelineData['社区物业人员']) {
        const lastTimePoint = 15; // 最后一个时间段的开始时间
        const lastAction = '社区物业人员协助安保人员维持秩序，同时为其他人员提供资源支持';
        timelineData['社区物业人员'][lastTimePoint] = lastAction;
      }

      console.log('最终解析的时序数据:', timelineData);
      return timelineData;
    } catch (error) {
      console.error('解析模型输出失败:', error);
      return null;
    }
  };

  // 部门数据
  const departments = ref([
    {
      id: 1,
      name: '消防员',
      statusClass: 'status-pending',
      statusText: '待响应',
      progress: 0,
      message: '等待响应...',
    },
    {
      id: 2,
      name: '医生',
      statusClass: 'status-pending',
      statusText: '待响应',
      progress: 0,
      message: '等待响应...',
    },
    {
      id: 3,
      name: '社区安保人员',
      statusClass: 'status-pending',
      statusText: '待响应',
      progress: 0,
      message: '等待响应...',
    },
    {
      id: 4,
      name: '社区物业人员',
      statusClass: 'status-pending',
      statusText: '待响应',
      progress: 0,
      message: '等待响应...',
    },
  ]);

  // 优先级行动
  const priorityActions = ref([
    {
      priority: '紧急',
      priorityClass: 'priority-high',
      content: '疏散被困人员',
    },
    {
      priority: '紧急',
      priorityClass: 'priority-high',
      content: '控制火源蔓延',
    },
    {
      priority: '中等',
      priorityClass: 'priority-medium',
      content: '保护周边财产',
    },
    {
      priority: '常规',
      priorityClass: 'priority-low',
      content: '记录损失情况',
    },
  ]);

  // 资源配置
  const resources = ref([
    {
      id: 1,
      name: '消防车',
      icon: '🚒',
      status: '2辆 已调派',
    },
    {
      id: 2,
      name: '救护车',
      icon: '🚑',
      status: '1辆 待命',
    },
    {
      id: 3,
      name: '安保人员',
      icon: '👮',
      status: '4名 现场',
    },
    {
      id: 4,
      name: '志愿者',
      icon: '👥',
      status: '6名 待命',
    },
  ]);

  // 图片错误处理
  const handleImageError = (e) => {
    e.target.src = fallbackImage.value;
  };

  // 控制综合决策方案的显示
  const showFinalDecision = ref(false);
  const showResources = ref(false);
  const visiblePriorityActions = ref([]);
  const visibleResources = ref([]);
  const timelineData = ref({});

  // 修改模拟决策过程
  const simulateDecisionProcess = () => {
    const timePoints = [0, 5, 10, 15, 20];

    timePoints.forEach((time, index) => {
      setTimeout(() => {
        departments.value.forEach((dept) => {
          const action = timelineData.value[dept.name]?.[time];

          // 如果有新的行动，更新消息
          if (action) {
            dept.message = action;
          }

          // 更新状态和进度
          if (index === timePoints.length - 1) {
            // 最后一个时间点，所有部门都完成
            dept.statusClass = 'status-completed';
            dept.statusText = '已完成';
            dept.progress = 100;
          } else if (action) {
            // 有行动的部门设为处理中
            dept.statusClass = 'status-processing';
            dept.statusText = '处理中';
            dept.progress = Math.min((index + 1) * 25, 100);
          } else if (dept.statusClass === 'status-processing') {
            // 已经在处理中的部门继续更新进度
            dept.progress = Math.min((index + 1) * 25, 100);
          }
        });

        if (index === 0) {
          showFinalDecision.value = true;
        }

        if (index === 1) {
          showResources.value = true;
        }

        // 逐步显示优先级行动
        visiblePriorityActions.value = priorityActions.value.slice(0, index + 1);
        // 逐步显示资源
        visibleResources.value = resources.value.slice(0, index + 1);
      }, index * 2000);
    });
  };

  // 修改加载模型输出的函数
  const loadModelOutput = async () => {
    try {
      const response = await fetch('/model_output.txt');
      const text = await response.text();
      const parsedData = parseModelOutput(text);
      if (parsedData) {
        timelineData.value = parsedData;
        simulateDecisionProcess();
      }
    } catch (error) {
      console.error('加载模型输出文件失败:', error);
    }
  };

  // 更新时间
  let timeInterval = setInterval(() => {
    currentTime.value = new Date().toLocaleString('zh-CN');
  }, 1000);

  onMounted(() => {
    // 先只加载思考内容，不加载模型输出
    loadThinkContent();
  });

  onUnmounted(() => {
    if (timeInterval) {
      clearInterval(timeInterval);
    }
    if (typingTimer) {
      clearInterval(typingTimer);
    }
  });

  // 模型选择相关数据和方法
  const selectedModel = ref('');
  const modelList = ref([
    { label: 'Claude3.5', value: 'yolov5' },
    { label: 'gpt-4o', value: 'yolov7' },
    { label: 'gpt-4', value: 'ssd' },
    { label: 'gpt-o1', value: 'faster-rcnn' },
  ]);

  const handleModelChange = () => {
    console.log('选择的模型：', selectedModel.value);
    // 这里可以添加模型切换的具体逻辑
  };
</script>

<style scoped>
  @keyframes fade-in-up {
    from {
      transform: translateY(20px);
      opacity: 0;
    }

    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes blink {
    0% {
      opacity: 1;
    }

    50% {
      opacity: 0.7;
    }

    100% {
      opacity: 1;
    }
  }

  @keyframes flash {
    0% {
      opacity: 1;
    }

    50% {
      opacity: 0.5;
    }

    100% {
      opacity: 1;
    }
  }

  @keyframes thinking-pulse {
    0%,
    100% {
      transform: scale(0.8);
      opacity: 0.5;
    }

    50% {
      transform: scale(1.2);
      opacity: 1;
    }
  }

  @media (max-width: 1024px) {
    .content-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .nav-container {
      flex-direction: column;
      height: auto;
      padding: 10px;
    }

    .nav-menu {
      margin: 10px 0;
    }

    .detection-details {
      grid-template-columns: 1fr;
    }

    .resource-grid {
      grid-template-columns: 1fr;
    }
  }

  .fire-monitoring-system {
    min-height: 100vh;
    background-color: #f5f7fa;
  }

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

  .status-indicator {
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

  .main-content {
    max-width: 1400px;
    margin: 20px auto;
    padding: 0 20px;
  }

  .content-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 20px;
  }

  .alert-card {
    padding: 20px;
    border-radius: 8px;
    background: white;
    box-shadow: 0 2px 12px rgb(0 0 0 / 10%);
  }

  .camera-alert {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    padding: 15px;
    animation: blink 2s infinite;
    border-radius: 8px;
    background: #d32f2f;
    color: white;
  }

  .camera-feed {
    position: relative;
    height: 300px;
    margin-bottom: 20px;
    overflow: hidden;
    border-radius: 8px;
  }

  .camera-feed img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .alert-overlay {
    display: flex;
    position: absolute;
    inset: 0;
    align-items: center;
    justify-content: center;
    animation: flash 1s infinite;
    background: rgb(255 0 0 / 30%);
    color: white;
    font-size: 24px;
    font-weight: bold;
  }

  .detection-info {
    padding: 15px;
    border-radius: 8px;
    background: #1a237e;
    color: white;
  }

  .detection-details {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-top: 10px;
  }

  .detail-item {
    padding: 8px;
    border-radius: 4px;
    background: rgb(255 255 255 / 10%);
  }

  .department-decision {
    margin-bottom: 15px;
    padding: 15px;
    border-radius: 8px;
    background: white;
    box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
  }

  .decision-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .decision-header h4 {
    margin: 0;
  }

  .decision-status {
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 12px;
  }

  .status-received {
    background: #e8f5e9;
    color: #2e7d32;
  }

  .status-processing {
    background: #e3f2fd;
    color: #1565c0;
  }

  .decision-progress {
    height: 4px;
    margin: 8px 0;
    border-radius: 2px;
    background: #e0e0e0;
  }

  .progress-bar {
    height: 100%;
    transition: width 0.3s ease;
    border-radius: 2px;
    background: #4caf50;
  }

  .final-decision {
    margin-top: 20px;
    padding: 20px;
    border-radius: 8px;
    background: white;
    box-shadow: 0 2px 12px rgb(0 0 0 / 10%);
  }

  .priority-tag {
    display: inline-block;
    margin-right: 8px;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
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

  .resource-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-top: 15px;
  }

  .resource-item {
    display: flex;
    align-items: center;
    padding: 10px;
    transform: translateY(20px);
    border-radius: 8px;
    opacity: 0;
    background: #f8fafd;
    gap: 10px;
  }

  .resource-item.fade-in {
    animation: fade-in-up 0.5s ease forwards;
  }

  .resource-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #e3f2fd;
  }

  .resource-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  /* 添加新的状态样式 */
  .status-pending {
    background: #f5f5f5;
    color: #757575;
  }

  /* 添加动画样式 */
  .priority-action-item {
    transform: translateY(20px);
    opacity: 0;
  }

  .priority-action-item.fade-in {
    animation: fade-in-up 0.5s ease forwards;
  }

  /* 确保列表项的过渡效果平滑 */
  .priority-list ul {
    padding: 0;
    list-style: none;
  }

  .priority-list li {
    margin-bottom: 10px;
  }

  .model-select {
    margin-left: 10px;
    padding: 5px 10px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    outline: none;
    background-color: #fff;
    color: #606266;
    font-size: 14px;
  }

  .model-select:hover {
    border-color: #c0c4cc;
  }

  .model-select:focus {
    border-color: #409eff;
  }

  /* 思考过程卡片样式 */
  .think-card {
    margin-top: 20px;
    padding: 20px;
    border-radius: 8px;
    background: white;
    box-shadow: 0 2px 12px rgb(0 0 0 / 10%);
  }

  .think-content {
    max-height: 300px;
    padding: 15px;
    overflow-y: auto;
    border-radius: 8px;
    background: #f8f9fa;
    font-family: monospace;
    white-space: pre-wrap;
  }

  .think-content pre {
    margin: 0;
    word-break: break-word;
    white-space: pre-wrap;
  }

  /* 思考中占位内容样式 */
  .thinking-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    padding: 20px;
    border-radius: 8px;
    background: white;
    box-shadow: 0 2px 12px rgb(0 0 0 / 10%);
    text-align: center;
  }

  .thinking-indicator {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
  }

  .thinking-dot {
    width: 12px;
    height: 12px;
    animation: thinking-pulse 1.4s infinite ease-in-out;
    border-radius: 50%;
    background-color: #1976d2;
  }

  .thinking-dot:nth-child(2) {
    animation-delay: 0.2s;
  }

  .thinking-dot:nth-child(3) {
    animation-delay: 0.4s;
  }

  .thinking-placeholder h3 {
    margin: 0 0 10px;
    color: #1976d2;
  }

  .thinking-placeholder p {
    margin: 0 0 20px;
    color: #666;
  }

  .thinking-progress {
    width: 100%;
    height: 4px;
    margin-top: 20px;
    overflow: hidden;
    border-radius: 2px;
    background: #e0e0e0;
  }

  .thinking-bar {
    height: 100%;
    transition: width 0.3s ease;
    background: linear-gradient(90deg, #1976d2, #64b5f6);
  }

  /* 过渡效果 */
  .fade-enter-active,
  .fade-leave-active {
    transition:
      opacity 0.5s ease,
      transform 0.5s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    transform: translateY(20px);
    opacity: 0;
  }

  /* 决策内容容器 */
  .decision-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
</style>
