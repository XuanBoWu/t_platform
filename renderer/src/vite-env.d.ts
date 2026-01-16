/// <reference types="vite/client" />

interface Window {
  electronAPI: {
    getDevices: () => Promise<any[]>;
    startDeviceMonitor: () => void;
    executeCommand: (deviceId: string, command: string) => Promise<any>;
    getPlugins: () => Promise<any[]>;
    loadPlugin: (path: string) => Promise<any>;
    unloadPlugin: (id: string) => Promise<void>;
    runPython: (scriptPath: string, args: string[]) => Promise<any>;
    onDeviceChanged: (callback: (devices: any[]) => void) => () => void;
  };
}
