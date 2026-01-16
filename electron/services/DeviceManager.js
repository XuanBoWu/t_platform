import { exec } from 'child_process';
export class DeviceManager {
    constructor() {
        this.monitoring = false;
        this.monitorProcess = null;
        this.callbacks = [];
        this.cachedDevices = [];
    }
    /**
     * 获取所有连接的设备
     */
    async getDevices() {
        return new Promise((resolve, reject) => {
            exec('adb devices -l', (err, stdout, stderr) => {
                if (err) {
                    // 没有设备连接时也可能返回错误码，需要解析输出
                    if (stderr.includes('List of devices attached')) {
                        resolve(this.parseDeviceList(stdout));
                        return;
                    }
                    reject(err);
                    return;
                }
                resolve(this.parseDeviceList(stdout));
            });
        });
    }
    /**
     * 解析 adb devices 输出
     */
    parseDeviceList(output) {
        const devices = [];
        const lines = output.trim().split('\n');
        // 跳过标题行
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line)
                continue;
            // 格式: device_id state [properties...]
            const parts = line.split(/\s+/);
            if (parts.length < 2)
                continue;
            const deviceId = parts[0];
            const stateStr = parts[1];
            // 解析设备属性
            const properties = {};
            for (let j = 2; j < parts.length; j++) {
                const prop = parts[j];
                if (prop.includes(':')) {
                    const [key, value] = prop.split(':');
                    properties[key] = value;
                }
            }
            devices.push({
                id: deviceId,
                name: properties['product'] || properties['model'] || deviceId,
                state: this.mapDeviceState(stateStr),
                product: properties['product'] || 'unknown',
                model: properties['model'] || 'unknown',
                device: properties['device'] || 'unknown',
                transportId: properties['transport_id'] || '0',
            });
        }
        this.cachedDevices = devices;
        return devices;
    }
    /**
     * 映射设备状态
     */
    mapDeviceState(state) {
        const stateMap = {
            'device': 'connected',
            'offline': 'offline',
            'unauthorized': 'unauthorized',
            'no device': 'disconnected',
        };
        return stateMap[state] || 'disconnected';
    }
    /**
     * 执行ADB命令
     */
    async executeCommand(deviceId, command) {
        return new Promise((resolve, reject) => {
            const fullCommand = deviceId ? `adb -s ${deviceId} ${command}` : `adb ${command}`;
            exec(fullCommand, (err, stdout, stderr) => {
                if (err) {
                    reject(new Error(stderr || err.message));
                    return;
                }
                resolve(stdout);
            });
        });
    }
    /**
     * 执行Shell命令（通过shell模块）
     */
    async executeShell(deviceId, shellCommand) {
        return new Promise((resolve, reject) => {
            const fullCommand = `adb -s ${deviceId} shell ${shellCommand}`;
            exec(fullCommand, (err, stdout, stderr) => {
                if (err) {
                    reject(new Error(stderr || err.message));
                    return;
                }
                resolve(stdout);
            });
        });
    }
    /**
     * 启动设备监控
     */
    startMonitoring(callback) {
        this.callbacks.push(callback);
        if (!this.monitoring) {
            this.monitoring = true;
            this.pollDevices();
        }
    }
    /**
     * 轮询设备状态
     */
    async pollDevices() {
        while (this.monitoring) {
            try {
                const devices = await this.getDevices();
                this.cachedDevices = devices;
                this.notifyCallbacks(devices);
            }
            catch (err) {
                console.error('Device polling error:', err);
            }
            // 每2秒轮询一次
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    /**
     * 通知所有回调函数
     */
    notifyCallbacks(devices) {
        this.callbacks.forEach(cb => cb(devices));
    }
    /**
     * 停止设备监控
     */
    stopMonitoring() {
        this.monitoring = false;
        this.callbacks = [];
    }
    /**
     * 获取缓存的设备列表
     */
    getCachedDevices() {
        return this.cachedDevices;
    }
    /**
     * 检查特定设备是否存在
     */
    async hasDevice(deviceId) {
        const devices = await this.getDevices();
        return devices.some(d => d.id === deviceId);
    }
    /**
     * 获取设备信息
     */
    async getDeviceInfo(deviceId) {
        const devices = await this.getDevices();
        return devices.find(d => d.id === deviceId) || null;
    }
}
