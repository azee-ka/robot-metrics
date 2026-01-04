from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from contextlib import asynccontextmanager
import logging

from .ingestion import UDPIngestionServer
from .database import InfluxDBClient, RedisClient
from .websocket_manager import ConnectionManager
from .api import router as api_router, set_clients

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

udp_server = None
db_client = None
redis_client = None
ws_manager = ConnectionManager()

@asynccontextmanager
async def lifespan(app: FastAPI):
    global udp_server, db_client, redis_client
    
    logger.info("🚀 Starting RobotMetrics Backend...")
    
    db_client = InfluxDBClient()
    redis_client = RedisClient()
    set_clients(db_client, redis_client)
    
    udp_server = UDPIngestionServer(
        port=8000,
        db_client=db_client,
        redis_client=redis_client,
        ws_manager=ws_manager   )
    asyncio.create_task(udp_server.start())
    
    logger.info("✅ Backend started successfully")
    
    yield
    
    logger.info("👋 Shutting down...")
    if udp_server:
        await udp_server.stop()
    if db_client:
        db_client.close()
    if redis_client:
        redis_client.close()

app = FastAPI(
    title="RobotMetrics API",
    version="0.1.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"service": "RobotMetrics", "version": "0.1.0", "status": "operational"}

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "database": db_client.check_health() if db_client else False,
        "cache": redis_client.check_health() if redis_client else False,
    }

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
