def find_optimal_split(layer_latencies, output_sizes, bandwidth, alpha=1.0, beta=1.0):
    """
    计算最优分割点（返回分割层编号及总延迟）
    
    参数：
        - layer_latencies: List[float] 每层计算时间（ms）
        - output_sizes: List[float] 每层输出大小（MB）
        - bandwidth: float 网络带宽（MB/s）
        - alpha, beta: float 权重参数（可调节传输与计算权重）

    返回：
        - optimal_split: int 最优分割层编号
        - min_delay: float 估算总延迟（ms）
    """
    min_cost = float('inf')
    optimal_split = 0
    total_layers = len(layer_latencies)

    for split_point in range(total_layers):
        client_time = sum(layer_latencies[:split_point + 1])
        transmission_time = (output_sizes[split_point] / bandwidth) * 1000  # 秒 -> 毫秒
        server_time = sum(layer_latencies[split_point + 1:]) * 0.5  # 服务器效率更高

        total_cost = alpha * transmission_time + beta * (client_time + server_time)

        if total_cost < min_cost:
            min_cost = total_cost
            optimal_split = split_point

    min_delay = sum(layer_latencies[:optimal_split + 1]) + \
                (output_sizes[optimal_split] / bandwidth) * 1000 + \
                sum(layer_latencies[optimal_split + 1:]) * 0.5

    return optimal_split, round(min_delay, 2)
