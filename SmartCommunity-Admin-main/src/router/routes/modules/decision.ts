import type { RouteRecordRaw } from 'vue-router';

// 注释掉原始路由，因为已将决策页面移至协同决策模块
// const routes: Array<RouteRecordRaw> = [
//   {
//     path: '/decision',
//     name: moduleName,
//     meta: {
//       title: t('routes.decision.decision'),
//       icon: 'ant-design:video-camera-outlined',
//     },
//     component: () => import('@/views/decision/index.vue'),
//   },
// ];

// 导出空数组，不再单独注册决策路由
const routes: Array<RouteRecordRaw> = [];

export default routes;
