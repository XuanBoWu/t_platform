import React from 'react';
import { useAppStore } from '../../store';
import { ApiOutlined } from '@ant-design/icons';
import './StatusBar.css';

export const StatusBar: React.FC = () => {
  const { selectedDevice } = useAppStore();

  return (
    <div className="status-bar">
      <div className="status-bar-left">
        <ApiOutlined style={{ marginRight: 8 }} />
        <span>Android Device Testing Platform</span>
      </div>
      <div className="status-bar-right">
        {selectedDevice ? (
          <span>设备: {selectedDevice}</span>
        ) : (
          <span>未选择设备</span>
        )}
      </div>
    </div>
  );
};
