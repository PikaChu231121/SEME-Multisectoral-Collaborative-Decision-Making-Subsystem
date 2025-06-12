import axios from 'axios';

// 模型注册接口
export const registerModel = (data: {
  model_id: string;
  version: string;
  storage_path: string;
}) => {
  return axios.post('/register_model', data);
};

// 设备注册接口
export const registerDevice = (data: {
  device_id: string;
  cpu: string;
  gpu: string;
  ram: string;
  endpoint_url: string;
}) => {
  return axios.post('/register_device', data);
};

// 获取历史记录列表
export const getSplitHistory = (params: { page: number; page_size: number }) => {
  return axios.get('/get_split_history', { params });
};

// 获取历史记录详情
export const getSplitHistoryDetail = (taskId: string) => {
  return axios.get(`/get_split_history?task_id=${taskId}`);
};
