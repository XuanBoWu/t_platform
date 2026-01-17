import React from 'react';
import { useAppStore } from '../../store';
import { DeviceManager } from '../DeviceManager/DeviceManager';

export const Sidebar: React.FC = () => {
  const { activePanel } = useAppStore();

  const renderPanel = () => {
    switch (activePanel) {
      case 'explorer':
        return <DeviceManager />;
      case 'search':
        return <div>Search Panel</div>;
      case 'scm':
        return <div>Source Control Panel</div>;
      case 'debug':
        return <div>Debug Panel</div>;
      case 'extensions':
        return <div>Extensions Panel</div>;
      default:
        return <DeviceManager />;
    }
  };

  return <div className="sidebar-content">{renderPanel()}</div>;
};
