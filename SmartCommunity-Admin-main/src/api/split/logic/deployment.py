# logic/deployment.py
from db import SessionLocal, ModelDeployment, Model, Device
from sqlalchemy.exc import IntegrityError


# -----------------------
# 模型部署接口
# -----------------------

def deploy_model_to_device(model_id: str, device_id: str):
    db = SessionLocal()
    try:
        # 确保 model 和 device 存在
        if not db.query(Model).filter_by(model_id=model_id).first():
            return {"error": "Model not found"}, 404
        if not db.query(Device).filter_by(device_id=device_id).first():
            return {"error": "Device not found"}, 404

        # 创建部署记录
        md = ModelDeployment(model_id=model_id, device_id=device_id)
        db.add(md)
        db.commit()
        return {"status": "success"}, 200
    except IntegrityError:
        db.rollback()
        return {"error": "Deployment already exists"}, 400
    finally:
        db.close()


def undeploy_model_from_device(model_id: str, device_id: str):
    db = SessionLocal()
    md = db.query(ModelDeployment).filter_by(model_id=model_id, device_id=device_id).first()
    if not md:
        db.close()
        return {"error": "Deployment not found"}, 404
    db.delete(md)
    db.commit()
    db.close()
    return {"status": "success"}, 200


def list_devices_for_model(model_id: str):
    db = SessionLocal()
    deployments = db.query(ModelDeployment).filter_by(model_id=model_id).all()
    db.close()
    return [d.device_id for d in deployments]


def list_models_for_device(device_id: str):
    db = SessionLocal()
    deployments = db.query(ModelDeployment).filter_by(device_id=device_id).all()
    db.close()
    return [d.model_id for d in deployments]
