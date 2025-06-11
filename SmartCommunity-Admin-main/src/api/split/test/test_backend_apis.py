# test_backend_apis.py
# Script to test backend REST APIs for Split-Learning Planning system

import requests
import json
import uuid

# Base URLs
COORDINATOR_URL = 'http://localhost:5002'
EDGE_URL = 'http://localhost:5001'
SERVER_URL = 'http://localhost:5002'

# 1. Register a device (edge)
edge_device_id = 'edge-' + str(uuid.uuid4())[:8]
resp = requests.post(f"{COORDINATOR_URL}/register_device", json={
    'device_id': edge_device_id,
    'cpu': 'Snapdragon 888',
    'gpu': 'Adreno 660',
    'ram': '8GB',
    'endpoint_url': EDGE_URL
})
print('Register Edge Device:', resp.status_code, resp.json())

# 2. Register a device (server)
server_device_id = 'server-' + str(uuid.uuid4())[:8]
resp = requests.post(f"{COORDINATOR_URL}/register_device", json={
    'device_id': server_device_id,
    'cpu': 'Xeon E5',
    'gpu': 'NVIDIA T4',
    'ram': '32GB',
    'endpoint_url': SERVER_URL
})
print('Register Server Device:', resp.status_code, resp.json())

# 3. Register a model
model_id = 'gpt2_demo'
resp = requests.post(f"{COORDINATOR_URL}/register_model", json={
    'model_id': model_id,
    'version': '1.0.0',
    'storage_path': '/home/ubuntu/models/gpt2/decoder_model.onnx'
})
print('Register Model:', resp.status_code, resp.json())

# 4. Query device info
resp = requests.get(f"{COORDINATOR_URL}/query_device_info", params={'device_id': edge_device_id})
print('Query Edge Info:', resp.status_code, resp.json())
resp = requests.get(f"{COORDINATOR_URL}/query_device_info", params={'device_id': server_device_id})
print('Query Server Info:', resp.status_code, resp.json())

# 5. Query model info
resp = requests.get(f"{COORDINATOR_URL}/query_model_info", params={'model_id': model_id})
print('Query Model Info:', resp.status_code, resp.json())

# 6. Run split point detection
payload = {
    'model_id': model_id,
    'edge_id': edge_device_id,
    'server_id': server_device_id,
    'input_text': 'Fire detected in sector 7, please respond.',
}
resp = requests.post(f"{COORDINATOR_URL}/detect_split_point", json=payload)
print('Detect Split Point:', resp.status_code)
result = resp.json()
print(json.dumps(result, indent=2))

task_id = result.get('task_id', None)

# 7. Query history
resp = requests.get(f"{COORDINATOR_URL}/get_split_history", params={'page':1, 'page_size':10})
print('Get Split History:', resp.status_code, json.dumps(resp.json(), indent=2))

# 8. Test edge direct interface
resp = requests.post(f"{EDGE_URL}/run_edge", json={'model_path': result['model_id'], 'input_text': payload['input_text']})
print('Edge run_edge [direct]:', resp.status_code, resp.json())

# 9. Test server direct interface
resp = requests.post(f"{SERVER_URL}/run_server", json={'model_path': result['model_id'], 'input_text': payload['input_text']})
print('Server run_server [direct]:', resp.status_code, resp.json())

# 10. Test bandwidth
resp = requests.post(f"{SERVER_URL}/detect_bandwidth", json={'target_url': f"{EDGE_URL}/echo", 'packet_size':1024, 'count':3})
print('Detect Bandwidth [direct]:', resp.status_code, resp.json())

# 11. Test echo
resp = requests.post(f"{EDGE_URL}/echo")
print('Echo edge:', resp.status_code, resp.text)
