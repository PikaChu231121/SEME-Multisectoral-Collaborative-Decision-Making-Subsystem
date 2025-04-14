import type { RouteRecordRaw } from 'vue-router';
import { t } from '@/hooks/useI18n';

const moduleName = 'decision';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/decision',
    name: moduleName,
    meta: {
      title: t('routes.decision.decision'),
      icon: 'ant-design:video-camera-outlined',
    },
    component: () => import('@/views/decision/index.vue'),
  },
];

export default routes;
