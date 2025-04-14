<template>
  <div class="page-container">
    <div v-if="screenshot" ref="imageContainer" class="image-container">
      <!-- 内层容器，支持缩放和拖动 -->
      <div
        class="inner-container"
        :style="innerContainerStyle"
        @wheel.prevent="handleWheel"
        @mousedown="handleMouseDown"
        @mouseup="handleMouseUp"
        @mouseleave="handleMouseUp"
        @click="handleImageClick"
      >
        <!-- 显示后端传来的仿真截图 -->
        <img v-if="screenshot" ref="screenshotImg" :src="screenshot" alt="Simulation Screenshot" />
        <!-- 起点标记 -->
        <div v-if="startPixel" class="marker start-marker" :style="markerStyle(startPixel)">
          S
        </div>
        <!-- 终点标记 -->
        <div v-if="endPixel" class="marker end-marker" :style="markerStyle(endPixel)"> E </div>
      </div>
    </div>
    <div v-else class="loading-text">{{ loadingText }}</div>
    <div v-if="screenshot" class="buttons">
      <span style="margin-right: 8px; color: #666; font-size: 14px">Algorithm:</span>
      <select v-model="algorithm" style="width: 120px; margin-right: 10px; padding: 5px">
        <option value="Dijkstra">Dijkstra</option>
        <option value="QMix">QMix</option>
        <option value="IQL">IQL</option>
      </select>
      <span style="margin-right: 8px; color: #666; font-size: 14px">FireTruck Number:</span>
      <input
        v-model.number="fireTruckCount"
        type="number"
        placeholder="Number of fire trucks"
        min="1"
        step="1"
        style="width: 150px; margin-right: 10px; padding: 5px"
        @input="checkFireTruckCount"
      />
      <button @click="setStartPoint">Set Start Point</button>
      <button @click="setEndPoint">Set End Point</button>
      <button @click="toggleSimulation">
        {{ simulationRunning ? 'Pause' : 'Start' }} Simulation
      </button>
      <button @click="resetSimulation">Reset Simulation</button>
    </div>
  </div>
</template>

