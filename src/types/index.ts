// 设备类型
export interface Device {
  id: string;
  name: string;
  state: 'connected' | 'disconnected';
}

// 命令执行结果
export interface CommandResult {
  success: boolean;
  stdout: string;
  stderr: string;
}

// API 响应
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// 布局面板类型
export type PanelType = 'explorer' | 'search' | 'scm' | 'debug' | 'extensions';

// 主题类型
export type Theme = 'light' | 'dark';
