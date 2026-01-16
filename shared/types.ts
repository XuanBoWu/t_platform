// 共享类型定义

// 设备状态
export type DeviceState = 'connected' | 'disconnected' | 'unauthorized' | 'offline';

// 设备信息
export interface DeviceInfo {
  id: string;
  name: string;
  state: DeviceState;
  product: string;
  model: string;
  device: string;
  transportId: string;
}

// 插件类型
export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description?: string;
  author?: string;
  icon?: string;
  main: string;        // 主入口文件
  renderer?: string;   // React组件入口
  python?: {
    script: string;   // Python脚本路径
    entry?: string;   // 入口函数名
  };
  capabilities: {
    deviceRequired: boolean;
    supportedActions: string[];
  };
}

export interface LoadedPlugin {
  manifest: PluginManifest;
  path: string;
  module?: any;
  views: PluginView[];
}

export interface PluginView {
  id: string;
  title: string;
  icon?: string;
  component: string;  // 组件名称
}

// Python脚本执行结果
export interface PythonResult {
  success: boolean;
  stdout: string;
  stderr: string;
  exitCode: number;
}

// IPC消息类型
export interface IpcChannel {
  // 设备相关
  'device:list': { req: void; res: DeviceInfo[] };
  'device:execute': { req: { deviceId: string; command: string }; res: PythonResult };
  'device:monitor': { req: void; res: DeviceInfo[] };

  // 插件相关
  'plugin:list': { req: void; res: LoadedPlugin[] };
  'plugin:load': { req: { path: string }; res: LoadedPlugin };
  'plugin:unload': { req: { id: string }; res: void };
  'plugin:execute': { req: { pluginId: string; action: string; args: string[] }; res: PythonResult };
}
