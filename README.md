# Android Device Testing Platform

一个基于 Electron + React + TypeScript 的 Android 设备自动化测试平台，提供图形化界面来管理和执行 ADB 命令。

## ✨ 功能特性

- 🔍 **设备管理**：自动检测和显示连接的 Android 设备
- 🖥️ **图形化界面**：基于 VS Code 风格的现代化 UI
- ⚡ **实时监控**：设备状态实时更新
- 🛠️ **命令执行**：通过图形界面执行 ADB 命令
- 🔧 **开发友好**：热重载支持，实时更新
- 🎨 **美观界面**：使用 Ant Design 组件库

## 🛠️ 技术栈

- **前端框架**：React 18 + TypeScript
- **构建工具**：Vite 5
- **桌面应用**：Electron 27
- **UI 组件库**：Ant Design 6
- **状态管理**：Zustand
- **进程间通信**：Electron IPC + HTTP API
- **ADB 工具**：集成 adbkit

## 📋 系统要求

- macOS / Windows / Linux
- Node.js >= 18.0.0
- npm >= 8.0.0
- Android SDK 工具（adb 命令）

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/your-username/t_platform.git
cd t_platform
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发服务器

```bash
npm run dev
```

这将同时启动：
- Vite 开发服务器（端口 5173）
- Electron 主进程

### 4. 构建生产版本

```bash
npm run build
```

### 5. 预览生产版本

```bash
npm run preview
```

## 📱 使用说明

### 连接设备

1. 确保 Android 设备已通过 USB 连接到电脑
2. 在设备上启用"开发者选项"和"USB 调试"
3. 在平台上点击"刷新设备"按钮
4. 设备将显示在左侧设备列表中

### 执行命令

1. 选择要操作的设备
2. 在命令输入框中输入 ADB 命令
3. 点击"执行"按钮
4. 查看输出结果

### 常用 ADB 命令

```bash
# 查看设备列表
adb devices

# 查看设备信息
adb shell getprop ro.product.model

# 安装应用
adb install path/to/app.apk

# 卸载应用
adb uninstall com.package.name

# 查看应用列表
adb shell pm list packages

# 进入设备 shell
adb shell

# 查看设备日志
adb logcat

# 拉取文件
adb pull /path/on/device /local/path

# 推送文件
adb push /local/path /path/on/device
```

## 📁 项目结构

```
t_platform/
├── electron/                 # Electron 主进程
│   ├── main.ts               # 主进程入口
│   ├── preload.ts            # 预加载脚本
│   └── services/             # 服务层
│       ├── AdbService.ts     # ADB 服务
│       ├── ShellService.ts   # Shell 命令服务
│       ├── ConfigService.ts  # 配置服务
│       └── PythonService.ts  # Python 服务
├── src/                      # React 渲染进程
│   ├── components/           # React 组件
│   │   ├── Layout/          # 布局组件
│   │   ├── DeviceManager/   # 设备管理组件
│   │   ├── CommandPanel/    # 命令面板组件
│   │   └── Terminal/        # 终端组件
│   ├── hooks/               # 自定义 Hooks
│   ├── services/            # 前端服务
│   ├── store/               # Zustand 状态管理
│   ├── types/               # TypeScript 类型定义
│   └── main.tsx             # 渲染进程入口
├── dist/                    # 构建输出目录
├── public/                  # 静态资源
├── package.json             # 项目配置
├── tsconfig.json           # TypeScript 配置
├── vite.config.ts          # Vite 配置
└── electron-builder.json5  # Electron Builder 配置
```

## 🎯 开发指南

### 开发模式

```bash
# 启动开发服务器（两个进程）
npm run dev

# 只启动前端开发服务器
npm run dev:react

# 只启动 Electron
npm run dev:electron
```

### 代码规范

- 使用 TypeScript 进行类型安全
- 遵循 ESLint 和 Prettier 配置
- 组件使用函数式组件 + Hooks
- 服务层分离，关注点分离

### 添加新功能

1. **新增 ADB 命令**：
   - 在 `electron/services/AdbService.ts` 中添加方法
   - 在 `src/services/api.ts` 中添加 API 调用
   - 在 React 组件中调用

2. **新增 UI 组件**：
   - 在 `src/components/` 下创建组件
   - 使用 Ant Design 组件
   - 添加相应的 TypeScript 类型

3. **新增服务**：
   - 在 `electron/services/` 下创建服务
   - 通过 IPC 或 HTTP API 与渲染进程通信

## 🔧 配置说明

### Electron 配置

主要配置在 `electron/main.ts`：

```typescript
// 项目根目录路径
const PROJECT_ROOT = '/path/to/your/project';

// Electron 可执行文件路径
const electronPath = path.join(PROJECT_ROOT, 'node_modules/electron/Electron.app/Contents/MacOS/Electron');

// API 服务器端口
const PORT = 3173;
```

### Vite 配置

主要配置在 `vite.config.ts`：

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: 'localhost'
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
```

## 🐛 常见问题

### Q: 端口 5173 被占用？

A: 可以修改 `vite.config.ts` 中的端口号：
```typescript
server: {
  port: 5174  // 改为其他端口
}
```

### Q: Electron 无法启动？

A: 检查：
1. 是否已安装 `npm install`
2. Electron 二进制文件是否存在：`node_modules/electron/Electron.app`
3. 路径是否正确

### Q: 设备无法连接？

A: 检查：
1. 设备是否启用开发者模式
2. USB 调试是否启用
3. ADB 驱动是否正确安装
4. 运行 `adb devices` 检查设备状态

### Q: 命令执行失败？

A: 检查：
1. ADB 是否正确安装
2. 设备是否已授权
3. 命令语法是否正确

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 支持

如有问题，请创建 [GitHub Issue](https://github.com/your-username/t_platform/issues)

---

**享受 Android 自动化测试的便捷体验！** 🚀
