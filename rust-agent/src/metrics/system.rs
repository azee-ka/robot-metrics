use crate::types::SystemMetrics;
use sysinfo::System;
use rand::Rng;

pub struct SystemCollector {
    sys: System,
    battery_simulation: f32,
}

impl SystemCollector {
    pub fn new() -> Self {
        Self {
            sys: System::new_all(),
            battery_simulation: 100.0,
        }
    }
    
    pub fn collect(&mut self) -> SystemMetrics {
        self.sys.refresh_all();
        
        let cpu_percent = self.sys.global_cpu_info().cpu_usage();
        let memory_percent = (self.sys.used_memory() as f64 / self.sys.total_memory() as f64 * 100.0) as f32;
        
        self.battery_simulation -= 0.05;
        if self.battery_simulation < 10.0 {
            self.battery_simulation = 100.0;
        }
        
        let mut rng = rand::thread_rng();
        let temperature = 45.0 + rng.gen::<f32>() * 10.0;
        
        SystemMetrics {
            cpu_percent,
            memory_percent,
            battery_percent: self.battery_simulation,
            temperature,
        }
    }
}