import { useEffect, useState } from 'react';

export function useWebSocket() {
  const [robots, setRobots] = useState<any[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      try {
        ws = new WebSocket('ws://localhost:8000/ws');

        ws.onopen = () => {
          console.log('WebSocket connected');
          setConnected(true);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'metric_update') {
              setRobots((prev) => {
                const existing = prev.find((r) => r.robot_id === data.robot_id);
                const updated = {
                  robot_id: data.robot_id,
                  warehouse_id: data.warehouse_id,
                  system: data.system,
                  network: data.network,
                  position: data.position,
                  status: data.status,
                  last_seen: new Date(),
                };
                if (existing) {
                  return prev.map((r) => r.robot_id === data.robot_id ? updated : r);
                }
                return [...prev, updated];
              });
            }
          } catch (error) {
            console.error('WebSocket message error:', error);
          }
        };

        ws.onerror = () => {
          setConnected(false);
        };

        ws.onclose = () => {
          setConnected(false);
          reconnectTimeout = setTimeout(connect, 3000);
        };
      } catch (error) {
        console.error('WebSocket connection error:', error);
        setConnected(false);
        reconnectTimeout = setTimeout(connect, 3000);
      }
    };

    connect();

    return () => {
      if (ws) ws.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, []);

  return { robots, connected };
}
