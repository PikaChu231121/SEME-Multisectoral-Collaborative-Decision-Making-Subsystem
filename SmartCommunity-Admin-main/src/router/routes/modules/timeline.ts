import { RouterView } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

/**
 * 时间表模块
 */
const timeline: RouteRecordRaw = {
  path: '/timeline',
  name: 'timeline',
  component: RouterView,
  meta: {
    icon: 'mdi:timeline',
    title: '时间表',
    sort: 4, // 排序
  },
  children: [
    {
      path: 'matrix',
      name: 'timeline-matrix',
      component: () => import('@/views/timeline/matrix.vue'),
      meta: {
        title: '时间表矩阵',
        icon: 'mdi:table',
      },
    },
  ],
};

export default timeline;
