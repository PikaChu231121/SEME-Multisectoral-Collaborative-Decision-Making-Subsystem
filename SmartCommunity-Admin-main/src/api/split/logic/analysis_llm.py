import onnxruntime as ort
import numpy as np
import json
import os
import tempfile


def analyze_onnx_model(model_path: str, input_text: str):
    """
    加载 ONNX 模型并执行推理分析，返回每层的 latency、output_size、layer_name
    """
    # 配置 ONNX Runtime 会话，启用 profiling
    so = ort.SessionOptions()
    so.enable_profiling = True

    session = ort.InferenceSession(model_path, sess_options=so, providers=["CPUExecutionProvider"])
    inputs = session.get_inputs()
    input_name = inputs[0].name

    # 文本转 token id（简化版，假设输入为 token id 数组字符串）
    input_ids = encode_input(input_text)

    # 执行一次推理
    session.run(None, {input_name: input_ids})

    # 获取 profiling 文件路径
    profile_path = session.end_profiling()

    # 解析 profiling 文件
    return parse_profiling(profile_path)


def encode_input(text: str):
    """
    模拟 tokenizer，将文本转成固定 shape 的 token ids（实际应使用 tokenizer）
    """
    # 这里只是模拟，真实应用请替换为 tokenizer.encode_plus 等
    max_len = 16
    dummy_token_id = 42
    arr = [dummy_token_id] * min(len(text), max_len)
    padded = arr + [0] * (max_len - len(arr))
    input_array = np.array([padded], dtype=np.int64)
    return input_array


def parse_profiling(profile_path):
    """
    从 ONNX profiling JSON 中提取各层 latency / output_size / layer_name
    """
    with open(profile_path, 'r') as f:
        data = json.load(f)

    layer_latencies = []
    output_sizes = []
    layer_names = []
    added_input = False

    for event in data:
        if event["cat"] == "Node" and "kernel_time" in event["name"]:
            dur = event.get("dur", 0) / 1000  # 转为 ms
            args = event.get("args", {})
            op_name = args.get("op_name", "Unknown")
            out_size = int(args.get("output_size", 0)) * 4 / (1024 * 1024)  # float32 -> MB

            if not added_input:
                layer_latencies.append(0.0)
                output_sizes.append(out_size)
                layer_names.append("Input")
                added_input = True

            layer_latencies.append(dur)
            output_sizes.append(out_size)
            layer_names.append(op_name)

    # 清理 profiling 文件
    try:
        os.remove(profile_path)
    except Exception:
        pass

    return layer_latencies, output_sizes, layer_names
