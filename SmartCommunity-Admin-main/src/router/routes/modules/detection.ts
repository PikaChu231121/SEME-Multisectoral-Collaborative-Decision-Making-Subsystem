import type { RouteRecordRaw } from 'vue-router';
import { t } from '@/hooks/useI18n';

const moduleName = 'detection';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/detection',
    name: moduleName,
    meta: {
      title: t('routes.detection.detection'),
      icon: 'ant-design:video-camera-outlined',
    },
    component: () => import('@/views/detection/index.vue'),
  },
];

export default routes;
