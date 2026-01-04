use std::time::Duration;
use tokio::time;

mod metrics;
mod sender;
mod types;

use metrics::{SystemCollector, NetworkCollector, ROS2Collector};
use sender::MetricSender;
use types::*;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("🤖 RobotMetrics Agent v0.1.0");
    
    let robot_id = std::env::var("ROBOT_ID").unwrap_or_else(|_| "robot_001".to_string());
    let warehouse_id = std::env::var("WAREHOUSE_ID").unwrap_or_else(|_| "warehouse_A".to_string());
    let backend_addr = std::env::var("BACKEND_ADDR").unwrap_or_else(|_| "127.0.0.1:8000".to_string());
    
    println!("📍 Robot ID: {}", robot_id);
    println!("🏭 Warehouse ID: {}", warehouse_id);
    println!("🌐 Backend: {}", backend_addr);
    
    let mut system_collector = SystemCollector::new();
    let mut network_collector = NetworkCollector::new();
    let mut ros2_collector = ROS2Collector::new();
    
    let sender = MetricSender::new(&backend_addr).await?;
    
    println!("✅ Agent initialized. Starting metric collection...\n");
    
    let mut sequence = 0u64;
    let mut interval = time::interval(Duration::from_secs(1));
    
    loop {
        interval.tick().await;
        sequence += 1;
        
        let system = system_collector.collect();
        let network = network_collector.collect();
        let ros2 = ros2_collector.collect();
        
        let time = sequence as f64 * 0.1;
        let position = Position {
            x: (time.sin() * 10.0) as f32,
            y: (time.cos() * 10.0) as f32,
            z: 0.0,
        };
        
        let status = if sequence % 100 < 60 {
            RobotStatus {
                state: "moving".to_string(),
                current_task: Some("transport_item_A45".to_string()),
                task_progress: ((sequence % 60) as f32 / 60.0 * 100.0) as u8,
            }
        } else if sequence % 100 < 80 {
            RobotStatus {
                state: "idle".to_string(),
                current_task: None,
                task_progress: 0,
            }
        } else {
            RobotStatus {
                state: "charging".to_string(),
                current_task: None,
                task_progress: ((sequence % 20) * 5) as u8,
            }
        };
        
        let packet = MetricPacket {
            version: 1,
            robot_id: robot_id.clone(),
            warehouse_id: warehouse_id.clone(),
            timestamp: chrono::Utc::now().timestamp_nanos_opt().unwrap() as u64,
            sequence,
            system,
            network,
            ros2,
            position,
            status,
        };
        
        match sender.send(&packet).await {
            Ok(_) => {
                if sequence % 10 == 0 {
                    println!(
                        "📊 Sent packet #{} | CPU: {:.1}% | Mem: {:.1}% | Bat: {:.1}% | Lat: {:.1}ms",
                        sequence,
                        packet.system.cpu_percent,
                        packet.system.memory_percent,
                        packet.system.battery_percent,
                        packet.network.latency_ms
                    );
                }
            }
            Err(e) => eprintln!("❌ Failed to send packet #{}: {}", sequence, e),
        }
    }
}