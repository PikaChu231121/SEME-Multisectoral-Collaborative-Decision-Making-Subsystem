<template>
  <div style="width: 100%">
    <!-- <el-button type="danger" @click="handleDelete">移除数据</el-button> -->
    <div style="display: flex; justify-content: center; width: 100%">
      <PlusTable
        :columns="tableConfig"
        :table-data="tableData"
        :action-bar="{ buttons, width: 140 }"
        class="table"
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
  import { useRouter } from 'vue-router'; // 导入 useRouter 钩子
  import axios from 'axios';
  import type { ButtonsCallBackParams, PlusColumn } from 'plus-pro-components';

  const router = useRouter(); // 获取路由实例

  // 定义报修数据的接口
  interface RepairItem {
    staffId: number;
    name: string;
    position: string;
    department: string;
    averageRating: number;
    evaluationCount: number;
  }

  const { tableData, buttons } = useTable<RepairItem[]>();

  const show = ref<boolean[]>([]);

  // 按钮配置
  buttons.value = [
    {
      text: '查看',
      code: 'details',
      props: {
        type: 'primary',
      },
      show: (_, index) => !show.value[index],
    },
  ];

  const tableConfig = ref<PlusColumn[]>([
    {
      label: '工作人员编号',
      prop: 'staffId',
      width: 250,
      formProps: {
        rules: {
          staffId: [
            {
              required: true,
              message: '请输入工作人员编号',
            },
          ],
        },
      },
    },
    {
      label: '姓名',
      prop: 'name',
      width: 250,
      formProps: {
        rules: {
          name: [
            {
              required: true,
              message: '请输入工作人员姓名',
            },
          ],
        },
      },
    },
    {
      label: '职位',
      prop: 'position',
      width: 250,
      formProps: {
        rules: {
          position: [
            {
              required: true,
              message: '请输入工作人员职位',
            },
          ],
        },
      },
    },
    {
      label: '部门',
      prop: 'department',
      width: 250,
      formProps: {
        rules: {
          department: [
            {
              required: true,
              message: '请输入工作人员部门',
            },
          ],
        },
      },
    },
    {
      label: '平均分',
      prop: 'averageRating',
      width: 200,
      formProps: {
        rules: {
          averageRating: [
            {
              required: true,
              message: '请输入平均分',
            },
          ],
        },
      },
    },
    {
      label: '评价次数',
      prop: 'evaluationCount',
      width: 200,
    },
  ]);

  // 模拟数据获取函数
  const getList = async () => {
    try {
      const response = await axios.get('http://121.5.16.33:8080/Staff/getStaffWithEvaluatedCount');
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

  const handleClickButton = async (data: ButtonsCallBackParams) => {
    if (data.buttonRow.code === 'details') {
      // 点击查看时，跳转到 enter/index.vue，并传递 workerID 参数
      const workerID = data.row.staffId;
      if (workerID) {
        // 使用路由名称 'comment-enter' 和参数 workerID 跳转
        router.push({
          name: 'comment-enter', // 对应路由名称
          query: { workerID }, // 使用 query 参数传递 workerID
        });
      } else {
        ElMessage.warning('没有找到工作人员信息');
      }
    }
  };
</script>

<style scoped>
  .table {
    display: flex;
    justify-content: center; /* 水平居中 */
    min-height: 100vh; /* 最小高度设置为视口高度，确保表格始终居中 */
  }
</style>