<script>
  import { ref, onMounted, onBeforeUnmount, watch, nextTick, computed } from 'vue';
  import { io } from 'socket.io-client';

  export default {
    name: 'SimulationView',
    setup() {
      // Socket 相关
      const socket = ref(null);
      // 定义一个动态文本用于等待加载
      const loadingText = ref('Initializing simulation data');
      let loadingInterval = null; // 用于存储 setInterval 的引用
      let dots = ref(''); // 用于在文本末尾轮流添加 "."、".."、"..."、""
      // 用于保存后端传来的数据
      const boundaries = ref(null);
      const screenshot = ref(null);
      // 存储缩放比例、拖动偏移
      const zoomLevel = ref(1);
      const panOffset = ref({ x: 0, y: 0 });
      // 起点、终点的网络坐标及其在图片上的像素位置
      const startSim = ref(null); // 起点的 SUMO网络坐标
      const endSim = ref(null); // 终点的 SUMO网络坐标
      const startPixel = ref(null); // 起点在图片上的像素位置，用于显示标记
      const endPixel = ref(null); // 终点在图片上的像素位置
      const pixel = ref({ px: 12, font: 9 });
      const isSendSim = ref(false);
      const fireTruckCount = ref(1);
      const algorithm = ref('Dijkstra');
      // 当前选择模式：null、"start" 或 "end"
      const selectionMode = ref(null);
      // 图片 DOM 引用
      const screenshotImg = ref(null);
      const imageContainer = ref(null);
      // 仿真运行状态
      const simulationRunning = ref(false);

      // 内层容器拖动控制
      const dragStart = ref({ x: 0, y: 0 });
      const initialPan = ref({ x: 0, y: 0 });
      const innerContainerStyle = computed(() => ({
        transform: `translate(${panOffset.value.x}px, ${panOffset.value.y}px) scale(${zoomLevel.value})`,
        transformOrigin: 'top left',
        position: 'absolute',
        top: 0,
        left: 0,
      }));

      onMounted(() => {
        window.addEventListener('beforeunload', handleBeforeUnload);
        startLoadingAnimation();
        connectSocket(); // 页面加载时连接 WebSocket
      });
      // 启动加载动画
      const startLoadingAnimation = () => {
        // 如果已经有定时器了，就不重复启动
        if (loadingInterval) return;
        loadingInterval = setInterval(() => {
          if (dots.value.length < 3) {
            dots.value += '.';
          } else {
            dots.value = '';
          }
          loadingText.value = 'Initializing simulation data' + dots.value;
        }, 500);
      };
      // 停止加载动画
      const stopLoadingAnimation = () => {
        if (loadingInterval) {
          clearInterval(loadingInterval);
          loadingInterval = null;
        }
        loadingText.value = 'Initializing simulation data';
        dots.value = '';
      };
      const initZoom = () => {
        const containerWidth = imageContainer.value.clientWidth;
        const containerHeight = imageContainer.value.clientHeight;

        const factorX = containerWidth / screenshotImg.value.naturalWidth;
        const factorY = containerHeight / screenshotImg.value.naturalHeight;
        zoomLevel.value = Math.min(factorX, factorY);
        pixel.value.px = 12 * Math.min(factorX, factorY);
        pixel.value.font = 9 * Math.min(factorX, factorY);
        panOffset.value = { x: 0, y: 0 }; // 初始平移为0
      };
      watch(screenshot, (newVal) => {
        if (newVal === null) {
          // 开始加载动画
          startLoadingAnimation();
        } else {
          // 停止加载动画
          stopLoadingAnimation();
        }
      });
      // 连接 WebSocket 服务
      const connectSocket = () => {
        // 139.224.130.135
        // localhost
        socket.value = io('http://139.224.130.135:5001'); // 后端 WebSocket 地址
        socket.value.on('connect', () => {
          console.log('Connected to WebSocket');
        });

        socket.value.on('disconnect', () => {
          console.log('Disconnected from WebSocket');
        });

        socket.value.on('initData', (data) => {
          if (
            'min_x' in data &&
            'max_x' in data &&
            'min_y' in data &&
            'max_y' in data &&
            'screenshot' in data
          ) {
            screenshot.value = data.screenshot;
            nextTick(() => {
              initZoom(); // 确保 DOM 更新后调用
            });
            boundaries.value = {
              leftBottom: { x: data.min_x, y: data.min_y },
              rightTop: { x: data.max_x, y: data.max_y },
            };
          } else {
            alert('InitData empty');
            console.log(data);
          }
          console.log(boundaries.value);
        });

        socket.value.on('route_error', (errorData) => {
          if (errorData.message) {
            alert(errorData.message);
          }
          // 重置起点终点
          startSim.value = null;
          endSim.value = null;
          startPixel.value = null;
          endPixel.value = null;
          isSendSim.value = false;
          // 如果正在运行则停止仿真
          if (simulationRunning.value) {
            simulationRunning.value = false;
          }
        });

        socket.value.on('simulationData', (data) => {
          updateSimulation(data);
        });
      };

      const updateSimulation = (data) => {
        // 在此处更新 SUMO 仿真画面
        console.log(data);
        if (simulationRunning.value) {
          if ('screenshot' in data) {
            screenshot.value = data.screenshot;
          } else {
            alert('Simulation error');
            simulationRunning.value = false;
          }
        }
      };
      // 鼠标滚轮缩放
      const handleWheel = (event) => {
        event.preventDefault();
        // 获取容器的 bounding rect
        const containerRect = imageContainer.value.getBoundingClientRect();
        // 鼠标在容器内的坐标
        const mousePos = {
          x: event.clientX - containerRect.left,
          y: event.clientY - containerRect.top,
        };
        const oldZoom = zoomLevel.value;
        const zoomFactor = event.deltaY < 0 ? 1.1 : 0.9;
        const newZoom = oldZoom * zoomFactor;
        // 更新平移，确保鼠标位置为缩放中心
        // 新平移 = 旧平移 + (1 - newZoom/oldZoom) * (mousePos - 旧平移)
        const factor = 1 - newZoom / oldZoom;
        panOffset.value = {
          x: panOffset.value.x + factor * (mousePos.x - panOffset.value.x),
          y: panOffset.value.y + factor * (mousePos.y - panOffset.value.y),
        };
        zoomLevel.value = newZoom;
      };
      // 拖动事件
      const handleMouseDown = (event) => {
        if (event.button !== 0) return; // 仅左键
        dragStart.value = { x: event.clientX, y: event.clientY };
        initialPan.value = { ...panOffset.value };
        // 将 mousemove 和 mouseup 事件绑定到 window 上
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        event.preventDefault();
      };
      const handleMouseMove = (event) => {
        const dx = event.clientX - dragStart.value.x;
        const dy = event.clientY - dragStart.value.y;
        panOffset.value = {
          x: initialPan.value.x + dx,
          y: initialPan.value.y + dy,
        };
      };
      const handleMouseUp = () => {
        // 拖动结束后移除全局事件监听
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      // 点击内层容器时，如果不是拖动（即没有移动太多），则作为标记事件处理
      const clickThreshold = 5; // 像素
      // 图片点击事件，根据当前选择模式计算点击点对应的 SUMO 网络坐标
      const handleImageClick = (event) => {
        // 如果拖动过程中移动了较大距离，则不处理点击标记
        const dx = event.clientX - dragStart.value.x;
        const dy = event.clientY - dragStart.value.y;
        if (Math.abs(dx) > clickThreshold || Math.abs(dy) > clickThreshold) {
          return;
        }
        if (!selectionMode.value) return; // 没有进入选择模式时忽略点击
        /// 获取图片元素和它的 bounding rect（缩放后的尺寸）
        const imgEl = screenshotImg.value;
        const rect = imgEl.getBoundingClientRect();

        // 点击相对于图片左上角的坐标（缩放后的坐标）
        const clickX_scaled = event.clientX - rect.left;
        const clickY_scaled = event.clientY - rect.top;

        // 计算图片的自然尺寸
        const naturalWidth = rect.width / zoomLevel.value;
        const naturalHeight = rect.height / zoomLevel.value;

        // 还原点击的自然坐标
        const clickX = clickX_scaled / zoomLevel.value;
        const clickY = clickY_scaled / zoomLevel.value;

        if (boundaries.value) {
          const { leftBottom, rightTop } = boundaries.value;

          // 根据自然尺寸计算比例，并映射到 SUMO 网络坐标
          const simX = leftBottom.x + (clickX / naturalWidth) * (rightTop.x - leftBottom.x);
          // 这里假设图片上方对应 SUMO 坐标 rightTop.y，图片下方对应 leftBottom.y
          const simY = rightTop.y - (clickY / naturalHeight) * (rightTop.y - leftBottom.y);

          const simPos = { x: simX, y: simY };
          // 记录自然坐标（用作标记显示）
          const pixelPos = { x: clickX, y: clickY };
          if (selectionMode.value === 'start') {
            startSim.value = simPos;
            startPixel.value = pixelPos;
          } else if (selectionMode.value === 'end') {
            endSim.value = simPos;
            endPixel.value = pixelPos;
          }
        }
        // 退出选择模式
        selectionMode.value = null;
      };

      // 点击按钮进入起点选择模式
      const setStartPoint = () => {
        selectionMode.value = 'start';
        alert('Please click on the image to select the start point.');
      };

      // 点击按钮进入终点选择模式
      const setEndPoint = () => {
        selectionMode.value = 'end';
        alert('Please click on the image to select the end point.');
      };

      // 生成标记的样式，使得标记在图片上居中显示
      const markerStyle = (point) => {
        return {
          position: 'absolute',
          left: point.x - pixel.value.px / 2 + 'px',
          top: point.y - pixel.value.px / 2 + 'px',
          width: pixel.value.px + 'px',
          height: pixel.value.px + 'px',
          'font-size': pixel.value.font + 'px',
          'background-color': 'rgba(255,255,0,0.7)',
          'border-radius': '50%',
          color: 'black',
          'text-align': 'center',
          'line-height': pixel.value.px + 'px',
          'font-weight': 'bold',
          pointerEvents: 'none',
        };
      };

      const toggleSimulation = () => {
        if (simulationRunning.value) {
          pauseSimulation();
        } else {
          startSimulation();
        }
      };

      const startSimulation = () => {
        if (!Number.isInteger(fireTruckCount.value) || fireTruckCount.value < 1) {
          alert('Fire truck count must be an integer greater than 0!');
          return;
        } else {
          if (!startSim.value) {
            alert('Please set start point!');
            return;
          } else {
            if (!endSim.value) {
              alert('Please set end point!');
              return;
            }
          }
        }
        const data = !isSendSim.value
          ? {
              start_point: startSim.value,
              end_point: endSim.value,
              n: fireTruckCount.value,
              algorithm: algorithm.value,
            }
          : null;
        isSendSim.value = true;
        socket.value.emit('start', data);
        simulationRunning.value = true;
      };

      const pauseSimulation = () => {
        socket.value.emit('pause');
        simulationRunning.value = false;
      };

      const resetSimulation = () => {
        if (socket.value) {
          simulationRunning.value = false;
          startSim.value = null;
          endSim.value = null;
          startPixel.value = null;
          endPixel.value = null;
          screenshot.value = null;
          boundaries.value = null;
          selectionMode.value = null;
          screenshotImg.value = null;
          isSendSim.value = false;
          fireTruckCount.value = 1;
          panOffset.value = { x: 0, y: 0 };
          zoomLevel.value = 1;
          pixel.value = { px: 12, font: 9 };
          socket.value.emit('reset');
        }
      };
      // 页面卸载时断开 WebSocket 连接
      onBeforeUnmount(() => {
        if (loadingInterval) {
          clearInterval(loadingInterval);
        }
        if (socket.value) {
          socket.value.disconnect();
          console.log('WebSocket disconnected.');
        }
        window.removeEventListener('beforeunload', handleBeforeUnload);
      });
      const handleBeforeUnload = () => {
        console.log('Page is about to be refreshed.');
        // 页面刷新时执行的清理操作
        if (loadingInterval) {
          clearInterval(loadingInterval);
        }
        if (socket.value) {
          socket.value.disconnect();
          console.log('WebSocket disconnected.');
        }
      };
      const checkFireTruckCount = () => {
        if (fireTruckCount.value % 1 !== 0) {
          fireTruckCount.value = Math.floor(fireTruckCount.value); // 只保留整数部分
        }
      };
      return {
        simulationRunning,
        loadingText,
        screenshot,
        screenshotImg,
        imageContainer,
        startPixel,
        endPixel,
        startSim,
        endSim,
        fireTruckCount,
        innerContainerStyle,
        algorithm,
        toggleSimulation,
        resetSimulation,
        setStartPoint,
        setEndPoint,
        handleImageClick,
        markerStyle,
        checkFireTruckCount,
        handleWheel,
        handleMouseDown,
        handleMouseUp,
      };
    },
  };
</script>

<style scoped>
  .page-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 80vh;
  }

  .image-container {
    position: relative;
    width: 100%;
    height: 80vh;
    overflow: hidden;
  }

  .inner-container img {
    display: block; /* 避免行内元素空隙 */
    width: auto;
    min-width: 100%; /* 最小尺寸等于容器 */
    height: auto;
    min-height: 100%;
    cursor: crosshair;
    user-select: none;
  }

  .buttons {
    margin-top: 20px;
  }

  .buttons button {
    margin: 5px;
    padding: 10px;
    cursor: pointer;
  }

  .loading-text {
    margin: 10px;
    animation: bounce 1s ease-in-out infinite;
    color: black;
    font-size: 60px;
    font-style: italic;
    font-weight: bold;
  }

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0); /* 初始位置 */
    }

    50% {
      transform: translateY(-10px); /* 向上移动 10px */
    }
  }
