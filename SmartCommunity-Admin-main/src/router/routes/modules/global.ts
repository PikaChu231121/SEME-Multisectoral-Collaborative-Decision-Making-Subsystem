import type { RouteRecordRaw } from 'vue-router';
import { t } from '@/hooks/useI18n';

const moduleName = 'global';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/global',
    name: moduleName,
    meta: {
      title: t('routes.global.global'),
      icon: 'ant-design:dashboard-outlined',
    },
    component: () => import('@/views/global/index.vue'),
  },
];

export default routes;
