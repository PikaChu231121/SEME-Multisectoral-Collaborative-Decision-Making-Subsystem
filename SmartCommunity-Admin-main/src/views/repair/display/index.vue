<template>
  <div style="width: 100%">
    <!-- <el-button type="danger" @click="handleDelete">移除数据</el-button> -->
    <div style="display: flex; justify-content: center; width: 100%">
      <PlusTable
        :columns="tableConfig"
        :table-data="tableData"
        :action-bar="{ buttons, width: 140 }"
        @formChange="formChange"
        @clickAction="handleClickButton"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useTable } from 'plus-pro-components';
  import { ElMessage } from 'element-plus';
  import { set } from 'lodash-es';
  import axios from 'axios';
  import type { ButtonsCallBackParams, TableFormRefRow, PlusColumn } from 'plus-pro-components';

  // 定义报修数据的接口
  interface RepairItem {
    id: number;
    residentID: number;
    repairIssueTitle: string;
    repairIssueDetails: string;
    repairIssueStatus: string;
    repairIssueStart: string;
    repairAddress: string;
    repairIssueCategory: string;
  }

  // const TestServe = {
  //   getList: async () => {
  //     const data = Array.from({ length: 4 }).map((item, index) => {
  //       return {
  //         id: index,
  //         name: {
  //           name: index < 2 ? '' : index + 'name',
  //         },
  //         status: String(index % 3),
  //         rate: index > 3 ? 2 : 3.5,
  //         switch: index % 2 === 0 ? true : false,
  //         time: index < 2 ? '' : new Date(),
  //       };
  //     });
  //     return { data: data as TableRow[] };
  //   },
  // };

  const { tableData, buttons } = useTable<RepairItem[]>();

  const show = ref<boolean[]>([]);

  // 按钮配置
  buttons.value = [
    {
      text: '取消编辑',
      code: 'cancel',
      props: {
        type: 'warning',
      },
      show: (_, index) => !!show.value[index],
    },
    {
      // 保存
      text: '保存',
      code: 'save',
      props: {
        type: 'primary',
      },
      show: (_, index) => !!show.value[index],
    },
    {
      text: '编辑',
      code: 'edit',
      props: {
        type: 'primary',
      },
      show: (_, index) => !show.value[index],
    },
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
    { label: '编号', prop: 'id', width: 80, editable: false },
    {
      label: '居民编号',
      prop: 'residentID',
      width: 100,
      formProps: {
        rules: {
          residentID: [
            {
              required: true,
              message: '请输入居民编号',
            },
          ],
        },
      },
    },
    {
      label: '报修标题',
      prop: 'repairIssueTitle',
      width: 150,
      formProps: {
        rules: {
          repairIssueTitle: [
            {
              required: true,
              message: '请输入报修问题标题',
            },
          ],
        },
      },
    },
    {
      label: '报修问题细节',
      prop: 'repairIssueDetails',
      valueType: 'textarea',
      width: 300,
      message: '请输入报修问题详情',
    },
    {
      label: '维修状态',
      prop: 'repairIssueStatus',
      width: 120,
      valueType: 'select',
      options: [
        {
          label: '待处理',
          value: 'Pending',
          color: 'red',
        },
        {
          label: '已解决',
          value: 'Resolved',
          color: 'green',
        },
        {
          label: '解决中',
          value: 'InProgress',
          color: 'yellow',
        },
        {
          label: '失败',
          value: 'Failed',
          color: 'red',
        },
      ],
    },
    {
      label: '故障类型',
      prop: 'repairIssueCategory',
      width: 120,
      valueType: 'select',
      options: [
        { label: '管道', value: 'Plumbing', color: 'blue' },
        { label: '电器', value: 'Electrical', color: 'orange' },
        { label: '网络', value: 'Network', color: 'green' },
        { label: '门窗', value: 'Window', color: 'purple' },
        { label: '电梯', value: 'Elevator', color: 'pink' },
        { label: '照明', value: 'Lighting', color: 'brown' },
        { label: '其他', value: 'Other', color: 'gray' },
      ],
    },
    {
      label: '提交时间',
      prop: 'repairIssueStart',
      valueType: 'date-picker',
      width: 200,
      fieldProps: {
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DDTHH:mm:ssZ',
      },
    },
    { label: '位置', prop: 'repairAddress', width: 300 },
  ]);

  // 模拟数据获取函数
  const getList = async () => {
    try {
      const response = await axios.get('http://121.5.16.33:8080/api/repair-issues');
      const data = response.data; // 获取返回的数据
      console.log('debug', response);
      tableData.value = data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  getList();

  // 表单变化
  const formChange = ({ value, prop, index }) => {
    // 同步表单数据到表格

    set(tableData.value[index], prop, value);

    console.log('表单数据同步:', tableData.value);
  };

  // 保存逻辑
  const handleSave = async (data) => {
    try {
      if (data.formRefs) {
        // 遍历所有表单进行校验
        await Promise.all(
          data.formRefs.map((item: TableFormRefRow) => item.formInstance.value?.validate()),
        );

        // 停止编辑模式
        data.formRefs.forEach((item: TableFormRefRow) => {
          item.stopCellEdit();
        });

        // 校验成功后处理保存逻辑
        show.value[data.index] = false; // 停止编辑模式
        //console.log('save',data.formRefs)
        ElMessage.success('保存成功');
        try {
          const response = await axios.put(
            `http://121.5.16.33:8080/api/repair-issues/${data.row.id}`,
            data.row,
          );
          console.log(response);
        } catch (error) {
          console.error('Error puting data:', error);
        }
      }
    } catch (errors: any) {
      console.error(errors, 'errors');
      ElMessage.warning('请完善表单后再提交！');
    }
  };

  const handleClickButton = async (data: ButtonsCallBackParams) => {
    if (data.buttonRow.code === 'edit') {
      tableData.value.forEach((item) => {
        if (item.id === data.row.id) {
          show.value[data.index] = true;
        }
      });

      data.formRefs?.forEach((item: TableFormRefRow) => {
        item.startCellEdit();
      });
    } else if (data.buttonRow.code === 'cancel') {
      tableData.value.forEach((item) => {
        if (item.id === data.row.id) {
          show.value[data.index] = false;
        }
      });
      data.formRefs?.forEach((item: TableFormRefRow) => {
        item.stopCellEdit();
      });
    } else if (data.buttonRow.code === 'save') {
      handleSave(data);
    } else {
      try {
        const response = await axios.delete(
          `http://121.5.16.33:8080/api/repair-issues/${data.row.id}`,
        );
        console.log(response);
        tableData.value = tableData.value.filter((item) => item.id !== data.row.id);
        ElMessage.success('删除成功');
      } catch (error) {
        console.error('Error deleting data:', error);
      }
    }
  };
</script>
