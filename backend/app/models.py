from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class SystemMetrics(BaseModel):
    cpu_percent: float
    memory_percent: float
    battery_percent: float
    temperature: float

class NetworkMetrics(BaseModel):
    latency_ms: float
    packet_loss_percent: float
    signal_strength_dbm: Optional[float] = None
    bandwidth_mbps: float
    interface_type: str

class ROS2TopicMetric(BaseModel):
    topic_name: str
    node_name: str
    publish_rate_hz: float
    message_size_bytes: int
    queue_depth: int
    dropped_messages: int

class Position(BaseModel):
    x: float
    y: float
    z: float

class RobotStatus(BaseModel):
    state: str
    current_task: Optional[str] = None
    task_progress: int = Field(ge=0, le=100)

class MetricPacket(BaseModel):
    version: int
    robot_id: str
    warehouse_id: str
    timestamp: int
    sequence: int
    system: SystemMetrics
    network: NetworkMetrics
    ros2: List[ROS2TopicMetric]
    position: Position
    status: RobotStatus

class RobotSummary(BaseModel):
    robot_id: str
    warehouse_id: str
    last_seen: datetime
    system: SystemMetrics
    network: NetworkMetrics
    position: Position
    status: RobotStatus
    alert_count: int = 0

class Alert(BaseModel):
    alert_id: str
    robot_id: str
    warehouse_id: str
    severity: str
    alert_type: str
    message: str
    timestamp: datetime
    acknowledged: bool = False
