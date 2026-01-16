import { contextBridge, ipcRenderer } from 'electron';

// 暴露安全的API到渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 设备管理
  getDevices: () => ipcRenderer.invoke('device:list'),
  startDeviceMonitor: () => ipcRenderer.invoke('device:monitor:start'),
  executeCommand: (deviceId: string, command: string) =>
    ipcRenderer.invoke('device:execute', deviceId, command),

  // 插件管理
  getPlugins: () => ipcRenderer.invoke('plugin:list'),
  loadPlugin: (path: string) => ipcRenderer.invoke('plugin:load', path),
  unloadPlugin: (id: string) => ipcRenderer.invoke('plugin:unload', id),

  // Python执行
  runPython: (scriptPath: string, args: string[]) =>
    ipcRenderer.invoke('python:run', scriptPath, args),

  // 设备变化监听
  onDeviceChanged: (callback: (devices: any[]) => void) => {
    ipcRenderer.on('device:changed', (_, devices) => callback(devices));
    return () => ipcRenderer.removeListener('device:changed', callback);
  },
});
