import asyncio
import logging
from datetime import datetime
from typing import Optional
import json

from .models import MetricPacket
from .database import InfluxDBClient, RedisClient
from .websocket_manager import ConnectionManager
from .alerts import AlertProcessor

logger = logging.getLogger(__name__)

class UDPIngestionServer:
    def __init__(self, port: int, db_client: InfluxDBClient, 
                 redis_client: RedisClient, ws_manager: ConnectionManager):
        self.port = port
        self.db_client = db_client
        self.redis_client = redis_client
        self.ws_manager = ws_manager
        self.alert_processor = AlertProcessor()
        self.running = False
        self.transport: Optional[asyncio.DatagramTransport] = None
        self.packets_received = 0
        self.packets_failed = 0
        self.last_report_time = datetime.now()
    
    async def start(self):
        loop = asyncio.get_running_loop()
        transport, protocol = await loop.create_datagram_endpoint(
            lambda: UDPServerProtocol(self),
            local_addr=('0.0.0.0', self.port)
        )
        self.transport = transport
        self.running = True
        logger.info(f"🎧 UDP Ingestion Server listening on port {self.port}")
        asyncio.create_task(self._report_stats())
    
    async def stop(self):
        self.running = False
        if self.transport:
            self.transport.close()
    
    async def process_packet(self, data: bytes, addr):
        try:
            packet_dict = json.loads(data.decode('utf-8'))
            packet = MetricPacket(**packet_dict)
            
            await self._store_metrics(packet)
            await self._update_cache(packet)
            alerts = self.alert_processor.process(packet)
            await self._broadcast_update(packet, alerts)
            
            self.packets_received += 1
        except Exception as e:
            logger.error(f"Error processing packet: {e}")
            self.packets_failed += 1
    
    async def _store_metrics(self, packet: MetricPacket):
        try:
            timestamp = datetime.fromtimestamp(packet.timestamp / 1_000_000_000)
            
            self.db_client.write_point(
                measurement="system_metrics",
                tags={"robot_id": packet.robot_id, "warehouse_id": packet.warehouse_id},
                fields={
                    "cpu_percent": packet.system.cpu_percent,
                    "memory_percent": packet.system.memory_percent,
                    "battery_percent": packet.system.battery_percent,
                    "temperature": packet.system.temperature,
                },
                timestamp=timestamp
            )
        except Exception as e:
            logger.error(f"Error storing metrics: {e}")
    
    async def _update_cache(self, packet: MetricPacket):
        try:
            cache_key = f"robot:{packet.robot_id}:latest"
            cache_data = {
                "robot_id": packet.robot_id,
                "warehouse_id": packet.warehouse_id,
                "timestamp": packet.timestamp,
                "system": packet.system.dict(),
                "network": packet.network.dict(),
                "position": packet.position.dict(),
                "status": packet.status.dict(),
            }
            self.redis_client.set_json(cache_key, cache_data, ttl=10)
        except Exception as e:
            logger.error(f"Error updating cache: {e}")
    
    async def _broadcast_update(self, packet: MetricPacket, alerts: list):
        try:
            message = {
                "type": "metric_update",
                "robot_id": packet.robot_id,
                "warehouse_id": packet.warehouse_id,
                "timestamp": packet.timestamp,
                "system": packet.system.dict(),
                "network": packet.network.dict(),
                "position": packet.position.dict(),
                "status": packet.status.dict(),
                "alerts": [alert.dict() for alert in alerts],
            }
            await self.ws_manager.broadcast(message)
        except Exception as e:
            logger.error(f"Error broadcasting: {e}")
    
    async def _report_stats(self):
        while self.running:
            await asyncio.sleep(30)
            now = datetime.now()
            elapsed = (now - self.last_report_time).total_seconds()
            rate = self.packets_received / elapsed if elapsed > 0 else 0
            logger.info(f"📊 Stats: {self.packets_received} packets ({rate:.1f}/s), {self.packets_failed} failed")
            self.last_report_time = now

class UDPServerProtocol(asyncio.DatagramProtocol):
    def __init__(self, server: UDPIngestionServer):
        self.server = server
    
    def connection_made(self, transport):
        self.transport = transport
    
    def datagram_received(self, data, addr):
        asyncio.create_task(self.server.process_packet(data, addr))
