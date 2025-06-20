interface LogEntry {
  id: number;
  timestamp: string;
  type: 'service_call' | 'context_update' | 'data_sync';
  message: string;
  data?: any;
}

class Logger {
  private logs: LogEntry[] = [];
  private listeners: Array<(logs: LogEntry[]) => void> = [];
  private idCounter = 0;

  addLog(type: LogEntry['type'], message: string, data?: any) {
    const log: LogEntry = {
      id: ++this.idCounter,
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
      data
    };
    
    this.logs.push(log);
    
    // Keep only last 50 logs to prevent memory issues
    if (this.logs.length > 50) {
      this.logs = this.logs.slice(-50);
    }
    
    // Notify all listeners
    this.listeners.forEach(listener => listener([...this.logs]));
    
    // Also log to console for debugging
    console.log(`[${log.timestamp}] ${type.toUpperCase()}: ${message}`, data);
  }

  subscribe(listener: (logs: LogEntry[]) => void) {
    this.listeners.push(listener);
    listener([...this.logs]); // Send current logs immediately
    
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  clear() {
    this.logs = [];
    this.listeners.forEach(listener => listener([]));
  }

  getLogs() {
    return [...this.logs];
  }
}

export const logger = new Logger();

// Helper functions for different types of logs
export const logServiceCall = (serviceName: string, action: string, data?: any) => {
  logger.addLog('service_call', `${serviceName}.${action}()`, data);
};

export const logContextUpdate = (hookName: string, newValue: any) => {
  logger.addLog('context_update', `Hook "${hookName}" updated in context`, newValue);
};

export const logDataSync = (serviceName: string, direction: 'context→service' | 'service→context', data?: any) => {
  logger.addLog('data_sync', `${serviceName}: ${direction}`, data);
};
