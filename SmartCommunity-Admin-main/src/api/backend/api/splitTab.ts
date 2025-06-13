import axios from 'axios';

const BASE_URL = 'http://localhost:5002';

// 模型注册接口
export const registerModel = (data: {
  model_id: string;
  version: string;
  storage_path: string;
}) => {
  return axios.post(`${BASE_URL}/register_model`, data);
};

// 设备注册接口
export const registerDevice = (data: {
  device_id: string;
  cpu: string;
  gpu: string;
  ram: string;
  endpoint_url: string;
}) => {
  return axios.post(`${BASE_URL}/register_device`, data);
};

// 获取历史记录列表
export const getSplitHistory = (params: { page: number; page_size: number }) => {
  return axios.get(`${BASE_URL}/get_split_history`, { params });
};

// 查询模型列表
export const queryModelList = () => {
  return axios.get(`${BASE_URL}/query_model_list`);
};

// 查询设备列表
export const queryDeviceList = () => {
  return axios.get(`${BASE_URL}/query_device_list`);
};

// 模型删除接口
export const deleteModel = (data: {model_id: string;}) => {
  return axios.delete(`${BASE_URL}/delete_model`, { data });
}

// 设备删除接口
export const deleteDevice = (data: {device_id: string;}) => {
  return axios.delete(`${BASE_URL}/delete_device`, { data });
}
