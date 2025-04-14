import type { RouteRecordRaw } from 'vue-router';
import { t } from '@/hooks/useI18n';

const moduleName = 'repair';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/repair',
    name: moduleName,
    redirect: '/repair/display',
    meta: {
      title: t('routes.repair.repair'),
      icon: 'ant-design:tool-outlined',
    },
    children: [
      {
        path: 'display',
        name: `${moduleName}-display`,
        meta: {
          title: t('routes.repair.display'),
          icon: 'ant-design:file-search-outlined',
          keepAlive: false,
        },
        component: () => import('@/views/repair/display/index.vue'),
      },
      {
        path: 'enter',
        name: `${moduleName}-enter`,
        meta: {
          title: t('routes.repair.enter'),
          icon: 'ant-design:form-outlined',
          keepAlive: false,
        },
        component: () => import('@/views/repair/enter/index.vue'),
      },
    ],
  },
];

export default routes;