</style>

<!--<template>-->
<!--  <div>-->
<!--    <h1>时间接收测试</h1>-->
<!--    <button @click="toggleReceive">-->
<!--      {{ isReceiving ? '停止接收' : '开始接收' }}-->
<!--    </button>-->
<!--    <p v-if="currentTime">当前时间：{{ currentTime }}</p>-->
<!--    <p v-else>未连接</p>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--  import { ref, onUnmounted, onMounted } from 'vue';-->
<!--  import io from 'socket.io-client';-->

<!--  export default {-->
<!--    name: 'TestView',-->
<!--    setup() {-->
<!--      const socket = ref(null);-->
<!--      const currentTime = ref(null);-->
<!--      const isReceiving = ref(false);-->

<!--      const toggleReceive = () => {-->
<!--        if (isReceiving.value) {-->
<!--          isReceiving.value = false;-->
<!--          console.log('pause1');-->
<!--          socket.value.emit('pause');-->
<!--          console.log('pause2');-->
<!--        } else {-->
<!--          isReceiving.value = true;-->
<!--          console.log('开始接收');-->
<!--          socket.value.emit('start');-->
<!--          console.log('发送开始');-->
<!--        }-->
<!--      };-->

<!--      const connectSocket = () => {-->
<!--        // 替换为你的服务器地址（例如：http://139.224.130.135:5000）-->

<!--        socket.value = io('http://139.224.130.135:5000');-->

<!--        socket.value.on('connect', () => {-->
<!--          console.log('Socket connected');-->
<!--        });-->

<!--        socket.value.on('disconnect', () => {-->
<!--          console.log('Disconnect');-->
<!--        });-->

<!--        socket.value.on('connect_error', (err) => {-->
<!--          console.error('连接错误:', err.message);-->
<!--        });-->

<!--        socket.value.on('time_update', (data) => {-->
<!--          currentTime.value = data.time;-->
<!--        });-->
<!--      };-->

<!--      onMounted(() => {-->
<!--        connectSocket();-->
<!--      });-->

<!--      onUnmounted(() => {-->
<!--        if (socket.value) {-->
<!--          socket.value.disconnect();-->
<!--        }-->
<!--      });-->
<!--      return {-->
<!--        socket,-->
<!--        isReceiving,-->
<!--        currentTime,-->
<!--        connectSocket,-->
<!--        toggleReceive,-->
<!--      };-->
<!--    },-->
<!--  };-->
<!--</script>-->
