import { LoadedPlugin } from '../../shared/types';
export declare class PluginLoader {
    private plugins;
    private pluginsDir;
    private pythonRunner;
    constructor(pluginsDir?: string);
    /**
     * 确保插件目录存在
     */
    private ensurePluginsDir;
    /**
     * 扫描并加载所有插件
     */
    scanAndLoad(): Promise<LoadedPlugin[]>;
    /**
     * 加载单个插件
     */
    loadPlugin(pluginPath: string): Promise<LoadedPlugin>;
    /**
     * 读取插件清单
     */
    private readManifest;
    /**
     * 验证插件清单
     */
    private validateManifest;
    /**
     * 加载插件视图配置
     */
    private loadPluginViews;
    /**
     * 卸载插件
     */
    unloadPlugin(pluginId: string): boolean;
    /**
     * 获取所有已加载的插件
     */
    getLoadedPlugins(): LoadedPlugin[];
    /**
     * 获取单个插件
     */
    getPlugin(pluginId: string): LoadedPlugin | undefined;
    /**
     * 插件执行Python脚本
     */
    executePluginScript(pluginId: string, scriptName: string, args?: string[]): Promise<any>;
    /**
     * 获取插件目录
     */
    getPluginsDir(): string;
    /**
     * 设置插件目录
     */
    setPluginsDir(dir: string): void;
    /**
     * 创建新插件模板
     */
    createPluginTemplate(name: string, options?: {
        withPython?: boolean;
        withReact?: boolean;
    }): Promise<string>;
}
