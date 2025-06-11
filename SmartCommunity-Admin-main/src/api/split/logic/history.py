from db import SessionLocal, SplitPointResult, LayerMetric  # 假设 ORM 模型从 models 模块导入

# -----------------------
# 分割点检测历史接口
# -----------------------

def get_split_history(page, page_size):
    db = SessionLocal()
    
    try:
        offset = (page - 1) * page_size
        total = db.query(SplitPointResult).count()
        split_results = db.query(SplitPointResult)\
                        .order_by(SplitPointResult.created_at.desc())\
                        .offset(offset)\
                        .limit(page_size)\
                        .all()

        records = []
        for result in split_results:
            metrics = db.query(LayerMetric)\
                        .filter(LayerMetric.task_id == result.task_id)\
                        .order_by(LayerMetric.layer_index)\
                        .all()

            records.append({
                "task_id": result.task_id,
                "model_id": result.model_id,
                "edge_id": result.edge_id,
                "server_id": result.server_id,
                "input_text": result.input_text,
                "bandwidth": result.bandwidth,
                "optimal_split": result.optimal_split,
                "predicted_latency": result.predicted_latency,
                "created_at": result.created_at.strftime("%Y-%m-%d %H:%M:%S"),
                "layer_names": [m.layer_name for m in metrics],
                "layer_latencies": [m.latency for m in metrics],
                "output_sizes": [m.output_size for m in metrics]
            })
    finally:
        db.close()

    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "records": records
    }
