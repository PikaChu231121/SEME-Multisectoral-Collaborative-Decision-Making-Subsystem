import type { RouteRecordRaw } from 'vue-router';
import { t } from '@/hooks/useI18n';

const moduleName = 'task';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/task',
    name: moduleName,
    meta: {
      title: t('routes.task.task'),
      icon: 'ant-design:video-camera-outlined',
    },
    component: () => import('@/views/task/index.vue'),
    beforeEnter: (to, from, next) => {
      window.location.href = 'http://121.5.16.33:9009/admin/';
      next();
    },
  },
];

export default routes;
