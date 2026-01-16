import { useState, useEffect } from 'react';
import {
  Layout,
  Menu,
  Typography,
  Badge,
  Space,
  Button,
  Tooltip,
  Divider,
} from 'antd';
import {
  ApiOutlined,
  ToolOutlined,
  SettingOutlined,
  CloudServerOutlined,
  ReloadOutlined,
  PlayCircleOutlined,
  BugOutlined,
} from '@ant-design/icons';
import { DevicePanel } from './components/DevicePanel';
import { PluginPanel } from './components/PluginPanel';
import { TerminalPanel } from './components/TerminalPanel';
import { useDevices } from './hooks/useDevices';
import type { DeviceInfo } from '@shared/types';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

// 页面组件类型
type PageType = 'devices' | 'plugins' | 'terminal' | 'settings';

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [activePage, setActivePage] = useState<PageType>('devices');
  const [selectedDevice, setSelectedDevice] = useState<DeviceInfo | null>(null);
  const { devices, refreshDevices, isLoading } = useDevices();

  // 默认选择第一个已连接的设备
  useEffect(() => {
    if (!selectedDevice && devices.length > 0) {
      const connected = devices.find(d => d.state === 'connected');
      if (connected) {
        setSelectedDevice(connected);
      }
    }
  }, [devices, selectedDevice]);

  const menuItems = [
    {
      key: 'devices',
      icon: <CloudServerOutlined />,
      label: '设备管理',
    },
    {
      key: 'plugins',
      icon: <ToolOutlined />,
      label: '插件工具',
    },
    {
      key: 'terminal',
      icon: <ApiOutlined />,
      label: '终端',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
  ];

  const renderContent = () => {
    switch (activePage) {
      case 'devices':
        return (
          <DevicePanel
            devices={devices}
            selectedDevice={selectedDevice}
            onSelectDevice={setSelectedDevice}
            onRefresh={refreshDevices}
            isLoading={isLoading}
          />
        );
      case 'plugins':
        return <PluginPanel selectedDevice={selectedDevice} />;
      case 'terminal':
        return <TerminalPanel selectedDevice={selectedDevice} />;
      case 'settings':
        return (
          <div className="p-4">
            <Title level={4}>设置</Title>
            <Divider />
            <Text type="secondary">配置选项开发中...</Text>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 左侧导航栏 */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={220}
        theme="dark"
        style={{
          borderRight: '1px solid var(--border-color)',
        }}
      >
        <div
          style={{
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? 0 : '0 16px',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <BugOutlined style={{ fontSize: 24, color: '#1890ff' }} />
          {!collapsed && (
            <Title
              level={4}
              style={{ margin: '0 0 0 12px', color: '#fff' }}
            >
              T-Platform
            </Title>
          )}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[activePage]}
          items={menuItems}
          onClick={({ key }) => setActivePage(key as PageType)}
          style={{ borderRight: 0, marginTop: 8 }}
        />
      </Sider>

      <Layout>
        {/* 顶部栏 */}
        <Header
          style={{
            padding: '0 20px',
            background: 'var(--bg-darker)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 60,
          }}
        >
          <Space size={16}>
            <Title level={4} style={{ margin: 0 }}>
              {activePage === 'devices' && '设备管理'}
              {activePage === 'plugins' && '插件工具'}
              {activePage === 'terminal' && '终端'}
              {activePage === 'settings' && '设置'}
            </Title>
            {selectedDevice && (
              <Badge
                status="success"
                text={
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {selectedDevice.id}
                  </Text>
                }
              />
            )}
          </Space>

          <Space size={12}>
            <Tooltip title="刷新设备列表">
              <Button
                icon={<ReloadOutlined />}
                onClick={refreshDevices}
                loading={isLoading}
              />
            </Tooltip>
            <Tooltip title="执行">
              <Button
                type="primary"
                icon={<PlayCircleOutlined />}
                disabled={!selectedDevice}
              >
                执行
              </Button>
            </Tooltip>
          </Space>
        </Header>

        {/* 主内容区 */}
        <Content
          style={{
            margin: 0,
            padding: 0,
            background: 'var(--bg-dark)',
            overflow: 'hidden',
          }}
        >
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
