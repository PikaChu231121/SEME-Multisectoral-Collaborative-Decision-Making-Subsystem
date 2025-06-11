def find_optimal_split(
    client_latencies: list[float],
    server_latencies: list[float],
    output_sizes: list[float],
    bandwidth: float,
    alpha: float = 1.0,
    beta: float = 1.0
) -> tuple[int, float]:
    """
    计算最优分割点，返回 (optimal_split_index, estimated_total_delay)

    参数:
      client_latencies: 客户端每层延迟(ms) 列表
      server_latencies: 服务器端每层延迟(ms) 列表（与 client_latencies 等长）
      output_sizes: 每层输出大小(KB) 列表
      bandwidth: 网络带宽 (B/ms)
      alpha: 传输时间权重
      beta: 计算时间权重

    返回:
      optimal_split: 最优分割层索引
      total_delay: 对应的端到端延迟(ms)
    """
    assert len(client_latencies) == len(server_latencies) == len(output_sizes), \
        "Layer lists must have same length"

    min_cost = float('inf')
    best_split = 0
    best_delay = 0.0
    n = len(client_latencies)

    for split in range(n):
        # 客户端计算：第0层到split层
        client_time = sum(client_latencies[:split + 1])
        # 传输时间：split层输出大小 (KB) / (带宽 (B/ms) / 1024)
        transmission_time = output_sizes[split] / (bandwidth / 1024)    # 转换为 KB/ms
        # 服务器计算：split层之后的所有层（不含 split 层，因为已在客户端计算）
        server_time = sum(server_latencies[split + 1:])

        # 综合成本/延迟
        cost = alpha * transmission_time + beta * (client_time + server_time)
        delay = client_time + transmission_time + server_time

        if cost < min_cost:
            min_cost = cost
            best_split = split
            best_delay = delay

    return best_split, round(best_delay, 2)
