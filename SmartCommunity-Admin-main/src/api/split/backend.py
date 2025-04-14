import onnxruntime as ort
import numpy
import json
from PIL import Image


DYNAMIC_DIM_NAMES = ("N", "BATCH_SIZE")


def calc(model_path, image_path):
    """计算层时延和输出规模，并以列表形式返回"""
    options = ort.SessionOptions()              # 分析选项

    options.enable_profiling = True

    session = ort.InferenceSession(model_path, options)     # ONNX Runtime会话
    input_name = session.get_inputs()[0].name               # 输入节点标识

    input_shape = []             # 输入数据形状
    for dim in session.get_inputs()[0].shape:
        if isinstance(dim, str) and dim.upper() in DYNAMIC_DIM_NAMES:
            input_shape.append(1)
        elif isinstance(dim, int):
            input_shape.append(dim)
        else:
            raise ValueError("Dimension illegal")

    input_data = preprocess(image_path, input_shape)        # 输入数据

    # 启用分析功能运行推理，通过分析文件进行评估
    session.run(None, {input_name: input_data})
    json_path = session.end_profiling()
    return analyze_profile(json_path)


def preprocess(image_path, shape):
    """图像预处理"""
    image = Image.open(image_path)                                                              # 原始图像
    processed_shape = [dim if isinstance(dim, int) else 1 for dim in shape]                     # 整数处理后的维度
    resized_image = adjust_channels(image, processed_shape[1]).resize(processed_shape[-2:])     # 维度调整后的图像
    reordered_image = numpy.transpose(resized_image, (2, 0, 1))                             # 维度重排后的图像
    array = numpy.array(reordered_image, dtype=numpy.float32) / 255.0                           # 图像转数组

    return numpy.resize(numpy.expand_dims(array, 0), processed_shape)


def adjust_channels(image, target):
    """调整图像通道数"""
    current = len(image.getbands())     # 目标通道数

    if current == target:
        return image
    elif current < target:
        return Image.merge(image.mode, (image,) * (target - current))
    else:
        return Image.merge(image.mode[:target], image.split()[:target])


def analyze_profile(profiling_path):
    """解析分析文件得到每层的延迟"""
    layer_latencies = []    # 层延迟
    output_sizes = []       # 层输出
    layer_names = []        # 层名称
    flag = False            # Input处理标识

    # 加载分析文件数据
    with open(profiling_path, 'r') as f:
        data = json.load(f)

    # 统计各层时延和输出规模
    for event in data:        
        if event["cat"] == "Node" and "kernel_time" in event["name"]:
            duration = event.get("dur", 0)          # 操作用时
            arguments = event.get("args", {})       # 参数列表
            if not flag:
                layer_latencies.append(0.0)
                output_sizes.append(int(arguments.get("activation_size", 0)) * numpy.dtype(numpy.float32).itemsize / 2 ** 20)
                layer_names.append("Input")
                flag = True
            layer_latencies.append(duration / 1000)                                                                     # 转换单位为ms
            output_sizes.append(int(arguments.get("output_size", 0)) * numpy.dtype(numpy.float32).itemsize / 2 ** 20)   # 转换单位为MB
            layer_names.append(arguments.get("op_name", "Unknown"))
    
    return layer_latencies, output_sizes, layer_names


def find_optimal_split(layer_latencies, output_sizes, bandwidth):
    """计算最优分割点"""
    min_cost = float('inf')
    optimal_split = 0
    total_layers = len(layer_latencies)

    for split_point in range(total_layers):
        # 客户端计算时间（从第0层到分割点）
        client_time = sum(layer_latencies[:split_point + 1])

        # 数据传输时间（分割点的输出数据大小 / 带宽，转换为ms）
        transmission_time = (output_sizes[split_point] / bandwidth) * 1000  # 秒转毫秒

        # 服务器计算时间（分割点之后的层）
        # 此处假设服务端每层时延为客户端的一半
        server_time = sum(layer_latencies[split_point + 1:]) * 0.5

        total_cost = client_time + transmission_time + server_time

        if total_cost < min_cost:
            min_cost = total_cost
            optimal_split = split_point

    return optimal_split, min_cost
