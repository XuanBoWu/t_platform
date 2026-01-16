import React from 'react';
import {
  Card,
  List,
  Tag,
  Space,
  Typography,
  Empty,
  Spin,
  Button,
  Tooltip,
} from 'antd';
import {
  MobileOutlined,
  DisconnectOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import type { DeviceInfo } from '@shared/types';

const { Text, Title } = Typography;

interface DevicePanelProps {
  devices: DeviceInfo[];
  selectedDevice: DeviceInfo | null;
  onSelectDevice: (device: DeviceInfo) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

// 状态颜色映射
const statusColors: Record<string, string> = {
  connected: 'success',
  disconnected: 'default',
  offline: 'warning',
  unauthorized: 'error',
};

// 状态图标映射
const statusIcons: Record<string, React.ReactNode> = {
  connected: <CheckCircleOutlined />,
  disconnected: <DisconnectOutlined />,
  offline: <ExclamationCircleOutlined />,
  unauthorized: <ExclamationCircleOutlined />,
};

// 状态文本映射
const statusText: Record<string, string> = {
  connected: '已连接',
  disconnected: '已断开',
  offline: '离线',
  unauthorized: '未授权',
};

export function DevicePanel({
  devices,
  selectedDevice,
  onSelectDevice,
  onRefresh,
  isLoading,
}: DevicePanelProps) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 设备统计 */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-color)',
          background: 'var(--bg-card)',
        }}
      >
        <Space size={24}>
          <div>
            <Text type="secondary">总设备数</Text>
            <Title level={3} style={{ margin: 0 }}>
              {devices.length}
            </Title>
          </div>
          <div>
            <Text type="secondary">已连接</Text>
            <Title level={3} style={{ margin: 0, color: '#52c41a' }}>
              {devices.filter(d => d.state === 'connected').length}
            </Title>
          </div>
          <div>
            <Text type="secondary">离线</Text>
            <Title level={3} style={{ margin: 0, color: '#faad14' }}>
              {devices.filter(d => d.state === 'offline').length}
            </Title>
          </div>
        </Space>
      </div>

      {/* 设备列表 */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: 16,
        }}
      >
        {isLoading && devices.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">正在扫描设备...</Text>
            </div>
          </div>
        ) : devices.length === 0 ? (
          <Empty
            description={
              <Space direction="vertical" size={4}>
                <Text type="secondary">未发现设备</Text>
                <Button type="link" onClick={onRefresh}>
                  重新扫描
                </Button>
              </Space>
            }
          >
            <MobileOutlined style={{ fontSize: 48, color: '#333' }} />
          </Empty>
        ) : (
          <List
            dataSource={devices}
            renderItem={(device) => {
              const isSelected = selectedDevice?.id === device.id;
              return (
                <Card
                  size="small"
                  style={{
                    marginBottom: 12,
                    cursor: 'pointer',
                    borderColor: isSelected ? '#1890ff' : 'var(--border-color)',
                    background: isSelected ? 'rgba(24, 144, 255, 0.1)' : 'var(--bg-card)',
                    transition: 'all 0.2s ease',
                  }}
                  onClick={() => onSelectDevice(device)}
                  hoverable
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Space direction="vertical" size={4} style={{ flex: 1 }}>
                      <Space size={8}>
                        <MobileOutlined />
                        <Text strong style={{ fontSize: 14 }}>
                          {device.name}
                        </Text>
                        {isSelected && (
                          <Tag color="blue" style={{ margin: 0 }}>
                            已选择
                          </Tag>
                        )}
                      </Space>
                      <Text type="secondary" style={{ fontSize: 12, fontFamily: 'var(--font-mono)' }}>
                        {device.id}
                      </Text>
                      <Space size={12}>
                        <Tag
                          color={statusColors[device.state]}
                          icon={statusIcons[device.state]}
                          style={{ margin: 0 }}
                        >
                          {statusText[device.state]}
                        </Tag>
                        <Text type="secondary" style={{ fontSize: 11 }}>
                          {device.model} | {device.product}
                        </Text>
                      </Space>
                    </Space>

                    <Tooltip title="查看详情">
                      <Button
                        type="text"
                        icon={<InfoCircleOutlined />}
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Device details:', device);
                        }}
                      />
                    </Tooltip>
                  </div>
                </Card>
              );
            }}
          />
        )}
      </div>
    </div>
  );
}
