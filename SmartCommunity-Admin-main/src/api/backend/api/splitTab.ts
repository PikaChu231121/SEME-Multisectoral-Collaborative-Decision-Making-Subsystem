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
  device_type: string;
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
export const deleteModel = (data: { model_id: string }) => {
  return axios.delete(`${BASE_URL}/delete_model`, { data });
};

// 设备删除接口
export const deleteDevice = (data: { device_id: string }) => {
  return axios.delete(`${BASE_URL}/delete_device`, { data });
};

// 更新模型信息接口
export const updateModel = (data: { version: string; storage_path: string }) => {
  return axios.put(`${BASE_URL}/update_model`, data);
};

// 更新设备信息接口
export const updateDevice = (data: {
  device_id: string;
  device_type?: string;
  cpu?: string;
  gpu?: string;
  ram?: string;
  endpoint_url?: string;
  status?: string;
}) => {
  return axios.put(`${BASE_URL}/update_device`, data);
};

// 调用分割算法接口
export const handleSPDetect = (data: {
  model_id: string;
  edge_id: string;
  server_id: string;
  input_text: string;
}) => {
  return axios.post(`${BASE_URL}/detect_split_point`, data);
};

// 新增模型部署接口
export const deployModel = (data: { model_id: string; device_id: string }) => {
  return axios.post(`${BASE_URL}/deploy_model`, data);
};

export const undeployModel = (data: { model_id: string; device_id: string }) => {
  return axios.post(`${BASE_URL}/undeploy_model`, data);
};

export const queryModelDevices = (params: { model_id: string }) => {
  return axios.get(`${BASE_URL}/model_devices`, { params });
};

export const queryDeviceModels = (params: { device_id: string }) => {
  return axios.get(`${BASE_URL}/device_models`, { params });
};
