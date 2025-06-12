# 后端API接口文档

本文档描述了 SmartCommunity-Admin 后端各 API 接口。

---

## 1. 设备管理接口

### 1.1 注册设备

- **URL**: `/register_device`
- **方法**: `POST`
- **请求参数** (JSON):
  - device_id: string  设备唯一标识
  - cpu: string  CPU 信息
  - gpu: string  GPU 信息
  - ram: string  内存信息
  - endpoint_url: string  设备访问地址
- **返回值** (JSON):
  - 成功: { "status": string, "message": string }
  - 设备已存在: { "status": string, "message": string }
- **响应状态码**:
  - 200 OK (成功)
  - 400 Bad Request (缺失字段)
  - 403 Forbidden (已经注册)
  - 500 Internal Server Error (内部错误)

### 1.2 查询设备信息

- **URL**: `/query_device_info`
- **方法**: `GET`
- **请求参数** (QueryString):
  - device_id: string  设备唯一标识
- **返回值** (JSON):
  - 成功: { "device_id": string, "cpu": string, "gpu": string, "ram": string, "endpoint_url": string, "status": string, "create_time": string }
  - 失败: { "error": string }
- **响应状态码**:
  - 200 OK (成功)
  - 400 Bad Request (缺少 device_id)
  - 404 Not Found (设备不存在)

### 1.3 删除设备

- **URL**: `/delete_device`
- **方法**: `DELETE`
- **请求参数** (JSON):
  - device_id: string  设备唯一标识
- **返回值** (JSON):
  - 成功: { "status": string, "message": string }
  - 失败: { "error": string }
- **响应状态码**:
  - 200 OK (成功)
  - 400 Bad Request (缺少 device_id)
  - 404 Not Found (设备不存在)
  - 500 Internal Server Error (内部错误)

### 1.4 更新设备

- **URL**: `/update_device`
- **方法**: `PUT`
- **请求参数** (JSON):
  - device_id: string  设备唯一标识
  - cpu: string  (可选) CPU 信息
  - gpu: string  (可选) GPU 信息
  - ram: string  (可选) 内存信息
  - endpoint_url: string  (可选) 设备访问地址
  - status: string  (可选) 设备状态 ∈ { "online", "offline" }
- **返回值** (JSON):
  - 成功: { "status": string, "message": string }
  - 失败: { "error": string }
- **响应状态码**:
  - 200 OK (成功)
  - 400 Bad Request (缺少 device_id)
  - 404 Not Found (设备不存在)
  - 500 Internal Server Error (内部错误)

### 1.5 设备心跳

- **URL**: `/heartbeat`
- **方法**: `POST`
- **请求参数** (JSON):
  - device_id: string  设备唯一标识
  - endpoint_url: string  设备访问地址 (可选)
- **返回值** (JSON):
  - 成功: { "status": string, "message": string }
  - 失败: { "error": string }
- **响应状态码**:
  - 200 OK (成功)
  - 400 Bad Request (缺少 device_id)
  - 404 Not Found (设备不存在)

### 1.6 查询设备列表

- **URL**: `/query_device_list`
- **方法**: `GET`
- **请求参数**: 无
- **返回值** (JSON): 设备对象数组，如 [ { "device_id": string, "cpu": string, "gpu": string, "ram": string, "endpoint_url": string, "status": string, "create_time": string }, ... ]
- **响应状态码**:
  - 200 OK (成功)

---

## 2. 模型管理接口

### 2.1 注册模型

- **URL**: `/register_model`
- **方法**: `POST`
- **请求参数** (JSON):
  - model_id: string  模型唯一标识
  - version: string  模型版本号
  - storage_path: string  模型存储路径
- **返回值** (JSON):
  - 成功: { "status": string, "message": string }
  - 模型已存在: { "status": string, "message": string }
- **响应状态码**:
  - 200 OK (成功)
  - 400 Bad Request (缺失字段)
  - 403 Forbidden (已经注册)
  - 500 Internal Server Error (内部错误)

### 2.2 查询模型信息

- **URL**: `/query_model_info`
- **方法**: `GET`
- **请求参数** (QueryString):
  - model_id: string  模型唯一标识
- **返回值** (JSON):
  - 成功: { "model_id": string, "version": string, "storage_path": string, "upload_time": string }
  - 失败: { "error": string }
- **响应状态码**:
  - 200 OK (成功)
  - 400 Bad Request (缺少 model_id)
  - 404 Not Found (模型不存在)

### 2.3 删除模型

- **URL**: `/delete_model`
- **方法**: `DELETE`
- **请求参数** (JSON):
  - model_id: string  模型唯一标识
- **返回值** (JSON):
  - 成功: { "status": string, "message": string }
  - 失败: { "error": string }
- **响应状态码**:
  - 200 OK (成功)
  - 400 Bad Request (缺少 model_id)
  - 404 Not Found (模型不存在)
  - 500 Internal Server Error (内部错误)

### 2.4 更新模型

- **URL**: `/update_model`
- **方法**: `PUT`
- **请求参数** (JSON):
  - model_id: string  模型唯一标识
  - version: string  (可选) 模型版本号
  - storage_path: string  (可选) 模型存储路径
- **返回值** (JSON):
  - 成功: { "status": string, "message": string }
  - 失败: { "error": string }
- **响应状态码**:
  - 200 OK (成功)
  - 400 Bad Request (缺少 model_id)
  - 404 Not Found (模型不存在)
  - 500 Internal Server Error (内部错误)

### 2.5 查询模型列表

- **URL**: `/query_model_list`
- **方法**: `GET`
- **请求参数**: 无
- **返回值** (JSON): 模型对象数组，如 [ { "model_id": string, "version": string, "storage_path": string, "upload_time": string }, ... ]
- **响应状态码**:
  - 200 OK (成功)

---

## 3. 分割点检测接口

### 3.1 分割点检测

- **URL**: `/detect_split_point`
- **方法**: `POST`
- **请求参数** (JSON):
  - model_id: string  模型标识
  - edge_id: string  边缘设备标识
  - server_id: string  服务器设备标识
  - input_text: string  输入文本
- **返回值** (JSON):
  - 成功: {
      "optimal_split": number,
      "predicted_latency": number,
      "layer_latencies": number[],
      "output_sizes": number[],
      "layer_names": string[]
    }
  - 失败: { "error": string }
- **响应状态码**:
  - 200 OK (成功)
  - 400 Bad Request (参数错误)
  - 404 Not Found (模型/边缘设备/服务器设备不存在)
  - 500 Internal Server Error (服务错误)

---

## 4. 分割历史记录查询接口

### 4.1 查询分割历史记录

- **URL**: `/get_split_history`
- **方法**: `GET`
- **请求参数** (QueryString):
  - page: number  页码 (默认：1)
  - page_size: number  每页条数 (默认：10)
- **返回值** (JSON):
  - 成功: {
      "total": number,
      "page": number,
      "page_size": number,
      "records": [
          {
            "task_id": string,
            "model_id": string,
            "edge_id": string,
            "server_id": string,
            "input_text": string,
            "bandwidth": number,
            "optimal_split": number,
            "predicted_latency": number,
            "created_at": string,
            "layer_names": string[],
            "layer_latencies": number[],
            "output_sizes": number[]
          }
          ...
      ]
    }
- **响应状态码**:
  - 200 OK (成功)
  - 400 Bad Request (参数错误)
