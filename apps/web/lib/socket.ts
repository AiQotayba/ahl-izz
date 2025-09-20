import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  connect(token?: string): void {
    if (this.socket?.connected) {
      return;
    }

    // Use environment variable or default to localhost for development
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 
      (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
        ? 'http://localhost:3001' 
        : 'https://aleppo.lb-sy.com');

    this.socket = io(API_URL, {
      auth: {
        token: token || (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null),
      },
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true,
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason);
      
      // Auto-reconnect for certain disconnect reasons
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, don't reconnect
        return;
      }
      
      this.attemptReconnect();
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    // Set up existing listeners
    this.listeners.forEach((callbacks, event) => {
      callbacks.forEach(callback => {
        this.socket?.on(event, callback as any);
      });
    });
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);

    if (this.socket) {
      this.socket.on(event, callback as any);
    }
  }

  off(event: string, callback?: Function): void {
    if (callback) {
      const callbacks = this.listeners.get(event) || [];
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
      this.socket?.off(event, callback as any);
    } else {
      this.listeners.delete(event);
      this.socket?.off(event);
    }
  }

  emit(event: string, data?: any): void {
    this.socket?.emit(event, data);
  }

  get connected(): boolean {
    return this.socket?.connected || false;
  }

  reconnect(): void {
    this.disconnect();
    this.reconnectAttempts = 0;
    this.connect();
  }

  // Test connection and log status
  testConnection(): void {
    console.log('Socket connection test:');
    console.log('- Connected:', this.connected);
    console.log('- Socket ID:', this.socket?.id);
    console.log('- Transport:', this.socket?.io.engine.transport.name);
  }
}

export const socketService = new SocketService();
export default socketService;

