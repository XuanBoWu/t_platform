import fs from 'fs';
import path from 'path';
import { PythonRunner } from './PythonRunner';
export class PluginLoader {
    constructor(pluginsDir) {
        this.plugins = new Map();
        this.pluginsDir = pluginsDir || path.join(process.cwd(), 'plugins');
        this.pythonRunner = new PythonRunner();
        this.ensurePluginsDir();
    }
    /**
     * 确保插件目录存在
     */
    ensurePluginsDir() {
        if (!fs.existsSync(this.pluginsDir)) {
            fs.mkdirSync(this.pluginsDir, { recursive: true });
        }
    }
    /**
     * 扫描并加载所有插件
     */
    async scanAndLoad() {
        const loadedPlugins = [];
        if (!fs.existsSync(this.pluginsDir)) {
            return loadedPlugins;
        }
        const entries = fs.readdirSync(this.pluginsDir, { withFileTypes: true });
        for (const entry of entries) {
            if (entry.isDirectory()) {
                const pluginPath = path.join(this.pluginsDir, entry.name);
                try {
                    const plugin = await this.loadPlugin(pluginPath);
                    loadedPlugins.push(plugin);
                }
                catch (err) {
                    console.error(`Failed to load plugin: ${entry.name}`, err);
                }
            }
        }
        return loadedPlugins;
    }
    /**
     * 加载单个插件
     */
    async loadPlugin(pluginPath) {
        // 读取插件清单
        const manifestPath = path.join(pluginPath, 'plugin.json');
        const manifest = await this.readManifest(manifestPath);
        // 验证清单
        this.validateManifest(manifest);
        // 加载插件视图
        const views = await this.loadPluginViews(pluginPath, manifest);
        const plugin = {
            manifest,
            path: pluginPath,
            views,
        };
        // 注册插件
        this.plugins.set(manifest.id, plugin);
        console.log(`Plugin loaded: ${manifest.name} v${manifest.version}`);
        return plugin;
    }
    /**
     * 读取插件清单
     */
    async readManifest(manifestPath) {
        if (!fs.existsSync(manifestPath)) {
            throw new Error(`Plugin manifest not found: ${manifestPath}`);
        }
        const content = fs.readFileSync(manifestPath, 'utf-8');
        return JSON.parse(content);
    }
    /**
     * 验证插件清单
     */
    validateManifest(manifest) {
        const required = ['id', 'name', 'version', 'main', 'capabilities'];
        for (const field of required) {
            if (!manifest[field]) {
                throw new Error(`Missing required field in plugin manifest: ${field}`);
            }
        }
        // 验证ID格式
        if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(manifest.id)) {
            throw new Error(`Invalid plugin ID format: ${manifest.id}`);
        }
    }
    /**
     * 加载插件视图配置
     */
    async loadPluginViews(pluginPath, manifest) {
        const viewsPath = path.join(pluginPath, 'views.json');
        if (!fs.existsSync(viewsPath)) {
            return [];
        }
        const content = fs.readFileSync(viewsPath, 'utf-8');
        return JSON.parse(content);
    }
    /**
     * 卸载插件
     */
    unloadPlugin(pluginId) {
        const plugin = this.plugins.get(pluginId);
        if (plugin) {
            this.plugins.delete(pluginId);
            console.log(`Plugin unloaded: ${plugin.manifest.name}`);
            return true;
        }
        return false;
    }
    /**
     * 获取所有已加载的插件
     */
    getLoadedPlugins() {
        return Array.from(this.plugins.values());
    }
    /**
     * 获取单个插件
     */
    getPlugin(pluginId) {
        return this.plugins.get(pluginId);
    }
    /**
     * 插件执行Python脚本
     */
    async executePluginScript(pluginId, scriptName, args = []) {
        const plugin = this.plugins.get(pluginId);
        if (!plugin) {
            throw new Error(`Plugin not found: ${pluginId}`);
        }
        if (!plugin.manifest.python) {
            throw new Error(`Plugin ${pluginId} has no Python scripts`);
        }
        const scriptPath = path.join(plugin.path, 'python', scriptName);
        return this.pythonRunner.runScript(scriptPath, args);
    }
    /**
     * 获取插件目录
     */
    getPluginsDir() {
        return this.pluginsDir;
    }
    /**
     * 设置插件目录
     */
    setPluginsDir(dir) {
        this.pluginsDir = dir;
        this.ensurePluginsDir();
    }
    /**
     * 创建新插件模板
     */
    async createPluginTemplate(name, options) {
        const pluginId = name.toLowerCase().replace(/\s+/g, '-');
        const pluginPath = path.join(this.pluginsDir, pluginId);
        // 创建目录结构
        fs.mkdirSync(pluginPath, { recursive: true });
        // 创建 plugin.json
        const manifest = {
            id: pluginId,
            name,
            version: '1.0.0',
            description: '',
            main: 'dist/index.js',
            capabilities: {
                deviceRequired: false,
                supportedActions: [],
            },
        };
        if (options?.withPython) {
            manifest.python = {
                script: `python/${pluginId}.py`,
            };
        }
        fs.writeFileSync(path.join(pluginPath, 'plugin.json'), JSON.stringify(manifest, null, 2));
        // 创建views.json
        fs.writeFileSync(path.join(pluginPath, 'views.json'), JSON.stringify([
            {
                id: `${pluginId}-main`,
                title: name,
                component: `${pluginId}Main`,
            },
        ], null, 2));
        // 创建Python脚本目录
        if (options?.withPython) {
            fs.mkdirSync(path.join(pluginPath, 'python'), { recursive: true });
        }
        console.log(`Plugin template created: ${pluginPath}`);
        return pluginPath;
    }
}
