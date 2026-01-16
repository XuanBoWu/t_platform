// 主进程入口
import path from 'path';
import { spawn } from 'child_process';
// 获取Electron可执行文件路径
const electronPath = path.join(__dirname, '..', 'node_modules/electron/Electron.app/Contents/MacOS/Electron');
// 获取当前脚本目录（用于preload路径）
const preloadPath = path.join(__dirname, 'preload/index.js');
// 主窗口引用
let mainWindow = null;
// 设备管理
function getDevices() {
    return new Promise((resolve) => {
        const { exec } = require('child_process');
        exec('adb devices -l', (err, stdout) => {
            if (err) {
                resolve([]);
                return;
            }
            const devices = [];
            const lines = stdout.trim().split('\n');
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line)
                    continue;
                const parts = line.split(/\s+/);
                if (parts.length >= 2) {
                    devices.push({
                        id: parts[0],
                        name: parts[0],
                        state: parts[1] === 'device' ? 'connected' : 'disconnected',
                    });
                }
            }
            resolve(devices);
        });
    });
}
// 执行ADB命令
function executeCommand(deviceId, command) {
    return new Promise((resolve) => {
        const { exec } = require('child_process');
        const fullCmd = deviceId ? `adb -s ${deviceId} ${command}` : `adb ${command}`;
        exec(fullCmd, (err, stdout, stderr) => {
            if (err) {
                resolve({ success: false, stdout: '', stderr: err.message });
                return;
            }
            resolve({ success: true, stdout, stderr });
        });
    });
}
// 启动Electron渲染进程
function startElectron() {
    const args = [
        path.join(__dirname, '..', '..', 'renderer'),
        '--user-data-dir=/tmp/t-platform-data',
        '--no-sandbox'
    ];
    const electron = spawn(electronPath, args, {
        stdio: 'inherit',
        env: {
            ...process.env,
            ELECTRON_DISABLE_SANDBOX: '1'
        }
    });
    electron.on('close', (code) => {
        process.exit(code);
    });
    electron.on('error', (err) => {
        console.error('Failed to start Electron:', err);
        process.exit(1);
    });
}
// 在Electron进程中设置IPC
function setupIPC() {
    // 由于我们直接运行Electron，需要用另一种方式
    // 这里我们启动一个HTTP API服务来通信
    const http = require('http');
    const server = http.createServer((req, res) => {
        const url = new URL(req.url || '', `http://${req.headers.host}`);
        // CORS头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        if (req.method === 'OPTIONS') {
            res.writeHead(204);
            res.end();
            return;
        }
        if (url.pathname === '/api/devices' && req.method === 'GET') {
            getDevices().then(devices => {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, data: devices }));
            });
            return;
        }
        if (url.pathname === '/api/execute' && req.method === 'POST') {
            let body = '';
            req.on('data', (chunk) => body += chunk);
            req.on('end', () => {
                try {
                    const { deviceId, command } = JSON.parse(body);
                    executeCommand(deviceId, command).then(result => {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(result));
                    });
                }
                catch (e) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: e.message }));
                }
            });
            return;
        }
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Not found' }));
    });
    const PORT = 3173;
    server.listen(PORT, () => {
        console.log(`API server running on http://localhost:${PORT}`);
        startElectron();
    });
}
// 启动
setupIPC();
