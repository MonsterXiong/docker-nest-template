
export interface WebSocketClient {
    ws: WebSocket;
    lastPing: number;
    reconnectAttempts: number;
    clientId: string;
}

export interface WebSocketConfig {
    pingInterval: number;      // 心跳检测间隔(ms)
    pingTimeout: number;       // 心跳超时时间(ms) 
    maxReconnectAttempts: number;  // 最大重连次数
    reconnectInterval: number; // 重连间隔(ms)
}