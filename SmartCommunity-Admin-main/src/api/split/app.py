# app.py
# Unified Flask application with all API routes

from flask import Flask, request, jsonify
from flask_cors import CORS
from logic.detection import detect_split_point
from logic.registry import register_device, query_device, register_model, query_model
from logic.history import get_split_history

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
def api_detect_split_point():
    data = request.get_json()

    model_id = data.get("model_id")
    edge_id = data.get("edge_id")
    server_id = data.get("server_id")
    input_text = data.get("input_text")

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
    app.run(host='0.0.0.0', port=5002)
