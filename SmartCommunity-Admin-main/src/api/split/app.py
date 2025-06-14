# app.py
# Unified Flask application with all API routes

from flask import Flask, request, jsonify
from flask_cors import CORS
from logic.detection import detect_split_point
from logic.registry import *
from logic.history import get_split_history
from logic.deployment import *
from apscheduler.schedulers.background import BackgroundScheduler

app = Flask(__name__)
CORS(app)

# -------------------- Device API --------------------

@app.route('/register_device', methods=['POST'])
def api_register_device():
    data = request.get_json()
    required = ['device_id', 'device_type', 'cpu', 'gpu', 'ram', 'endpoint_url']
    if not all(k in data for k in required):
        return jsonify({'error': 'Missing fields'}), 400

    result = register_device(
        device_id=data['device_id'],
        device_type=data['device_type'],
        cpu=data['cpu'],
        gpu=data['gpu'],
        ram=data['ram'],
        endpoint_url=data['endpoint_url']
    )
    return jsonify(result), (200 if result['status'] == 'success' else 403 if result['status'] == 'exists' else 500)


@app.route('/delete_device', methods=['DELETE'])
def api_delete_device():
    data = request.get_json()
    device_id = data.get('device_id')
    if not device_id:
        return jsonify({'error': 'Missing device_id'}), 400

    result = delete_device(device_id)
    return jsonify(result), (200 if result['status'] == 'success' else 404 if result['status'] == 'error' else 500)


@app.route('/update_device', methods=['PUT'])
def api_update_device():
    data = request.get_json()
    device_id = data.get('device_id')
    if not device_id:
        return jsonify({'error': 'Missing device_id'}), 400

    result = update_device(
        device_id=device_id,
        device_type=data.get('device_type'),
        cpu=data.get('cpu'),
        gpu=data.get('gpu'),
        ram=data.get('ram'),
        endpoint_url=data.get('endpoint_url'),
        status=data.get('status')
    )
    return jsonify(result), (200 if result['status'] == 'success' else (404 if "not found" in result['message'] else 400) if result['status'] == 'error' else 500)


@app.route('/query_device_list', methods=['GET'])
def api_query_device_list():
    devices = list_devices()
    return jsonify(devices)


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


@app.route('/heartbeat', methods=['POST'])
def api_heartbeat():
    data = request.get_json()
    device_id    = data.get('device_id')
    endpoint_url = data.get('endpoint_url')

    if not device_id:
        return jsonify({'error': 'Missing device_id'}), 400

    result = heartbeat(
        device_id=device_id,
        endpoint_url=endpoint_url
    )
    return jsonify(result), (200 if result['status'] == 'success' else 404)


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
    return jsonify(result), (200 if result['status'] == 'success' else 403 if result['status'] == 'exists' else 500)


@app.route('/delete_model', methods=['DELETE'])
def api_delete_model():
    data = request.get_json()
    model_id = data.get('model_id')
    if not model_id:
        return jsonify({'error': 'Missing model_id'}), 400

    result = delete_model(model_id)
    return jsonify(result), (200 if result['status'] == 'success' else 404 if result['status'] == 'error' else 500)


@app.route('/update_model', methods=['PUT'])
def api_update_model():
    data = request.get_json()
    model_id = data.get('model_id')
    if not model_id:
        return jsonify({'error': 'Missing model_id'}), 400

    result = update_model(
        model_id=model_id,
        version=data.get('version'),
        storage_path=data.get('storage_path')
    )
    return jsonify(result), (200 if result['status'] == 'success' else 404 if result['status'] == 'error' else 500)


@app.route('/query_model_list', methods=['GET'])
def api_query_model_list():
    models = list_models()
    return jsonify(models)


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


# -------------------- Model Deployment API --------------------

@app.route('/deploy_model', methods=['POST'])
def api_deploy_model():
    data = request.get_json()
    if not data or 'model_id' not in data or 'device_id' not in data:
        return jsonify({"error": "model_id and device_id required"}), 400
    result, code = deploy_model_to_device(data['model_id'], data['device_id'])
    return jsonify(result), code


@app.route('/undeploy_model', methods=['POST'])
def api_undeploy_model():
    data = request.get_json()
    if not data or 'model_id' not in data or 'device_id' not in data:
        return jsonify({"error": "model_id and device_id required"}), 400
    result, code = undeploy_model_from_device(data['model_id'], data['device_id'])
    return jsonify(result), code


@app.route('/model_devices', methods=['GET'])
def api_model_devices():
    model_id = request.args.get('model_id')
    if not model_id:
        return jsonify({"error": "model_id query param required"}), 400
    devices = list_devices_for_model(model_id)
    return jsonify({"model_id": model_id, "deployed_devices": devices})


@app.route('/device_models', methods=['GET'])
def api_device_models():
    device_id = request.args.get('device_id')
    if not device_id:
        return jsonify({"error": "device_id query param required"}), 400
    models = list_models_for_device(device_id)
    return jsonify({"device_id": device_id, "deployed_models": models})


# -------------------- Split Point Detection --------------------

@app.route("/detect_split_point", methods=["POST"])
def api_detect_split_point():
    data = request.get_json()

    model_id = data.get("model_id")
    edge_id = data.get("edge_id")
    server_id = data.get("server_id")
    input_text = data.get("input_text")
    
    if not all([model_id, edge_id, server_id, input_text]):
        return jsonify({'error': 'Missing required fields'}), 400
    if not isinstance(input_text, str):
        return jsonify({'error': 'input_text must be a string'}), 400

    if not query_device(edge_id):
        return jsonify({'error': 'Edge device not found'}), 404
    if not query_device(server_id):
        return jsonify({'error': 'Server device not found'}), 404
    if not query_model(model_id):
        return jsonify({'error': 'Model not found'}), 404
    
    result = detect_split_point(
        model_id=model_id,
        edge_id=edge_id,
        server_id=server_id,
        input_text=input_text
    )
    if result:
        return jsonify(result)
    else:
        return jsonify({'error': 'Failed to detect split point'}), 500


# -------------------- History Query --------------------

@app.route("/get_split_history", methods=["GET"])
def api_get_split_history():
    page = int(request.args.get("page", 1))
    page_size = int(request.args.get("page_size", 10))
    results = get_split_history(page=page, page_size=page_size)
    return jsonify(results)


if __name__ == '__main__':
    scheduler = BackgroundScheduler()
    scheduler.add_job(mark_offline_devices, 'interval', seconds=10)
    scheduler.start()
    print("Scheduler started. Marking offline devices every 10 seconds.")
    
    app.run(host='0.0.0.0', port=5002)
    