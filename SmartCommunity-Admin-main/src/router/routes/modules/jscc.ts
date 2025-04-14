import type { RouteRecordRaw } from 'vue-router';
import { t } from '@/hooks/useI18n';

const moduleName = 'jscc';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/jscc',
    name: moduleName,
    meta: {
      title: t('routes.jscc.jscc'),
      icon: 'ant-design:video-camera-outlined',
    },
    component: () => import('@/views/jscc/index.vue'),
  },
];

export default routes;
