import type { RouteRecordRaw } from 'vue-router';
import { t } from '@/hooks/useI18n';

const moduleName = 'traffic';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/traffic',
    name: moduleName,
    meta: {
      title: t('routes.traffic.traffic'),
      icon: 'ant-design:video-camera-outlined',
    },
    component: () => import('@/views/traffic/index.vue'),
  },
];

export default routes;
