export type DeviceState = 'connected' | 'disconnected' | 'unauthorized' | 'offline';
export interface DeviceInfo {
    id: string;
    name: string;
    state: DeviceState;
    product: string;
    model: string;
    device: string;
    transportId: string;
}
export interface PluginManifest {
    id: string;
    name: string;
    version: string;
    description?: string;
    author?: string;
    icon?: string;
    main: string;
    renderer?: string;
    python?: {
        script: string;
        entry?: string;
    };
    capabilities: {
        deviceRequired: boolean;
        supportedActions: string[];
    };
}
export interface LoadedPlugin {
    manifest: PluginManifest;
    path: string;
    module?: any;
    views: PluginView[];
}
export interface PluginView {
    id: string;
    title: string;
    icon?: string;
    component: string;
}
export interface PythonResult {
    success: boolean;
    stdout: string;
    stderr: string;
    exitCode: number;
}
export interface IpcChannel {
    'device:list': {
        req: void;
        res: DeviceInfo[];
    };
    'device:execute': {
        req: {
            deviceId: string;
            command: string;
        };
        res: PythonResult;
    };
    'device:monitor': {
        req: void;
        res: DeviceInfo[];
    };
    'plugin:list': {
        req: void;
        res: LoadedPlugin[];
    };
    'plugin:load': {
        req: {
            path: string;
        };
        res: LoadedPlugin;
    };
    'plugin:unload': {
        req: {
            id: string;
        };
        res: void;
    };
    'plugin:execute': {
        req: {
            pluginId: string;
            action: string;
            args: string[];
        };
        res: PythonResult;
    };
}
