import { RouterView } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

/**
 * 协同决策子模块
 */
const collaborationRoutes: RouteRecordRaw = {
  path: '/collaboration',
  name: 'collaboration',
  component: RouterView,
  meta: {
    icon: 'icon-park-outline:mind-mapping',
    title: '协同决策',
    sort: 3, // 排序
  },
  children: [
    {
      path: 'matrix',
      name: 'collaboration-matrix',
      component: () => import('@/views/collaboration/matrix.vue'),
      meta: {
        title: '协同决策矩阵',
        icon: 'mingcute:mind-map-fill',
      },
    },
    {
      path: 'decision',
      name: 'collaboration-decision',
      component: () => import('@/views/collaboration/decision.vue'),
      meta: {
        title: '智能决策系统',
        icon: 'carbon:decision-tree',
      },
    },
    {
      path: 'matrix',
      name: 'timeline-matrix',
      component: () => import('@/views/timeline/matrix.vue'),
      meta: {
          title: '时间表矩阵',
          icon: 'mdi:table',
      },
    },
    {
      path: 'list',
      name: 'response-history-list',
      component: () => import('@/views/responseHistory/index.vue'),
      meta: {
          title: '历史记录列表',
          icon: 'mdi:list-box',
      },
  },
  {
      path: 'detail/:id',
      name: 'response-history-detail',
      component: () => import('@/views/responseHistory/detail.vue'),
      meta: {
          title: '响应历史详情',
          icon: 'mdi:file-document',
          hidden: true, // ✅ 隐藏在侧边栏
      },
  },
  ],
};

export default collaborationRoutes;
