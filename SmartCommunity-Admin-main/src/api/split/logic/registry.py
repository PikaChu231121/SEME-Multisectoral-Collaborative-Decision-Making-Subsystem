from db import SessionLocal, Device, Model
import datetime

# -----------------------
# 设备管理接口
# -----------------------

def register_device(device_id, cpu, gpu, ram, endpoint_url):
    db = SessionLocal()
    
    try:
        device = db.query(Device).filter_by(device_id=device_id).first()
        if device:
            return {"status": "exists", "message": "Device already registered."}
        
        new_device = Device(
            device_id=device_id,
            cpu=cpu,
            gpu=gpu,
            ram=ram,
            endpoint_url=endpoint_url,
            create_time=datetime.datetime.utcnow()
        )
        db.add(new_device)
        db.commit()
    finally:
        db.close()
        
    return {"status": "success", "message": "Device registered."}


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
        "cpu": device.cpu,
        "gpu": device.gpu,
        "ram": device.ram,
        "endpoint_url": device.endpoint_url,
        "create_time": device.create_time.strftime("%Y-%m-%d %H:%M:%S")
    }


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
