<template>
  <div style="width: 100%">
    <div style="display: flex; justify-content: center; width: 100%">
      <PlusTable
        v-if="workerID"
        :columns="WorkerConfig"
        :table-data="workerData"
        :action-bar="{ buttons, width: 140 }"
        @clickAction="handleClickButton"
      />
      <PlusTable
        v-else
        :columns="tableConfig"
        :table-data="tableData"
        :action-bar="{ buttons, width: 140 }"
        @clickAction="handleClickButton"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useTable } from 'plus-pro-components';
  import { ElMessage } from 'element-plus';
  import { useRoute } from 'vue-router'; // 引入 useRoute
  import axios from 'axios';
  import type { ButtonsCallBackParams, PlusColumn } from 'plus-pro-components';

  // 获取路由对象
  const route = useRoute();
  const workerID = route.query.workerID as string; // 获取workerID

  // 定义报修数据的接口
  interface RepairItem {
    eventId: number;
    score: number;
    comment: string;
    workerName: string;
    workerPosition: string;
    workerDepartment: string;
    createdTime: string;
  }

  interface CommentItem {
    eventId: number;
    score: number;
    comment: string;
    evaluatedTime: string;
  }

  const { tableData, buttons } = useTable<RepairItem[]>();

  const workerData = useTable<CommentItem[]>().tableData;

  const show = ref<boolean[]>([]);

  // 按钮配置
  buttons.value = [
    {
      text: '删除',
      code: 'delete',
      props: {
        type: 'danger',
      },
      confirm: {},
      show: (_, index) => !show.value[index],
    },
  ];

  const tableConfig = ref<PlusColumn[]>([
    { label: '事件编号', prop: 'eventId', width: 80, editable: false },
    {
      label: '评分',
      prop: 'score',
      width: 150,
    },
    {
      label: '评价',
      prop: 'comment',
      valueType: 'textarea',
      width: 300,
    },
    {
      label: '工作人员姓名',
      prop: 'workerName',
      width: 120,
    },
    {
      label: '职位',
      prop: 'workerPosition',
      width: 120,
    },
    {
      label: '部门',
      prop: 'workerDepartment',
      width: 120,
    },
    {
      label: '评价时间',
      prop: 'createdTime',
      valueType: 'date-picker',
      width: 200,
      fieldProps: {
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DDTHH:mm:ssZ',
      },
    },
  ]);

  const WorkerConfig = ref<PlusColumn[]>([
    { label: '事件编号', prop: 'eventId', width: 80, editable: false },
    {
      label: '评分',
      prop: 'score',
      width: 150,
    },
    {
      label: '评价',
      prop: 'comment',
      valueType: 'textarea',
      width: 300,
    },
    {
      label: '评价时间',
      prop: 'evaluatedTime',
      valueType: 'date-picker',
      width: 200,
      fieldProps: {
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DDTHH:mm:ssZ',
      },
    },
  ]);

  // 模拟数据获取函数
  const getList = async () => {
    // 只有当找到了数据时，才更新 tableData
    if (workerID == null) {
      try {
        const response = await axios.get(
          'http://121.5.16.33:8080/api/EventEvaluation/getAllEvaluation',
        );
        const data = response.data.data; // 获取返回的数据
        tableData.value = data;
        ElMessage.warning('所有评分信息如下');
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    } else {
      try {
        const response = await axios.get(
          `http://121.5.16.33:8080/api/EventEvaluation/getEventEvaluationByStaffId/${workerID}`,
        );
        const data = response.data.data.services; // 获取返回的数据
        workerData.value = data;
        ElMessage.warning('当前工作人员评分信息如下');
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  };

  // 调用 getList 获取数据
  getList();

  const handleClickButton = async (data: ButtonsCallBackParams) => {
    if (data.buttonRow.code === 'delete') {
      try {
        const response = await axios.delete(
          `http://121.5.16.33:8080/api/EventEvaluation/deleteEvaluationByEventID/${data.row.eventId}`,
        );
        console.log(response);
        tableData.value = tableData.value.filter((item) => item.eventId !== data.row.eventId);
        workerData.value = workerData.value.filter((item) => item.eventId !== data.row.eventId);
        ElMessage.success('删除成功');
      } catch (error) {
        console.error('Error deleting data:', error);
      }
    }
  };
</script>
