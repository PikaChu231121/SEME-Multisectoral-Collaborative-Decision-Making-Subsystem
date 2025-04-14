// @ts-ignore
/* eslint-disable */

/**
 * 该文件为 @umijs/openapi 插件自动生成，请勿随意修改。如需修改请通过配置 openapi.config.ts 进行定制化。
 * */

import { request, type RequestOptions } from '@/utils/request';

/** 登录 POST /Admin/login */
export async function authLogin(params: API.LoginDto, options?: RequestOptions) {
  return request<API.LoginResponse>('/Admin/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params,
    isReturnResult: false,
    ...(options || {}),
  });
}

/** 注册 POST /Admin/register */
export async function authRegister(params: API.RegisterDto, options?: RequestOptions) {
  return request<API.RegisterResponse>('/Admin/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params,
    isReturnResult: false,
    ...(options || {}),
  });
}
