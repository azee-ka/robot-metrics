use crate::types::ROS2TopicMetric;

pub struct ROS2Collector {
    topics: Vec<String>,
}

impl ROS2Collector {
    pub fn new() -> Self {
        Self {
            topics: vec![
                "/camera/image_raw".to_string(),
                "/scan".to_string(),
                "/odom".to_string(),
            ],
        }
    }
    
    pub fn collect(&mut self) -> Vec<ROS2TopicMetric> {
        vec![]
    }
}
