import React from 'react';
import { Tooltip, Space } from 'antd';
import {
  CodeOutlined,
  SearchOutlined,
  BranchesOutlined,
  BugOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { useAppStore } from '../../store';
import { PanelType } from '../../types';
import './ActivityBar.css';

const icons = {
  explorer: <CodeOutlined />,
  search: <SearchOutlined />,
  scm: <BranchesOutlined />,
  debug: <BugOutlined />,
  extensions: <AppstoreOutlined />,
};

export const ActivityBar: React.FC = () => {
  const { activePanel, setActivePanel } = useAppStore();

  const handlePanelClick = (panel: PanelType) => {
    setActivePanel(panel);
  };

  return (
    <div className="activity-bar">
      <Space direction="vertical" size={10}>
        {Object.entries(icons).map(([panel, icon]) => (
          <Tooltip key={panel} placement="right" title={panel}>
            <div
              className={`activity-bar-item ${activePanel === panel ? 'active' : ''}`}
              onClick={() => handlePanelClick(panel as PanelType)}
            >
              {icon}
            </div>
          </Tooltip>
        ))}
      </Space>
    </div>
  );
};
