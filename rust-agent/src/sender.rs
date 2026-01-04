use crate::types::MetricPacket;
use tokio::net::UdpSocket;
use std::io;

pub struct MetricSender {
    socket: UdpSocket,
    backend_addr: String,
}

impl MetricSender {
    pub async fn new(backend_addr: &str) -> io::Result<Self> {
        let socket = UdpSocket::bind("0.0.0.0:0").await?;
        Ok(Self {
            socket,
            backend_addr: backend_addr.to_string(),
        })
    }
    
    pub async fn send(&self, packet: &MetricPacket) -> io::Result<usize> {
        let json = serde_json::to_string(packet)
            .map_err(|e| io::Error::new(io::ErrorKind::InvalidData, e))?;
        self.socket.send_to(json.as_bytes(), &self.backend_addr).await
    }
}
