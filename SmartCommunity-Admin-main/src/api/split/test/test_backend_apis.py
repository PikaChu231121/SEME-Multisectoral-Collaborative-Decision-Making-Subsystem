# test_backend_apis.py
# Script to test backend REST APIs for Split-Learning Planning system

import requests
import json
import uuid

# Base URLs
COORDINATOR_URL = 'http://localhost:5002'
EDGE_URL = 'http://100.76.197.15:5001'
SERVER_URL = 'http://100.84.58.152:5002'

# 1. Register a device (edge)
edge_device_id = 'NVIDIA-Jetson-' + str(uuid.uuid4())[:8]
resp = requests.post(f"{COORDINATOR_URL}/register_device", json={
    'device_id': edge_device_id,
    'device_type': 'edge',
    'cpu': 'NVIDIA Jetson Xavier NX',
    'gpu': 'NVIDIA Volta',
    'ram': '8GB',
    'endpoint_url': EDGE_URL
})
print('Register Edge Device:', resp.status_code, resp.json())

# 2. Register a device (server)
server_device_id = 'Lab-Server-Ubuntu-' + str(uuid.uuid4())[:8]
resp = requests.post(f"{COORDINATOR_URL}/register_device", json={
    'device_id': server_device_id,
    'device_type': 'server',
    'cpu': 'Xeon E5',
    'gpu': 'NVIDIA T4',
    'ram': '32GB',
    'endpoint_url': SERVER_URL
})
print('Register Server Device:', resp.status_code, resp.json())

# 3. Register a model
model_id = 'GPT-2'
resp = requests.post(f"{COORDINATOR_URL}/register_model", json={
    'model_id': model_id,
    'version': '1.5B',
    'storage_path': 'models/gpt2/decoder_model.onnx'
})
print('Register Model:', resp.status_code, resp.json())

# 4. Deploy model to edge device
resp = requests.post(f"{COORDINATOR_URL}/deploy_model", json={
    'model_id': model_id,
    'device_id': edge_device_id
})
print('Deploy Model to Edge:', resp.status_code, resp.json())

# 5. Deploy model to server device
resp = requests.post(f"{COORDINATOR_URL}/deploy_model", json={
    'model_id': model_id,
    'device_id': server_device_id
})
print('Deploy Model to Server:', resp.status_code, resp.json())

# 6. Query device info
resp = requests.get(f"{COORDINATOR_URL}/query_device_info", params={'device_id': edge_device_id})
print('Query Edge Info:', resp.status_code, resp.json())
resp = requests.get(f"{COORDINATOR_URL}/query_device_info", params={'device_id': server_device_id})
print('Query Server Info:', resp.status_code, resp.json())

# 7. Query model info
resp = requests.get(f"{COORDINATOR_URL}/query_model_info", params={'model_id': model_id})
print('Query Model Info:', resp.status_code, resp.json())

# 8. Query model deployment
resp = requests.get(f"{COORDINATOR_URL}/model_devices", params={'model_id': model_id})
print('Query Model On Devices:', resp.status_code, resp.json())
resp = requests.get(f"{COORDINATOR_URL}/device_models", params={'device_id': edge_device_id})
print('Query Edge Device Models:', resp.status_code, resp.json())
resp = requests.get(f"{COORDINATOR_URL}/device_models", params={'device_id': server_device_id})
print('Query Server Device Models:', resp.status_code, resp.json())

# 9. Run split point detection
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

# 10. Query history
resp = requests.get(f"{COORDINATOR_URL}/get_split_history", params={'page':1, 'page_size':10})
print('Get Split History:', resp.status_code, json.dumps(resp.json(), indent=2))
