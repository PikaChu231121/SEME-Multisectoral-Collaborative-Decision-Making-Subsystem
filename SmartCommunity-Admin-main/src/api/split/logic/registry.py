from db import SessionLocal, Device, Model
import datetime

# -----------------------
# 设备管理接口
# -----------------------

def register_device(device_id, device_type, cpu, gpu, ram, endpoint_url):
    db = SessionLocal()
    
    try:
        device = db.query(Device).filter_by(device_id=device_id).first()
        if device:
            return {"status": "exists", "message": "Device already registered."}
        
        new_device = Device(
            device_id=device_id,
            device_type=device_type,  # 设备类型，edge 或 server
            cpu=cpu,
            gpu=gpu,
            ram=ram,
            endpoint_url=endpoint_url,
            status="offline",  # 默认状态为离线
            last_heartbeat=None,  # 初始时没有心跳记录
            create_time=datetime.datetime.utcnow()
        )
        db.add(new_device)
        db.commit()
    finally:
        db.close()
        
    return {"status": "success", "message": "Device registered."}


def delete_device(device_id):
    db = SessionLocal()
    
    try:
        device = db.query(Device).filter_by(device_id=device_id).first()
        if not device:
            return {"status": "error", "message": "Device not found."}
        
        db.delete(device)
        db.commit()
    finally:
        db.close()
        
    return {"status": "success", "message": "Device deleted."}


def update_device(device_id, device_type=None, cpu=None, gpu=None, ram=None, endpoint_url=None, status=None):
    db = SessionLocal()
    
    try:
        device = db.query(Device).filter_by(device_id=device_id).first()
        if not device:
            return {"status": "error", "message": "Device not found."}
            
        if device_type:
            if device_type not in ["edge", "server"]:
                return {"status": "error", "message": "Invalid device type. Must be 'edge' or 'server'."}
            device.device_type = device_type
        if cpu:
            device.cpu = cpu
        if gpu:
            device.gpu = gpu
        if ram:
            device.ram = ram
        if endpoint_url:
            device.endpoint_url = endpoint_url
        if status:
            if status not in ["online", "offline"]:
                return {"status": "error", "message": "Invalid status. Must be 'online' or 'offline'."}
            device.status = status
        
        db.commit()
    finally:
        db.close()
        
    return {"status": "success", "message": "Device updated."}


def list_devices():
    db = SessionLocal()
    
    try:
        devices = db.query(Device).all()
    finally:
        db.close()
        
    return [
        {
            "device_id": device.device_id,
            "device_type": device.device_type,
            "cpu": device.cpu,
            "gpu": device.gpu,
            "ram": device.ram,
            "endpoint_url": device.endpoint_url,
            "status": device.status,
            "create_time": device.create_time.strftime("%Y-%m-%d %H:%M:%S")
        } for device in devices
    ]
    

def query_device(device_id):
    db = SessionLocal()
    
    try:
        device = db.query(Device).filter_by(device_id=device_id).first()
        if not device:
            return None
    finally:
        db.close()
        
    return {
        "device_id": device.device_id,
        "device_type": device.device_type,
        "cpu": device.cpu,
        "gpu": device.gpu,
        "ram": device.ram,
        "endpoint_url": device.endpoint_url,
        "status": device.status,
        "create_time": device.create_time.strftime("%Y-%m-%d %H:%M:%S")
    }


def heartbeat(device_id, endpoint_url=None):
    db = SessionLocal()
    
    try:
        device = db.query(Device).filter_by(device_id=device_id).first()
        if not device:
            return {"status": "error", "message": "Device not found."}
        
        device.last_heartbeat = datetime.datetime.utcnow()
        if endpoint_url:
            device.endpoint_url = endpoint_url
        
        db.commit()
    finally:
        db.close()
        
    return {"status": "success", "message": "Heartbeat updated."}


def mark_offline_devices():
    db = SessionLocal()
    
    try:
        cutoff = datetime.datetime.utcnow() - datetime.timedelta(hours=1)  # 1h 超时阈值
        db.query(Device).filter(Device.last_heartbeat is not None and Device.last_heartbeat < cutoff, Device.status=='online') \
            .update({"status": "offline"})
        db.commit()
    finally:
        db.close()


# -----------------------
# 模型管理接口
# -----------------------

def register_model(model_id, version, storage_path):
    db = SessionLocal()
    
    try:
        model = db.query(Model).filter_by(model_id=model_id).first()
        if model:
            return {"status": "exists", "message": "Model already registered."}

        new_model = Model(
            model_id=model_id,
            version=version,
            storage_path=storage_path,
            upload_time=datetime.datetime.utcnow()
        )
        db.add(new_model)
        db.commit()
    finally:
        db.close()
        
    return {"status": "success", "message": "Model registered."}


def delete_model(model_id):
    db = SessionLocal()
    
    try:
        model = db.query(Model).filter_by(model_id=model_id).first()
        if not model:
            return {"status": "error", "message": "Model not found."}
        
        db.delete(model)
        db.commit()
    finally:
        db.close()
        
    return {"status": "success", "message": "Model deleted."}


def update_model(model_id, version=None, storage_path=None):
    db = SessionLocal()
    
    try:
        model = db.query(Model).filter_by(model_id=model_id).first()
        if not model:
            return {"status": "error", "message": "Model not found."}
        
        if version:
            model.version = version
        if storage_path:
            model.storage_path = storage_path
        
        db.commit()
    finally:
        db.close()
        
    return {"status": "success", "message": "Model updated."}


def list_models():
    db = SessionLocal()
    
    try:
        models = db.query(Model).all()
    finally:
        db.close()
        
    return [
        {
            "model_id": model.model_id,
            "version": model.version,
            "storage_path": model.storage_path,
            "upload_time": model.upload_time.strftime("%Y-%m-%d %H:%M:%S")
        } for model in models
    ]


def query_model(model_id):
    db = SessionLocal()
    
    try:
        model = db.query(Model).filter_by(model_id=model_id).first()
        if not model:
            return None
    finally:
        db.close()
        
    return {
        "model_id": model.model_id,
        "version": model.version,
        "storage_path": model.storage_path,
        "upload_time": model.upload_time.strftime("%Y-%m-%d %H:%M:%S")
    }
