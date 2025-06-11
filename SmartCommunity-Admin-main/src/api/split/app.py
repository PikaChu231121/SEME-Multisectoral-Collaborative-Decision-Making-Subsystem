# app.py
# Unified Flask application with all API routes

from flask import Flask, request, jsonify
from flask_cors import CORS
from db import SessionLocal, get_model_path, get_device_info
from utils.split_algorithm import find_optimal_split
from logic.registry import register_device, query_device, register_model, query_model
from logic.history import fetch_split_history
import requests

app = Flask(__name__)
CORS(app)

# -------------------- Device API --------------------

@app.route('/register_device', methods=['POST'])
def api_register_device():
    data = request.get_json()
    required = ['device_id', 'cpu', 'gpu', 'ram', 'endpoint_url']
    if not all(k in data for k in required):
        return jsonify({'error': 'Missing fields'}), 400

    result = register_device(
        device_id=data['device_id'],
        cpu=data['cpu'],
        gpu=data['gpu'],
        ram=data['ram'],
        endpoint_url=data['endpoint_url']
    )
    return jsonify(result)


@app.route('/query_device_info', methods=['GET'])
def api_query_device():
    device_id = request.args.get('device_id')
    if not device_id:
        return jsonify({'error': 'Missing device_id'}), 400

    info = query_device(device_id)
    if info:
        return jsonify(info)
    else:
        return jsonify({'error': 'Device not found'}), 404

# -------------------- Model API --------------------

@app.route('/register_model', methods=['POST'])
def api_register_model():
    data = request.get_json()
    required = ['model_id', 'version', 'storage_path']
    if not all(k in data for k in required):
        return jsonify({'error': 'Missing fields'}), 400

    result = register_model(
        model_id=data['model_id'],
        version=data['version'],
        storage_path=data['storage_path']
    )
    return jsonify(result)


@app.route('/query_model_info', methods=['GET'])
def api_query_model():
    model_id = request.args.get('model_id')
    if not model_id:
        return jsonify({'error': 'Missing model_id'}), 400

    info = query_model(model_id)
    if info:
        return jsonify(info)
    else:
        return jsonify({'error': 'Model not found'}), 404

# -------------------- Split Point Detection --------------------

@app.route("/detect_split_point", methods=["POST"])
def detect_split_point():
    data = request.get_json()

    model_id = data.get("model_id")
    edge_id = data.get("edge_id")
    server_id = data.get("server_id")
    input_text = data.get("input_text")

    db = SessionLocal()
    model_path = get_model_path(db, model_id)
    edge = get_device_info(db, edge_id)
    server = get_device_info(db, server_id)

    # 1. 调用 edge 执行评估
    edge_response = requests.post(
        f"{edge['endpoint_url']}/run_edge",
        json={"model_path": model_path, "input_text": input_text},
        timeout=10
    )
    edge_data = edge_response.json()

    # 2. 调用 server 执行评估
    server_response = requests.post(
        f"{server['endpoint_url']}/run_server",
        json={"model_path": model_path, "input_text": input_text},
        timeout=10
    )
    server_data = server_response.json()

    # 3. 带宽探测
    bw_response = requests.post(
        f"{server['endpoint_url']}/detect_bandwidth",
        json={"target_url": f"{edge['endpoint_url']}/echo"},
        timeout=10
    )
    bandwidth = bw_response.json().get("bandwidth", 1.0)

    # 4. 合并层评估数据
    latencies = edge_data["latency"] + server_data["latency"]
    outputs = edge_data["output_size"] + server_data["output_size"]
    names = edge_data["layer_names"] + server_data["layer_names"]

    split, delay = find_optimal_split(latencies, outputs, bandwidth)

    return jsonify({
        "optimal_split": split,
        "predicted_latency": delay,
        "layer_latencies": latencies,
        "output_sizes": outputs,
        "layer_names": names
    })


# -------------------- History Query --------------------

@app.route("/get_split_history", methods=["GET"])
def get_split_history():
    page = int(request.args.get("page", 1))
    page_size = int(request.args.get("page_size", 10))
    db = SessionLocal()
    results = fetch_split_history(db, page=page, page_size=page_size)
    return jsonify(results)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)
