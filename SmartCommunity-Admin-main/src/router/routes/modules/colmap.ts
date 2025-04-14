import type { RouteRecordRaw } from 'vue-router';
import { t } from '@/hooks/useI18n';

const moduleName = 'colmap';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/colmap',
    name: moduleName,
    meta: {
      title: t('routes.colmap.colmap'),
      icon: 'ant-design:video-camera-outlined',
    },
    component: () => import('@/views/colmap/index.vue'),
  },
];

export default routes;
