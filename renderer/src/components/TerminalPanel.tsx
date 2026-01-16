import { useState, useRef, useEffect } from 'react';
import {
  Card,
  Input,
  Button,
  Space,
  Typography,
  Tooltip,
  Select,
  Tag,
  Empty,
} from 'antd';
import {
  SendOutlined,
  ClearOutlined,
  CopyOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import type { DeviceInfo } from '@shared/types';
import { executeCommand as apiExecuteCommand } from '../hooks/useDevices';

const { Text } = Typography;
const { TextArea } = Input;

// 输出行类型
interface OutputLine {
  id: string;
  timestamp: string;
  type: 'input' | 'output' | 'error' | 'system';
  content: string;
}

interface TerminalPanelProps {
  selectedDevice: DeviceInfo | null;
}

export function TerminalPanel({ selectedDevice }: TerminalPanelProps) {
  const [command, setCommand] = useState('');
  const [outputs, setOutputs] = useState<OutputLine[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const outputRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [outputs]);

  // 添加输出行
  const addOutput = (type: OutputLine['type'], content: string) => {
    const now = new Date();
    const timestamp = now.toLocaleTimeString('zh-CN', { hour12: false });
    const line: OutputLine = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp,
      type,
      content,
    };
    setOutputs((prev) => [...prev, line]);
  };

  // 执行命令
  const executeCommand = async () => {
    if (!command.trim() || !selectedDevice) {
      if (!selectedDevice) {
        addOutput('error', '错误: 请先选择一个设备');
      }
      return;
    }

    const cmd = command.trim();
    setIsExecuting(true);
    addOutput('input', `$ adb -s ${selectedDevice.id} shell ${cmd}`);

    // 保存到历史记录
    if (commandHistory.length === 0 || commandHistory[0] !== cmd) {
      setCommandHistory((prev) => [cmd, ...prev].slice(0, 50));
    }
    setHistoryIndex(-1);
    setCommand('');

    try {
      const result = await apiExecuteCommand(selectedDevice.id, `shell ${cmd}`);
      if (result.stdout) {
        addOutput('output', result.stdout);
      }
      if (result.stderr) {
        addOutput('error', result.stderr);
      }
      addOutput('system', `[命令执行完成]`);
    } catch (err) {
      addOutput('error', `错误: ${err}`);
    } finally {
      setIsExecuting(false);
    }
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      executeCommand();
    }

    // 历史命令导航
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[newIndex]);
      }
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommand('');
      }
    }
  };

  // 清空输出
  const clearOutput = () => {
    setOutputs([]);
  };

  // 复制输出
  const copyOutput = () => {
    const text = outputs.map((o) => o.content).join('\n');
    navigator.clipboard.writeText(text);
  };

  // 预设命令
  const presetCommands = [
    { label: '设备信息', cmd: 'getprop ro.product.model' },
    { label: 'Android版本', cmd: 'getprop ro.build.version.release' },
    { label: 'CPU信息', cmd: 'cat /proc/cpuinfo | head -5' },
    { label: '内存信息', cmd: 'cat /proc/meminfo | head -5' },
    { label: '已安装应用', cmd: 'pm list packages' },
    { label: '网络状态', cmd: 'ifconfig | head -10' },
  ];

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: 16,
      }}
    >
      {/* 顶部工具栏 */}
      <Card
        size="small"
        style={{
          marginBottom: 16,
          background: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
        }}
      >
        <Space wrap>
          <Text strong>设备:</Text>
          <Tag color={selectedDevice ? 'success' : 'default'}>
            {selectedDevice?.id || '未选择'}
          </Tag>
          <Text type="secondary">|</Text>
          <Text type="secondary">预设命令:</Text>
          <Select
            size="small"
            style={{ width: 140 }}
            placeholder="选择预设命令"
            options={presetCommands}
            onChange={(value) => setCommand(value)}
            disabled={!selectedDevice}
          />
        </Space>
      </Card>

      {/* 输出区域 */}
      <Card
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
        }}
        bodyStyle={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
        }}
      >
        {/* 输出工具栏 */}
        <div
          style={{
            padding: '8px 12px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Space>
            <Text type="secondary">终端输出</Text>
            <Tag>{outputs.length} 行</Tag>
          </Space>
          <Space>
            <Tooltip title="复制输出">
              <Button
                type="text"
                icon={<CopyOutlined />}
                size="small"
                onClick={copyOutput}
              />
            </Tooltip>
            <Tooltip title="清空输出">
              <Button
                type="text"
                icon={<ClearOutlined />}
                size="small"
                onClick={clearOutput}
              />
            </Tooltip>
          </Space>
        </div>

        {/* 输出内容 */}
        <div
          ref={outputRef}
          style={{
            flex: 1,
            overflow: 'auto',
            padding: 12,
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            background: '#0d0d0d',
          }}
        >
          {outputs.length === 0 ? (
            <Empty
              description={
                <Text type="secondary">
                  输入命令开始执行...
                  {selectedDevice
                    ? ''
                    : '（请先选择一个设备）'}
                </Text>
              }
            />
          ) : (
            outputs.map((line) => (
              <div
                key={line.id}
                style={{
                  marginBottom: 4,
                  color:
                    line.type === 'error'
                      ? '#ff4d4f'
                      : line.type === 'input'
                      ? '#1890ff'
                      : line.type === 'system'
                      ? '#888'
                      : '#fff',
                }}
              >
                <Text code style={{ marginRight: 8, opacity: 0.5 }}>
                  {line.timestamp}
                </Text>
                {line.type === 'input' ? '➜' : line.type === 'error' ? '✖' : ' '} {line.content}
              </div>
            ))
          )}
          {isExecuting && (
            <div style={{ color: '#1890ff' }}>
              <LoadingOutlined spin /> 执行中...
            </div>
          )}
        </div>
      </Card>

      {/* 输入区域 */}
      <Card
        size="small"
        style={{
          marginTop: 16,
          background: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
        }}
        bodyStyle={{ padding: '12px 12px 8px' }}
      >
        <Space.Compact style={{ width: '100%' }}>
          <TextArea
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              selectedDevice
                ? '输入 ADB Shell 命令... (↑↓ 查看历史，Enter 执行)'
                : '请先选择一个设备'
            }
            disabled={!selectedDevice || isExecuting}
            autoSize={{ minRows: 1, maxRows: 4 }}
            style={{
              fontFamily: 'var(--font-mono)',
              background: 'var(--bg-darker)',
              borderColor: 'var(--border-color)',
            }}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={executeCommand}
            loading={isExecuting}
            disabled={!selectedDevice || !command.trim()}
            style={{ height: 'auto' }}
          >
            执行
          </Button>
        </Space.Compact>
      </Card>
    </div>
  );
}
