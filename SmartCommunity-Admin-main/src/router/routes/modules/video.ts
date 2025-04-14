import type { RouteRecordRaw } from 'vue-router';
import { t } from '@/hooks/useI18n';

const moduleName = 'video';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/video',
    name: moduleName,
    meta: {
      title: t('routes.video.video'),
      // 改icon
      icon: 'ant-design:video-camera-outlined',
    },
    component: () => import('@/views/video/index.vue'),
  },
];

export default routes;
