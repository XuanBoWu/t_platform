import { DeviceInfo } from '../../shared/types';
export declare class DeviceManager {
    private monitoring;
    private monitorProcess;
    private callbacks;
    private cachedDevices;
    /**
     * 获取所有连接的设备
     */
    getDevices(): Promise<DeviceInfo[]>;
    /**
     * 解析 adb devices 输出
     */
    private parseDeviceList;
    /**
     * 映射设备状态
     */
    private mapDeviceState;
    /**
     * 执行ADB命令
     */
    executeCommand(deviceId: string, command: string): Promise<string>;
    /**
     * 执行Shell命令（通过shell模块）
     */
    executeShell(deviceId: string, shellCommand: string): Promise<string>;
    /**
     * 启动设备监控
     */
    startMonitoring(callback: (devices: DeviceInfo[]) => void): void;
    /**
     * 轮询设备状态
     */
    private pollDevices;
    /**
     * 通知所有回调函数
     */
    private notifyCallbacks;
    /**
     * 停止设备监控
     */
    stopMonitoring(): void;
    /**
     * 获取缓存的设备列表
     */
    getCachedDevices(): DeviceInfo[];
    /**
     * 检查特定设备是否存在
     */
    hasDevice(deviceId: string): Promise<boolean>;
    /**
     * 获取设备信息
     */
    getDeviceInfo(deviceId: string): Promise<DeviceInfo | null>;
}
