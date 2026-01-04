from fastapi import APIRouter, HTTPException
from typing import List, Optional
from datetime import datetime
from .database import InfluxDBClient, RedisClient
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

db_client: Optional[InfluxDBClient] = None
redis_client: Optional[RedisClient] = None

def set_clients(db: InfluxDBClient, redis: RedisClient):
    global db_client, redis_client
    db_client = db
    redis_client = redis

@router.get("/robots")
async def list_robots():
    try:
        if not redis_client:
            raise HTTPException(500, "Redis not initialized")
        robots = redis_client.get_all_robots()
        return {"robots": robots}
    except Exception as e:
        logger.error(f"Error listing robots: {e}")
        raise HTTPException(500, str(e))

@router.get("/fleet/status")
async def fleet_status():
    try:
        if not redis_client:
            raise HTTPException(500, "Redis not initialized")
        fleet = redis_client.get_fleet_status()
        summaries = []
        for robot_id, data in fleet.items():
            summaries.append({
                "robot_id": data['robot_id'],
                "warehouse_id": data['warehouse_id'],
                "last_seen": datetime.fromtimestamp(data['timestamp'] / 1_000_000_000),
                "system": data['system'],
                "network": data['network'],
                "position": data['position'],
                "status": data['status']
            })
        return {
            "total_robots": len(summaries),
            "robots": summaries,
            "timestamp": datetime.now()
        }
    except Exception as e:
        logger.error(f"Error getting fleet status: {e}")
        raise HTTPException(500, str(e))
