import { io, Socket } from 'socket.io-client';
import type { Producto } from '@/modules/Products/interfaces';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:3000';

export interface ProductScannedEvent {
  producto: Producto;
  scannedBy: string;
  timestamp: string;
}

export interface ScanSuccessEvent {
  producto: Producto;
  sentToClients: number;
}

export interface ScanErrorEvent {
  message: string;
  barcode?: string;
  error?: string;
}

// Función para obtener sessionId del usuario logueado
const getSessionIdFromAuth = (): string | undefined => {
  try {
    const authData = localStorage.getItem('auth-storage');
    if (authData) {
      const parsed = JSON.parse(authData);
      return parsed.state?.user?.id; // Usar el ID del usuario como sessionId
    }
  } catch (error) {
    console.error('Error obteniendo sessionId:', error);
  }
  return undefined;
};

class SocketService {
  private socket: Socket | null = null;
  private sessionId: string | null = null;

  connect(type: 'scanner' | 'pos', sessionId?: string): Socket {
    if (this.socket?.connected) {
      console.log('⚠️ Socket ya conectado, re-registrando como:', type);
      this.socket.emit('register', { type, sessionId: this.sessionId });
      return this.socket;
    }

    // Usar el ID del usuario como sessionId para que todos los dispositivos compartan sesión
    this.sessionId = sessionId || getSessionIdFromAuth() || this.generateSessionId();
    console.log(`🔌 Conectando socket como ${type} con sesión:`, this.sessionId);
    
    this.socket = io(`${SOCKET_URL}/scanner`, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket?.id);
      console.log(`📝 Registrando como ${type}...`);
      this.socket?.emit('register', { type, sessionId: this.sessionId }, (response: any) => {
        console.log('📝 Registro confirmado:', response);
      });
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    this.socket.on('reconnect', () => {
      console.log('🔄 Socket reconectado, re-registrando como:', type);
      this.socket?.emit('register', { type, sessionId: this.sessionId });
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  scanBarcode(barcode: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error('Socket no conectado'));
        return;
      }

      this.socket.emit('scanBarcode', { 
        barcode, 
        sessionId: this.sessionId 
      }, (response: any) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.message || 'Error al escanear'));
        }
      });
    });
  }

  onProductScanned(callback: (data: ProductScannedEvent) => void) {
    this.socket?.on('productScanned', callback);
  }

  onScanSuccess(callback: (data: ScanSuccessEvent) => void) {
    this.socket?.on('scanSuccess', callback);
  }

  onScanError(callback: (data: ScanErrorEvent) => void) {
    this.socket?.on('scanError', callback);
  }

  offProductScanned(callback?: (data: ProductScannedEvent) => void) {
    this.socket?.off('productScanned', callback);
  }

  offScanSuccess(callback?: (data: ScanSuccessEvent) => void) {
    this.socket?.off('scanSuccess', callback);
  }

  offScanError(callback?: (data: ScanErrorEvent) => void) {
    this.socket?.off('scanError', callback);
  }

  getConnectedClients(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error('Socket no conectado'));
        return;
      }

      this.socket.emit('getConnectedClients', {}, (response: any) => {
        resolve(response);
      });
    });
  }

  getSessionId(): string | null {
    return this.sessionId;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}

export const socketService = new SocketService();
