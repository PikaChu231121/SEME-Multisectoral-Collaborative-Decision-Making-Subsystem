from flask import Flask, request, jsonify
from flask_cors import CORS
import tempfile
import os
from backend import calc, find_optimal_split

app = Flask(__name__)
CORS(app)  # 允许跨域请求

@app.route('/analyze', methods=['POST'])
def analyze():
    # 接收上传的文件和参数
    model_file = request.files['model']
    image_file = request.files['image']
    bandwidth = float(request.form['bandwidth'])
    
    # 保存临时文件
    temp_dir = tempfile.gettempdir()
    model_path = os.path.join(temp_dir, model_file.filename)
    image_path = os.path.join(temp_dir, image_file.filename)
    model_file.save(model_path)
    image_file.save(image_path)
    
    # 执行计算
    layer_latencies, output_sizes, layer_names = calc(model_path, image_path)
    optimal_split, min_cost = find_optimal_split(layer_latencies, output_sizes, bandwidth)
    
    # 清理临时文件
    os.remove(model_path)
    os.remove(image_path)
    
    return jsonify({
        "layer_latencies": layer_latencies,
        "output_sizes": output_sizes,
        "layer_names": layer_names,
        "optimal_split": optimal_split,
        "min_cost": min_cost
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)
    