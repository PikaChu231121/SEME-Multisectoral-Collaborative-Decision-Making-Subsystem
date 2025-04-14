import type { RouteRecordRaw } from 'vue-router';
import { t } from '@/hooks/useI18n';

const moduleName = 'chat';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/chat',
    name: moduleName,
    meta: {
      title: t('routes.chat.chat'),
      icon: 'ant-design:wechat-outlined',
    },
    component: () => import('@/views/chat/index.vue'),
  },
];

export default routes;
