import React from 'react';
import { Card, List, Badge, Button, Space, Typography } from 'antd';
import { ReloadOutlined, MobileOutlined } from '@ant-design/icons';
import { useDevices } from '../../hooks/useDevices';
import { useAppStore } from '../../store';
import { Device } from '../../types';
import './DeviceManager.css';

const { Title } = Typography;

export const DeviceManager: React.FC = () => {
  const { devices, fetchDevices } = useDevices();
  const { selectedDevice, setSelectedDevice } = useAppStore();

  const handleDeviceClick = (device: Device) => {
    setSelectedDevice(device.id);
  };

  const handleRefresh = () => {
    fetchDevices();
  };

  return (
    <div className="device-manager">
      <div className="device-manager-header">
        <Title level={5} style={{ color: '#cccccc', margin: 0 }}>
          设备管理器
        </Title>
        <Button
          type="text"
          icon={<ReloadOutlined />}
          onClick={handleRefresh}
          style={{ color: '#cccccc' }}
        />
      </div>
      <List
        dataSource={devices}
        renderItem={(device) => (
          <List.Item
            className={`device-item ${selectedDevice === device.id ? 'selected' : ''}`}
            onClick={() => handleDeviceClick(device)}
          >
            <div className="device-info">
              <MobileOutlined style={{ fontSize: 16, marginRight: 8 }} />
              <div className="device-details">
                <div className="device-name">{device.name}</div>
                <div className="device-id">{device.id}</div>
              </div>
              <Badge
                status={device.state === 'connected' ? 'success' : 'default'}
                text={device.state === 'connected' ? '已连接' : '未连接'}
              />
            </div>
          </List.Item>
        )}
      />
      {devices.length === 0 && (
        <div className="no-devices">
          <p>未检测到设备</p>
          <p style={{ fontSize: 12, color: '#888' }}>
            请确保设备已连接并启用USB调试
          </p>
        </div>
      )}
    </div>
  );
};
