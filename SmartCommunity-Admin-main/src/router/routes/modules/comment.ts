import type { RouteRecordRaw } from 'vue-router';
import { t } from '@/hooks/useI18n';

const moduleName = 'comment';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/comment',
    name: moduleName,
    redirect: '/comment/comment',
    meta: {
      title: t('routes.comment.comment'),
      icon: 'ant-design:tool-outlined',
    },
    children: [
      {
        path: 'display',
        name: `${moduleName}-display`,
        meta: {
          title: t('routes.comment.display'),
          icon: 'ant-design:file-search-outlined',
          keepAlive: false,
        },
        component: () => import('@/views/comment/display/index.vue'),
      },
      {
        path: 'enter',
        name: `${moduleName}-enter`,
        meta: {
          title: t('routes.comment.enter'),
          icon: 'ant-design:form-outlined',
          keepAlive: false,
        },
        component: () => import('@/views/comment/enter/index.vue'),
      },
    ],
  },
];

export default routes;
