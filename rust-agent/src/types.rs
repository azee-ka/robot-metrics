use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MetricPacket {
    pub version: u8,
    pub robot_id: String,
    pub warehouse_id: String,
    pub timestamp: u64,
    pub sequence: u64,
    pub system: SystemMetrics,
    pub network: NetworkMetrics,
    pub ros2: Vec<ROS2TopicMetric>,
    pub position: Position,
    pub status: RobotStatus,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemMetrics {
    pub cpu_percent: f32,
    pub memory_percent: f32,
    pub battery_percent: f32,
    pub temperature: f32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NetworkMetrics {
    pub latency_ms: f32,
    pub packet_loss_percent: f32,
    pub signal_strength_dbm: Option<f32>,
    pub bandwidth_mbps: f32,
    pub interface_type: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ROS2TopicMetric {
    pub topic_name: String,
    pub node_name: String,
    pub publish_rate_hz: f32,
    pub message_size_bytes: u32,
    pub queue_depth: u32,
    pub dropped_messages: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Position {
    pub x: f32,
    pub y: f32,
    pub z: f32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RobotStatus {
    pub state: String,
    pub current_task: Option<String>,
    pub task_progress: u8,
}
