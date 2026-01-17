import React, { useState } from 'react';
import { Card, Input, Button, Space, Select, Typography, Tooltip } from 'antd';
import { PlayCircleOutlined, HistoryOutlined } from '@ant-design/icons';
import { useAppStore } from '../../store';
import { ApiService } from '../../services/api';
import './CommandPanel.css';

const { TextArea } = Input;
const { Title } = Typography;

const commonCommands = [
  'adb devices',
  'adb shell getprop ro.product.model',
  'adb shell getprop ro.build.version.release',
  'adb shell pm list packages',
  'adb logcat',
  'adb shell dumpsys battery',
];

export const CommandPanel: React.FC = () => {
  const [command, setCommand] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const { selectedDevice, addCommandResult, addCommandToHistory } = useAppStore();

  const handleExecute = async () => {
    if (!command.trim() || !selectedDevice) {
      return;
    }

    setIsExecuting(true);
    addCommandToHistory(command);

    const result = await ApiService.executeCommand(selectedDevice, command);
    addCommandResult({
      ...result,
      stdout: `${command}\n${result.stdout}`,
    });

    setIsExecuting(false);
    setCommand('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleExecute();
    }
  };

  const handleCommandSelect = (value: string) => {
    setCommand(value);
  };

  return (
    <div className="command-panel">
      <div className="command-panel-header">
        <Title level={5} style={{ color: '#cccccc', margin: 0 }}>
          ADB 命令面板
        </Title>
        {selectedDevice && (
          <span style={{ fontSize: 12, color: '#888' }}>
            设备: {selectedDevice}
          </span>
        )}
      </div>
      <div className="command-panel-content">
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <div>
            <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#888', fontSize: 12 }}>常用命令</span>
              <Select
                size="small"
                style={{ width: 200 }}
                placeholder="选择常用命令"
                onSelect={handleCommandSelect}
                options={commonCommands.map((cmd) => ({
                  value: cmd,
                  label: cmd,
                }))}
              />
            </div>
            <TextArea
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={
                selectedDevice
                  ? '输入 ADB 命令 (Ctrl+Enter 执行)'
                  : '请先选择一个设备'
              }
              disabled={!selectedDevice}
              autoSize={{ minRows: 3, maxRows: 6 }}
              className="command-input"
            />
          </div>
          <div className="command-actions">
            <Tooltip title="Ctrl+Enter">
              <Button
                type="primary"
                icon={<PlayCircleOutlined />}
                onClick={handleExecute}
                loading={isExecuting}
                disabled={!command.trim() || !selectedDevice}
              >
                执行命令
              </Button>
            </Tooltip>
            <Button icon={<HistoryOutlined />} disabled>
              历史记录
            </Button>
          </div>
        </Space>
      </div>
    </div>
  );
};
