from influxdb_client import InfluxDBClient as InfluxClient, Point
from influxdb_client.client.write_api import SYNCHRONOUS
import redis
import json
import logging
from typing import Dict, Any, Optional, List
from datetime import datetime

logger = logging.getLogger(__name__)

class InfluxDBClient:
    def __init__(self, url="http://localhost:8086", token="fleetpulse-dev-token", 
                 org="fleetpulse", bucket="metrics"):
        self.client = InfluxClient(url=url, token=token, org=org)
        self.write_api = self.client.write_api(write_options=SYNCHRONOUS)
        self.query_api = self.client.query_api()
        self.bucket = bucket
        self.org = org
        logger.info(f"Connected to InfluxDB at {url}")
    
    def write_point(self, measurement: str, tags: Dict[str, str], 
                    fields: Dict[str, Any], timestamp: datetime):
        try:
            point = Point(measurement)
            for key, value in tags.items():
                point = point.tag(key, value)
            for key, value in fields.items():
                point = point.field(key, value)
            point = point.time(timestamp)
            self.write_api.write(bucket=self.bucket, record=point)
        except Exception as e:
            logger.error(f"Error writing to InfluxDB: {e}")
    
    def check_health(self) -> bool:
        try:
            self.client.ping()
            return True
        except:
            return False
    
    def close(self):
        self.client.close()

class RedisClient:
    def __init__(self, host="localhost", port=6379, db=0, password=None):
        self.client = redis.Redis(host=host, port=port, db=db, 
                                  password=password, decode_responses=True)
        logger.info(f"Connected to Redis at {host}:{port}")
    
    def set_json(self, key: str, value: Dict, ttl: Optional[int] = None):
        try:
            self.client.set(key, json.dumps(value), ex=ttl)
        except Exception as e:
            logger.error(f"Error setting Redis key {key}: {e}")
    
    def get_json(self, key: str) -> Optional[Dict]:
        try:
            value = self.client.get(key)
            return json.loads(value) if value else None
        except Exception as e:
            logger.error(f"Error getting Redis key {key}: {e}")
            return None
    
    def get_all_robots(self) -> List[str]:
        try:
            keys = self.client.keys("robot:*:latest")
            return [key.split(":")[1] for key in keys]
        except Exception as e:
            logger.error(f"Error getting robot list: {e}")
            return []
    
    def get_fleet_status(self) -> Dict[str, Dict]:
        try:
            robot_ids = self.get_all_robots()
            fleet = {}
            for robot_id in robot_ids:
                data = self.get_json(f"robot:{robot_id}:latest")
                if data:
                    fleet[robot_id] = data
            return fleet
        except Exception as e:
            logger.error(f"Error getting fleet status: {e}")
            return {}
    
    def check_health(self) -> bool:
        try:
            return self.client.ping()
        except:
            return False
    
    def close(self):
        self.client.close()
