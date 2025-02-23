import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { WebSocketServer, WebSocket } from 'ws'; // 确保从 'ws' 模块导入 WebSocket
import { WebSocketClient, WebSocketConfig } from './types';

@Injectable()
export class WebSocketService implements OnModuleDestroy {
    private readonly logger = new Logger(WebSocketService.name);
    private wss: WebSocketServer;
    private clients: Map<string, WebSocketClient> = new Map();
    
    // 默认配置
    private config: WebSocketConfig = {
        pingInterval: 30000,  // 30秒
        pingTimeout: 5000,    // 5秒
        maxReconnectAttempts: 5,
        reconnectInterval: 3000, // 3秒
    };

    private heartbeatInterval: NodeJS.Timeout;

    constructor() {
        this.initializeWebSocketServer();
        this.startHeartbeat();
    }

    private initializeWebSocketServer(): void {
        this.wss = new WebSocketServer({ port: 8080 });
        this.wss.on('connection', (ws: WebSocket, req) => this.handleConnection(ws, req));
    }

    private handleConnection(ws: WebSocket, req: any): void {
        const clientId = req.headers['sec-websocket-key'];
        console.log('66666');
        
        const client: WebSocketClient = {
            ws,
            lastPing: Date.now(),
            reconnectAttempts: 0,
            clientId
        };

        this.clients.set(clientId, client);
        this.logger.log(`Client ${clientId} connected`);

        // 设置事件监听器
        ws.on('message', (message: string) => this.handleMessage(clientId, message));
        ws.on('close', () => this.handleDisconnect(clientId));
        ws.on('error', (error) => this.handleError(clientId, error));

        // 发送欢迎消息
        this.sendMessage(clientId, JSON.stringify({ type: 'welcome', message: 'Connected to server' }));
        
        // 启动心跳检测
        // this.startHeartbeatForClient(client);
    }

    private startHeartbeatForClient(client: WebSocketClient): void {
        const pingInterval1 = setInterval(() => {
            if (client.ws.readyState === WebSocket.OPEN) {
                client.ws.send(JSON.stringify({ type: 'ping' }));
            } else {
                clearInterval(pingInterval1);
            }
        const pingInterval2 = setInterval(() => {
            if (client.ws.readyState === WebSocket.OPEN) {
                client.ws.send(JSON.stringify({ type: 'ping' }));
            } else {
                clearInterval(pingInterval2);
            }
        }, this.config.pingInterval);

        client.ws.addEventListener('pong', () => {
            client.lastPing = Date.now();
        });

        client.ws.addEventListener('close', () => {
            clearInterval(pingInterval1);
        });
            clearInterval(pingInterval2);
        });
    }

    private handleMessage(clientId: string, message: string): void {
        const client = this.clients.get(clientId);
        if (!client) return;

        try {
            const data = JSON.parse(message.toString());
            
            // 处理心跳消息
            if (data.type === 'ping') {
                client.ws.send(JSON.stringify({ type: 'pong' }));
                client.lastPing = Date.now();
                return;
            }

            // 处理其他消息
            this.logger.debug(`Received message from ${clientId}: ${message}`);
            // 在这里添加其他消息处理逻辑
            
        } catch (error) {
            this.logger.error(`Error parsing message from ${clientId}: ${error.message}`);
        }
    }

    private async handleDisconnect(clientId: string): Promise<void> {
        const client = this.clients.get(clientId);
        if (!client) return;

        this.logger.warn(`Client ${clientId} disconnected`);

        // 尝试重连
        if (client.reconnectAttempts < this.config.maxReconnectAttempts) {
            await this.attemptReconnect(client);
        } else {
            this.clients.delete(clientId);
            this.logger.error(`Client ${clientId} exceeded maximum reconnection attempts`);
        }
    }

    private async attemptReconnect(client: WebSocketClient): Promise<void> {
        client.reconnectAttempts++;
        
        this.logger.log(
            `Attempting to reconnect client ${client.clientId} (Attempt ${client.reconnectAttempts}/${this.config.maxReconnectAttempts})`
        );

        // 等待重连间隔
        await new Promise(resolve => setTimeout(resolve, this.config.reconnectInterval));

        // 创建新的 WebSocket 连接
        try {
            const newWs = new WebSocket(`ws://localhost:8080`);
            
            newWs.on('open', () => {
                client.ws = newWs;
                client.lastPing = Date.now();
                this.logger.log(`Client ${client.clientId} successfully reconnected`);
            });

            newWs.on('error', () => {
                this.logger.error(`Reconnection failed for client ${client.clientId}`);
                this.handleDisconnect(client.clientId);
            });

        } catch (error) {
            this.logger.error(`Reconnection error for client ${client.clientId}: ${error.message}`);
            this.handleDisconnect(client.clientId);
        }
    }

    private handleError(clientId: string, error: Error): void {
        this.logger.error(`WebSocket error for client ${clientId}: ${error.message}`);
        this.handleDisconnect(clientId);
    }

    private startHeartbeat(): void {
        this.heartbeatInterval = setInterval(() => {
            const now = Date.now();
            
            this.clients.forEach((client, clientId) => {
                // 检查最后一次心跳时间
                if (now - client.lastPing > this.config.pingTimeout) {
                    this.logger.warn(`Client ${clientId} heartbeat timeout`);
                    client.ws.close(); // 使用 close 方法来断开连接
                    this.handleDisconnect(clientId);
                    return;
                }
            });
        }, this.config.pingInterval);
    }

    public sendMessage(clientId: string, message: string): void {
        const client = this.clients.get(clientId);
        if (client && client.ws.readyState === WebSocket.OPEN) {
            try {
                client.ws.send(message);
            } catch (error) {
                this.logger.error(`Error sending message to client ${clientId}: ${error.message}`);
                this.handleDisconnect(clientId);
            }
        }
    }

    public broadcast(message: string, excludeClientId?: string): void {
        this.clients.forEach((client, clientId) => {
            if (excludeClientId && clientId === excludeClientId) return;
            this.sendMessage(clientId, message);
        });
    }

    onModuleDestroy() {
        clearInterval(this.heartbeatInterval);
        this.wss.close();
    }
}