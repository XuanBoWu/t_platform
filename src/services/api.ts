import { Device, CommandResult, ApiResponse } from '../types';

const API_BASE = 'http://localhost:3173';

export class ApiService {
  // 获取设备列表
  static async getDevices(): Promise<Device[]> {
    try {
      const response = await fetch(`${API_BASE}/api/devices`);
      const data: ApiResponse<Device[]> = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch devices');
      }

      return data.data || [];
    } catch (error) {
      console.error('Error fetching devices:', error);
      return [];
    }
  }

  // 执行 ADB 命令
  static async executeCommand(deviceId: string, command: string): Promise<CommandResult> {
    try {
      const response = await fetch(`${API_BASE}/api/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deviceId, command }),
      });

      const data: CommandResult = await response.json();
      return data;
    } catch (error) {
      console.error('Error executing command:', error);
      return {
        success: false,
        stdout: '',
        stderr: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
