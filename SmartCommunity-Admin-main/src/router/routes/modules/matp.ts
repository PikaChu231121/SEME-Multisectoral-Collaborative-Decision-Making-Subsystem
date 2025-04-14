import type { RouteRecordRaw } from 'vue-router';
import { t } from '@/hooks/useI18n';

const moduleName = 'matp';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/matp',
    name: moduleName,
    meta: {
      title: t('routes.matp.matp'),
      icon: 'ant-design:video-camera-outlined',
    },
    component: () => import('@/views/matp/index.vue'),
  },
];

export default routes;
