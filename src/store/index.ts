import { create } from 'zustand';
import { Device, CommandResult, PanelType, Theme } from '../types';

interface AppState {
  // 设备相关
  devices: Device[];
  selectedDevice: string | null;

  // 命令相关
  commandHistory: string[];
  commandResults: CommandResult[];

  // UI 相关
  activePanel: PanelType;
  theme: Theme;

  // Actions
  setDevices: (devices: Device[]) => void;
  setSelectedDevice: (deviceId: string | null) => void;
  addCommandResult: (result: CommandResult) => void;
  addCommandToHistory: (command: string) => void;
  setActivePanel: (panel: PanelType) => void;
  setTheme: (theme: Theme) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // 初始状态
  devices: [],
  selectedDevice: null,
  commandHistory: [],
  commandResults: [],
  activePanel: 'explorer',
  theme: 'dark',

  // Actions
  setDevices: (devices) => set({ devices }),

  setSelectedDevice: (deviceId) => set({ selectedDevice: deviceId }),

  addCommandResult: (result) =>
    set((state) => ({
      commandResults: [...state.commandResults, result],
    })),

  addCommandToHistory: (command) =>
    set((state) => ({
      commandHistory: [...state.commandHistory, command],
    })),

  setActivePanel: (panel) => set({ activePanel: panel }),

  setTheme: (theme) => set({ theme }),
}));
