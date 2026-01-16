// Electron 类型声明
declare module 'electron' {
  import { EventEmitter } from 'events';

  export class App extends EventEmitter {
    isReady(): boolean;
    whenReady(): Promise<void>;
    quit(): void;
    exit(code: number): void;
    getPath(name: string): string;
  }

  export class BrowserWindow extends EventEmitter {
    constructor(options?: any);
    loadURL(url: string, options?: any): Promise<void>;
    loadFile(filePath: string, options?: any): Promise<void>;
    show(): void;
    hide(): void;
    close(): void;
    minimize(): void;
    maximize(): void;
    restore(): void;
    setSize(width: number, height: number): void;
    getSize(): [number, number];
    setTitle(title: string): void;
    webContents: WebContents;
    id: number;
    static getAllWindows(): BrowserWindow[];
    static getFocusedWindow(): BrowserWindow | null;
  }

  export class WebContents extends EventEmitter {
    loadURL(url: string, options?: any): Promise<void>;
    executeJavaScript(code: string): Promise<any>;
    openDevTools(options?: any): void;
    send(channel: string, ...args: any[]): void;
    getURL(): string;
    getTitle(): string;
    id: number;
  }

  export interface IpcMain extends EventEmitter {
    handle(channel: string, listener: (event: any, ...args: any[]) => Promise<any> | any): void;
    handleOnce(channel: string, listener: (event: any, ...args: any[]) => Promise<any> | any): void;
    on(channel: string, listener: (event: any, ...args: any[]) => void): this;
    once(channel: string, listener: (event: any, ...args: any[]) => void): this;
    removeHandler(channel: string): void;
  }

  export interface IpcRenderer extends EventEmitter {
    send(channel: string, ...args: any[]): void;
    invoke(channel: string, ...args: any[]): Promise<any>;
    on(channel: string, listener: (event: any, ...args: any[]) => void): this;
    once(channel: string, listener: (event: any, ...args: any[]) => void): this;
    removeListener(channel: string, listener: (...args: any[]) => void): this;
    removeAllListeners(channel: string): this;
  }

  export interface ContextBridge {
    exposeInMainWorld(apiKey: string, api: any): void;
  }

  export const app: App;
  export const ipcMain: IpcMain;
  export const ipcRenderer: IpcRenderer;
  export const contextBridge: ContextBridge;
}
