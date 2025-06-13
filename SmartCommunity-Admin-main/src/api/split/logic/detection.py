import datetime
import requests
import uuid
from db import SessionLocal, get_model_path, get_device_info, insert_split_result, insert_layer_metrics
from utils.split_algorithm import find_optimal_split

# -----------------------
# 分割点检测主流程接口
# -----------------------

last_bandwidth = 100.0

def detect_split_point(model_id, edge_id, server_id, input_text):
    db = SessionLocal()
    
    try:
        model_path = get_model_path(db, model_id)
        edge = get_device_info(db, edge_id)
        server = get_device_info(db, server_id)

        # 1. 调用 edge 执行评估
        edge_response = requests.post(
            f"{edge.endpoint_url}/run_edge",
            json={"model_path": model_path, "input_text": input_text},
            timeout=10
        )
        edge_data = edge_response.json()

        # 2. 调用 server 执行评估
        server_response = requests.post(
            f"{server.endpoint_url}/run_server",
            json={"model_path": model_path, "input_text": input_text},
            timeout=10
        )
        server_data = server_response.json()

        # 3. 带宽探测
        bw_response = requests.post(
            f"{server.endpoint_url}/detect_bandwidth",
            json={"target_url": f"{edge.endpoint_url}/echo"},
            timeout=10
        )
        bandwidth = bw_response.json().get("bandwidth", last_bandwidth)
        if bandwidth == 0:
            bandwidth = last_bandwidth
        bandwidth = max(bandwidth, 0.1)  # 确保带宽不为0

        # 4. 合并层评估数据
        client_latencies = edge_data["latency"]
        server_latencies = server_data["latency"]
        outputs = server_data["output_size"]
        names = server_data["layer_names"]

        split, delay = find_optimal_split(client_latencies, server_latencies, outputs, bandwidth)
        latencies = client_latencies[:split+1] + server_latencies[split+1:]
        
        # 5. 保存结果到数据库
        task_id = str(uuid.uuid4())
        layer_metrics = [
            {
                "task_id": task_id,
                "layer_index": i,
                "layer_name": names[i],
                "latency": latencies[i],
                "output_size": outputs[i]
            } for i in range(len(latencies))
        ]
        insert_split_result(
            db, task_id, model_id, edge_id, server_id,
            input_text, bandwidth, split, delay,
            created_at=datetime.datetime.utcnow()
        )
        insert_layer_metrics(db, task_id, layer_metrics)
    finally:
        db.close()

    return {
        "optimal_split": split,
        "predicted_latency": delay,
        "layer_latencies": latencies,
        "output_sizes": outputs,
        "layer_names": names
    }
