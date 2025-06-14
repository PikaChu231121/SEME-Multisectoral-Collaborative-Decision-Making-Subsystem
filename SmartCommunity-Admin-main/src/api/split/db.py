from sqlalchemy import create_engine, Column, String, Float, Integer, DateTime, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime

# 配置数据库连接
DATABASE_URL = "mysql+pymysql://admin:TJzhsq2024@sh-cdb-9m8nrru4.sql.tencentcdb.com:24582/smart_community"
engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


# -----------------------------
# 表结构定义（ORM 映射类）
# -----------------------------

class Device(Base):
    __tablename__ = "devices"
    device_id      = Column(String(64), primary_key=True, index=True)
    device_type    = Column(String(6), nullable=False, default="edge")
    cpu            = Column(String(128))
    gpu            = Column(String(128))
    ram            = Column(String(64))
    endpoint_url   = Column(String(256))
    status         = Column(String(10), nullable=False, default="offline")
    last_heartbeat = Column(DateTime, nullable=True)
    create_time    = Column(DateTime, default=datetime.datetime.utcnow)


class Model(Base):
    __tablename__ = "models"
    model_id = Column(String(64), primary_key=True)
    version = Column(String(32))
    storage_path = Column(String(255))
    upload_time = Column(DateTime, default=datetime.datetime.utcnow)


class ModelDeployment(Base):
    __tablename__ = "model_deployments"
    model_id = Column(String(64), ForeignKey("models.model_id", ondelete="CASCADE", onupdate="CASCADE"), primary_key=True)
    device_id = Column(String(64), ForeignKey("devices.device_id", ondelete="CASCADE", onupdate="CASCADE"), primary_key=True)


class SplitPointResult(Base):
    __tablename__ = "split_point_results"
    task_id = Column(String(64), primary_key=True)
    model_id = Column(String(64), ForeignKey("models.model_id", ondelete="CASCADE", onupdate="CASCADE"))
    edge_id = Column(String(64), ForeignKey("devices.device_id", ondelete="CASCADE", onupdate="CASCADE"))
    server_id = Column(String(64), ForeignKey("devices.device_id", ondelete="CASCADE", onupdate="CASCADE"))
    input_text = Column(Text)
    bandwidth = Column(Float)
    optimal_split = Column(Integer)
    predicted_latency = Column(Float)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class LayerMetric(Base):
    __tablename__ = "layer_metrics"
    task_id = Column(String(64), ForeignKey("split_point_results.task_id"), primary_key=True)
    layer_index = Column(Integer, primary_key=True)
    layer_name = Column(String(128))
    latency = Column(Float)
    output_size = Column(Float)


# -----------------------------
# 数据访问方法
# -----------------------------

def get_device_info(db, device_id):
    return db.query(Device).filter(Device.device_id == device_id).first()


def get_model_path(db, model_id):
    model = db.query(Model).filter(Model.model_id == model_id).first()
    return model.storage_path if model else None


def insert_split_result(db, task_id, model_id, edge_id, server_id, input_text, bandwidth, optimal_split, predicted_latency, created_at):
    result = SplitPointResult(
        task_id=task_id,
        model_id=model_id,
        edge_id=edge_id,
        server_id=server_id,
        input_text=input_text,
        bandwidth=bandwidth,
        optimal_split=optimal_split,
        predicted_latency=predicted_latency,
        created_at=created_at
    )
    db.add(result)
    db.commit()


def insert_layer_metrics(db, task_id, layer_metrics):
    for metric in layer_metrics:
        db.add(
            LayerMetric(
                task_id=task_id,
                layer_index=metric["layer_index"],
                layer_name=metric["layer_name"],
                latency=metric["latency"],
                output_size=metric["output_size"]
            )
        )
    db.commit()
