import uuid
from datetime import datetime
from sqlalchemy.orm import Session
from logic.analysis_llm import analyze_onnx_model
from utils.split_algorithm import find_optimal_split
from db import get_device_info, get_model_path, insert_split_result, insert_layer_metrics


def run_split_point_detection(
    db: Session,
    model_id: str,
    edge_id: str,
    server_id: str,
    input_text: str,
    bandwidth: float
) -> dict:
    """
    执行分割点检测主流程
    """
    # 生成 task_id
    task_id = str(uuid.uuid4())

    # 获取模型路径
    model_path = get_model_path(db, model_id)
    if not model_path:
        raise ValueError(f"模型未找到: {model_id}")

    # 设备合法性校验
    if not get_device_info(db, edge_id) or not get_device_info(db, server_id):
        raise ValueError("终端或服务器设备未注册")

    # 执行推理分析，返回每层 latency/output_size/name
    layer_latencies, output_sizes, layer_names = analyze_onnx_model(model_path, input_text)

    # 运行优化算法，得出最优分割点
    optimal_split, predicted_latency = find_optimal_split(layer_latencies, output_sizes, bandwidth)

    # 入库：主表记录
    insert_split_result(
        db,
        task_id=task_id,
        model_id=model_id,
        edge_id=edge_id,
        server_id=server_id,
        input_text=input_text,
        bandwidth=bandwidth,
        optimal_split=optimal_split,
        predicted_latency=predicted_latency,
        created_at=datetime.now()
    )

    # 入库：各层详细指标
    insert_layer_metrics(
        db,
        task_id=task_id,
        layer_metrics=[
            {
                "layer_index": idx,
                "layer_name": name,
                "latency": lat,
                "output_size": size
            }
            for idx, (name, lat, size) in enumerate(zip(layer_names, layer_latencies, output_sizes))
        ]
    )

    return {
        "task_id": task_id,
        "optimal_split": optimal_split,
        "predicted_latency": predicted_latency,
        "layer_names": layer_names,
        "layer_latencies": layer_latencies,
        "output_sizes": output_sizes
    }
