// 主进程入口
import path from 'path';
import { spawn } from 'child_process';

// 硬编码项目根目录路径
const PROJECT_ROOT = '/Users/alexwu/Projects/t_platform_minimax';

// 直接使用Electron可执行文件
const electronPath = path.join(PROJECT_ROOT, 'node_modules/electron/Electron.app/Contents/MacOS/Electron');

// 主窗口引用
let mainWindow: any = null;

// 设备管理
function getDevices() {
  return new Promise((resolve) => {
    const { exec } = require('child_process');
    exec('adb devices -l', (err: any, stdout: string) => {
      if (err) {
        resolve([]);
        return;
      }
      const devices: any[] = [];
      const lines = stdout.trim().split('\n');
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
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
function executeCommand(deviceId: string, command: string) {
  return new Promise((resolve) => {
    const { exec } = require('child_process');
    const fullCmd = deviceId ? `adb -s ${deviceId} ${command}` : `adb ${command}`;
    exec(fullCmd, (err: any, stdout: string, stderr: string) => {
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
  // 开发模式加载Vite服务器，生产模式加载本地文件
  const rendererURL = 'http://localhost:5173';

  const args = [
    rendererURL,
    '--user-data-dir=/tmp/t-platform-data',
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage'
  ];

  console.log('Starting Electron with args:', args);

  const electron = spawn(electronPath, args, {
    stdio: 'inherit',
    env: {
      ...process.env,
      ELECTRON_DISABLE_SANDBOX: '1',
      ELECTRON_NO_ASAR: '1'  // 禁用asar加载
    }
  });

  electron.on('close', (code: number) => {
    console.log('Electron exited with code:', code);
    process.exit(code);
  });

  electron.on('error', (err: Error) => {
    console.error('Failed to start Electron:', err);
    process.exit(1);
  });
}

// 在Electron进程中设置IPC
function setupIPC() {
  const http = require('http');

  const server = http.createServer((req: any, res: any) => {
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
      req.on('data', (chunk: any) => body += chunk);
      req.on('end', () => {
        try {
          const { deviceId, command } = JSON.parse(body);
          executeCommand(deviceId, command).then(result => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
          });
        } catch (e: any) {
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
