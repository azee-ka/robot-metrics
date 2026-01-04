from .models import MetricPacket, Alert
from datetime import datetime
from typing import List
import uuid

class AlertProcessor:
    def __init__(self):
        self.alert_rules = {
            'high_cpu': {
                'check': lambda p: p.system.cpu_percent > 90,
                'severity': 'warning',
                'message': lambda p: f"High CPU: {p.system.cpu_percent:.1f}%"
            },
            'low_battery': {
                'check': lambda p: p.system.battery_percent < 20,
                'severity': 'warning',
                'message': lambda p: f"Low battery: {p.system.battery_percent:.1f}%"
            },
        }
        self.recent_alerts = {}
        self.alert_cooldown = 30
    
    def process(self, packet: MetricPacket) -> List[Alert]:
        alerts = []
        current_time = datetime.now()
        
        for alert_type, rule in self.alert_rules.items():
            if rule['check'](packet):
                alert_key = f"{packet.robot_id}:{alert_type}"
                if alert_key in self.recent_alerts:
                    last = self.recent_alerts[alert_key]
                    if (current_time - last).total_seconds() < self.alert_cooldown:
                        continue
                
                alert = Alert(
                    alert_id=str(uuid.uuid4()),
                    robot_id=packet.robot_id,
                    warehouse_id=packet.warehouse_id,
                    severity=rule['severity'],
                    alert_type=alert_type,
                    message=rule['message'](packet),
                    timestamp=current_time,
                    acknowledged=False
                )
                alerts.append(alert)
                self.recent_alerts[alert_key] = current_time
        
        return alerts
