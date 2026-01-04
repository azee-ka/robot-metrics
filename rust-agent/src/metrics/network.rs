use crate::types::NetworkMetrics;
use rand::Rng;

pub struct NetworkCollector {
    baseline_latency: f32,
}

impl NetworkCollector {
    pub fn new() -> Self {
        Self { baseline_latency: 10.0 }
    }
    
    pub fn collect(&mut self) -> NetworkMetrics {
        let mut rng = rand::thread_rng();
        
        let latency_variance = if rng.gen::<f32>() < 0.05 {
            rng.gen::<f32>() * 50.0
        } else {
            rng.gen::<f32>() * 5.0
        };
        let latency_ms = self.baseline_latency + latency_variance;
        
        let packet_loss_percent = if rng.gen::<f32>() < 0.02 {
            rng.gen::<f32>() * 5.0
        } else {
            rng.gen::<f32>() * 0.5
        };
        
        let signal_strength_dbm = Some(-40.0 - rng.gen::<f32>() * 30.0);
        let bandwidth_mbps = 100.0 + rng.gen::<f32>() * 50.0;
        
        NetworkMetrics {
            latency_ms,
            packet_loss_percent,
            signal_strength_dbm,
            bandwidth_mbps,
            interface_type: "wifi".to_string(),
        }
    }
}
