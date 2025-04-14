import type { RouteRecordRaw } from 'vue-router';
import { t } from '@/hooks/useI18n';

const moduleName = 'indexer';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/indexer',
    name: moduleName,
    meta: {
      title: t('routes.indexer.indexer'),
      icon: 'ant-design:indexer-outlined',
    },
    component: () => import('@/views/indexer/indexer.vue'),
  },
];

export default routes;
