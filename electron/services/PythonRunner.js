import { spawn } from 'child_process';
import path from 'path';
export class PythonRunner {
    constructor() {
        this.runningProcesses = new Map();
        // 优先使用python3，其次python
        this.pythonPath = process.env.PYTHON_PATH || 'python3';
    }
    /**
     * 执行Python脚本
     */
    async runScript(scriptPath, args = []) {
        return new Promise((resolve) => {
            const fullArgs = [scriptPath, ...args];
            const processId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const child = spawn(this.pythonPath, fullArgs, {
                cwd: path.dirname(scriptPath),
                env: {
                    ...process.env,
                    // 可以添加自定义环境变量
                },
            });
            this.runningProcesses.set(processId, child);
            let stdout = '';
            let stderr = '';
            child.stdout.on('data', (data) => {
                stdout += data.toString();
            });
            child.stderr.on('data', (data) => {
                stderr += data.toString();
            });
            child.on('close', (code) => {
                this.runningProcesses.delete(processId);
                resolve({
                    success: code === 0,
                    stdout: stdout.trim(),
                    stderr: stderr.trim(),
                    exitCode: code || 0,
                });
            });
            child.on('error', (err) => {
                this.runningProcesses.delete(processId);
                resolve({
                    success: false,
                    stdout: '',
                    stderr: err.message,
                    exitCode: 1,
                });
            });
            // 超时控制（默认30秒）
            const timeout = setTimeout(() => {
                if (this.runningProcesses.has(processId)) {
                    child.kill('SIGTERM');
                    this.runningProcesses.delete(processId);
                    resolve({
                        success: false,
                        stdout,
                        stderr: 'Process timed out',
                        exitCode: 1,
                    });
                }
            }, 30000);
            child.on('close', () => {
                clearTimeout(timeout);
            });
        });
    }
    /**
     * 交互式执行Python脚本（支持实时输出）
     */
    async runScriptInteractive(scriptPath, args = [], onOutput, onClose) {
        return new Promise((resolve, reject) => {
            const child = spawn(this.pythonPath, [scriptPath, ...args], {
                cwd: path.dirname(scriptPath),
            });
            child.stdout.on('data', (data) => {
                onOutput('stdout', data.toString());
            });
            child.stderr.on('data', (data) => {
                onOutput('stderr', data.toString());
            });
            child.on('close', (code) => {
                if (onClose)
                    onClose(code || 0);
                resolve();
            });
            child.on('error', reject);
        });
    }
    /**
     * 获取Python版本
     */
    async getVersion() {
        return new Promise((resolve, reject) => {
            const child = spawn(this.pythonPath, ['--version']);
            let version = '';
            child.stdout.on('data', (data) => {
                version += data.toString();
            });
            child.on('close', () => {
                resolve(version.trim());
            });
            child.on('error', reject);
        });
    }
    /**
     * 安装Python依赖
     */
    async installDependencies(requirementsPath) {
        return this.runScript('-m', ['pip', 'install', '-r', requirementsPath]);
    }
    /**
     * 终止运行中的进程
     */
    terminateProcess(processId) {
        const process = this.runningProcesses.get(processId);
        if (process) {
            process.kill('SIGTERM');
            this.runningProcesses.delete(processId);
            return true;
        }
        return false;
    }
    /**
     * 终止所有运行中的进程
     */
    terminateAll() {
        this.runningProcesses.forEach((process) => {
            process.kill('SIGTERM');
        });
        this.runningProcesses.clear();
    }
    /**
     * 检查Python是否可用
     */
    async isAvailable() {
        try {
            await this.getVersion();
            return true;
        }
        catch {
            return false;
        }
    }
}
