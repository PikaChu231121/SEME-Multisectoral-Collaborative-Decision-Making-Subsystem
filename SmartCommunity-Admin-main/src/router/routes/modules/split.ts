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
    children: [
      {
        path: 'register',
        name: `${moduleName}-register`,
        meta: {
          title: t('routes.split.register'),
          icon: 'ant-design:file-search-outlined',
          keepAlive: false,
        },
        component: () => import('@/views/split/register/index.vue'),
      },
      {
        path: 'deploy',
        name: `${moduleName}-deploy`,
        meta: {
          title: t('routes.split.deploy'),
          icon: 'ant-design:form-outlined',
          keepAlive: false,
        },
        component: () => import('@/views/split/deploy/index.vue'),
      },
      {
        path: 'history',
        name: `${moduleName}-history`,
        meta: {
          title: t('routes.split.history'),
          icon: 'ant-design:history-outlined',
          keepAlive: false,
        },
        component: () => import('@/views/split/history/index.vue'),
      },
    ],
  },
];

export default routes;
