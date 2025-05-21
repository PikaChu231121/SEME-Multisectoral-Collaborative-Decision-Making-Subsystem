import { RouterView } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

/**
 * 响应历史模块
 */
const responseHistory: RouteRecordRaw = {
    path: '/response-history',
    name: 'response-history',
    component: RouterView,
    meta: {
        icon: 'mdi:history', // 你也可以换成其他图标
        title: '响应历史',
        sort: 5, // 比 timeline 稍晚显示
    },
    children: [
        {
            path: 'list',
            name: 'response-history-list',
            component: () => import('@/views/responseHistory/index.vue'),
            meta: {
                title: '历史记录列表',
                icon: 'mdi:list-box',
            },
        },
        {
            path: 'detail/:id',
            name: 'response-history-detail',
            component: () => import('@/views/responseHistory/detail.vue'),
            meta: {
                title: '响应历史详情',
                icon: 'mdi:file-document',
                hidden: true, // ✅ 隐藏在侧边栏
            },
        },

    ],
};

export default responseHistory;
