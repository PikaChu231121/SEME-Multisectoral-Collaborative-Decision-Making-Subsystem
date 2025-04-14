import type { RouteRecordRaw } from 'vue-router';
import { t } from '@/hooks/useI18n';

const moduleName = 'split';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/split',
    name: moduleName,
    meta: {
      title: t('routes.split.split'),
      icon: 'ant-design:disconnect-outlined',
    },
    component: () => import('@/views/split/index.vue'),
  },
];

export default routes;
