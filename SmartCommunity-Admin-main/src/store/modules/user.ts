import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useLockscreenStore } from './lockscreen';
import { useSSEStore } from './sse';
import type { RouteRecordRaw } from 'vue-router';
import { store } from '@/store';
import Api from '@/api/';
import { resetRouter } from '@/router';
import { generateDynamicRoutes } from '@/router/helper/routeHelper';

export const useUserStore = defineStore(
  'user',
  () => {
    const sseStore = useSSEStore();
    const lockscreenStore = useLockscreenStore();
    const token = ref<string>();
    const perms = ref<string[]>([]);
    const menus = ref<RouteRecordRaw[]>([]);
    const userInfo = ref<Partial<API.UserEntity>>({});

    const sortMenus = (menus: RouteRecordRaw[] = []) => {
      return menus
        .filter((n) => {
          const flag = !n.meta?.hideInMenu;
          if (flag && n.children?.length) {
            n.children = sortMenus(n.children);
          }
          return flag;
        })
        .sort((a, b) => ~~Number(a.meta?.orderNo) - ~~Number(b.meta?.orderNo));
    };

    /** 清空登录态(token、userInfo...) */
    const clearLoginStatus = () => {
      token.value = '';
      perms.value = [];
      menus.value = [];
      userInfo.value = {};
      resetRouter();
      setTimeout(() => {
        localStorage.clear();
      });
    };
    /** 登录成功保存token */
    const setToken = (_token: string) => {
      token.value = _token;
    };
    /** 登录 */
    const login = async (params: API.LoginDto) => {
      const data = await Api.auth.authLogin(params);
      console.log(data);

      if (data.code == 200) {
        setToken(data.token);
        await afterLogin();
        lockscreenStore.setLock(false);
        lockscreenStore.saveLoginPwd(params.password);
      } else {
        return Promise.reject(data.message);
      }
    };
    /** 登录成功之后, 获取用户信息以及生成权限路由 */
    const afterLogin = async () => {
      try {
        // const { accountProfile } = Api.account;
        // const wsStore = useWsStore();
        // const userInfoData = await accountProfile();

        // userInfo.value = userInfoData;
        await fetchPermsAndMenus();
        sseStore.initServerMsgListener();
      } catch (error) {
        return Promise.reject(error);
        // return logout();
      }
    };
    /** 获取权限及菜单 */
    const fetchPermsAndMenus = async () => {
      // const { accountPermissions } = Api.account;
      // const wsStore = useWsStore();
      // const [permsData] = await Promise.all([accountPermissions()]);
      // perms.value = permsData;
      const result = generateDynamicRoutes();
      menus.value = sortMenus(result);
    };
    /** 登出 */
    const logout = async () => {
      // await Api.account.accountLogout();
      sseStore.closeEventSource();
      clearLoginStatus();
    };
    /** 注册 */
    const register = async (params: API.RegisterDto) => {
      const data = await Api.auth.authRegister(params);
      console.log(data);

      if (data.code != 200) {
        return Promise.reject(data.message);
      }
    };

    return {
      token,
      perms,
      menus,
      userInfo,
      login,
      afterLogin,
      logout,
      clearLoginStatus,
      fetchPermsAndMenus,
      register,
    };
  },
  {
    persist: {
      pick: ['token'],
    },
  },
);

// 在组件setup函数外使用
export function useUserStoreWithOut() {
  return useUserStore(store);
}
