<template>
  <div id="container" />

  <div class="selector">
    <el-select
      v-model="zones"
      multiple
      clearable
      collapse-tags
      placeholder="请选择区域"
      :max-collapse-tags="1"
      style="width: 140px"
    >
      <template #header>
        <el-checkbox
          v-model="checkAll"
          :indeterminate="indeterminate"
          class="checkbox-all"
          @change="handleCheckAll"
        >
          全选
        </el-checkbox>
      </template>
      <el-option
        v-for="item in buildingZones"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        :class="getOptionClass(item.value)"
      />
      <template #tag>
        <el-tag v-for="zone in zones" :key="zone" :color="getZoneColor(zone)" class="square-tag" />
      </template>
    </el-select>
  </div>

  <div class="input-card" style="width: 120px">
    <button class="btn" @click="createPolygon">新建区域</button>
    <button class="btn" @click="endEditingPolygon">结束编辑</button>
    <button class="btn" @click="removePolygon">删除区域</button>
  </div>
  <ExpandableInput />
</template>

<script lang="ts" setup>
  import { ref, onMounted, watch, onUnmounted } from 'vue';
  import { useRouter } from 'vue-router';
  import mapModel from './model/mapModel';
  import MapPresenter from './presenter/MapPresenter';
  import ExpandableInput from './view/ExpandableInput.vue';
  import type { CheckboxValueType } from 'element-plus';

  // 定义类型
  interface MapPresenterType {
    init: () => void;
    createPolygon: () => void;
    endEditingPolygon: () => void;
    removePolygon: () => void;
    changeBuildingLayers: (areas: any) => void;
    showFlamingSmokeDetection: () => void;
    hideFlamingSmokeDetection: () => void;
  }

  const router = useRouter();

  // 定义变量
  const presenter = ref<MapPresenterType | null>(null);

  // 初始化和生命周期
  const initPresenter = () => {
    if (!presenter.value) {
      presenter.value = new MapPresenter(router, { showError }); // 初始化 Presenter
      presenter.value.init(); // 启动逻辑
    }
  };

  // 方法
  const showError = (message: string): void => {
    alert(message);
  };

  let interval;

  let ifVisibleFlamingSmokeDetection = true;

  // Vue 生命周期
  onMounted(() => {
    initPresenter();
    interval = setInterval(() => {
      ifVisibleFlamingSmokeDetection
        ? presenter.value?.showFlamingSmokeDetection()
        : presenter.value?.hideFlamingSmokeDetection();
      ifVisibleFlamingSmokeDetection = !ifVisibleFlamingSmokeDetection;
    }, 500);
  });

  onUnmounted(() => {
    clearInterval(interval);
  });

  const createPolygon = (): void => {
    presenter.value?.createPolygon();
  };

  const endEditingPolygon = (): void => {
    presenter.value?.endEditingPolygon();
  };

  const removePolygon = (): void => {
    presenter.value?.removePolygon();
  };

  // element-plus 选择器
  const checkAll = ref(true);
  const indeterminate = ref(false);
  const buildingZones = ref([
    {
      value: 'collegeZone',
      label: '学院区',
      color: '#ffff00',
    },
    {
      value: 'dormZone',
      label: '宿舍区',
      color: '#90ee90',
    },
    {
      value: 'livingZone',
      label: '生活区',
      color: '#87cefa',
    },
    {
      value: 'teachingZone',
      label: '教学区',
      color: '#ff6347',
    },
  ]);

  // 初始化时设置全选
  const zones = ref<CheckboxValueType[]>(buildingZones.value.map((_) => _.value));

  const getZoneColor = (zone: CheckboxValueType) => {
    const buildingZone = buildingZones.value.find((item) => item.value === zone);
    return buildingZone?.color;
  };

  watch(zones, (val) => {
    if (val.length === 0) {
      checkAll.value = false;
      indeterminate.value = false;
      // 清空区域显示
      presenter.value?.changeBuildingLayers([]);
    } else if (val.length === buildingZones.value.length) {
      checkAll.value = true;
      indeterminate.value = false;
      // 显示所有区域
      const areas = mapModel.getBuildingSomeZones(val);
      presenter.value?.changeBuildingLayers(areas);
    } else {
      checkAll.value = false;
      indeterminate.value = true;
      // 显示选择的区域
      const areas = mapModel.getBuildingSomeZones(val);
      presenter.value?.changeBuildingLayers(areas);
    }
  });

  const handleCheckAll = (val: CheckboxValueType) => {
    indeterminate.value = false;
    if (val) {
      zones.value = buildingZones.value.map((_) => _.value); // 全选
    } else {
      zones.value = []; // 全不选
    }
  };

  // 动态设置选项颜色
  const zoneClasses = {
    collegeZone: 'college-zone',
    dormZone: 'dorm-zone',
    livingZone: 'living-zone',
    teachingZone: 'teaching-zone',
  };

  const getOptionClass = (value: string) => zoneClasses[value] || '';
</script>

<style scoped>
  /* 全局样式 */
  html,
  body,
  #container {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }

  /* Selector样式 */
  .selector {
    position: fixed;
    z-index: 1000; /* 确保按钮在地图等元素上面 */
    top: 180px;
    right: 20px;
  }

  .checkbox-all {
    padding: 5px;
    border: 1px solid #ff6347;
    border-radius: 5px;
    background-color: #ffdab9 !important; /* 全选背景色 */
  }

  .square-tag {
    width: 20px !important; /* 设置宽度 */
    height: 20px !important; /* 设置高度 */
    border-radius: 7px !important;
    line-height: 20px !important; /* 设置垂直居中 */
  }

  /* 选项颜色，每个字体颜色不同 */
  .college-zone {
    border: 1px solid #ffd700;
    background-color: #ff0 !important; /* 背景色：黄色 */
    color: #8b4513; /* 棕色字体 */
  }

  .dorm-zone {
    border: 1px solid #32cd32;
    background-color: #90ee90 !important; /* 背景色：浅绿色 */
    color: #006400; /* 深绿色字体 */
  }

  .living-zone {
    border: 1px solid #4682b4;
    background-color: #87cefa !important; /* 背景色：浅蓝色 */
    color: #00008b; /* 深蓝色字体 */
  }

  .teaching-zone {
    border: 1px solid #cd5c5c;
    background-color: #ff6347 !important; /* 背景色：红色 */
    color: #800000; /* 深红色字体 */
  }

  /* 输入框样式 */
  .input-card {
    position: fixed;
    z-index: 1000; /* 确保按钮在地图等元素上面 */
    right: 20px;
    bottom: 20px;
  }

  .btn {
    width: 100%;
    margin-bottom: 5px;
    padding: 10px;
    border: none;
    border-radius: 5px;
    background-color: #4caf50;
    box-shadow: 0 2px 5px rgb(0 0 0 / 30%);
    color: white;
    cursor: pointer;
  }

  .btn:hover {
    background-color: #45a049;
  }

  #container {
    position: relative;
  }
</style>
