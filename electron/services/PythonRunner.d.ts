import { PythonResult } from '../../shared/types';
export declare class PythonRunner {
    private pythonPath;
    private runningProcesses;
    constructor();
    /**
     * 执行Python脚本
     */
    runScript(scriptPath: string, args?: string[]): Promise<PythonResult>;
    /**
     * 交互式执行Python脚本（支持实时输出）
     */
    runScriptInteractive(scriptPath: string, args: string[] | undefined, onOutput: (type: 'stdout' | 'stderr', data: string) => void, onClose?: (code: number) => void): Promise<void>;
    /**
     * 获取Python版本
     */
    getVersion(): Promise<string>;
    /**
     * 安装Python依赖
     */
    installDependencies(requirementsPath: string): Promise<PythonResult>;
    /**
     * 终止运行中的进程
     */
    terminateProcess(processId: string): boolean;
    /**
     * 终止所有运行中的进程
     */
    terminateAll(): void;
    /**
     * 检查Python是否可用
     */
    isAvailable(): Promise<boolean>;
}
