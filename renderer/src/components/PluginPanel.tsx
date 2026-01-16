import { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Empty,
  Typography,
  Space,
  Tag,
  Tooltip,
  message,
} from 'antd';
import {
  ToolOutlined,
  PlusOutlined,
  ThunderboltOutlined,
  CameraOutlined,
  FileTextOutlined,
  BarChartOutlined,
  DatabaseOutlined,
  FolderOpenOutlined,
} from '@ant-design/icons';
import type { DeviceInfo } from '@shared/types';

const { Title, Text, Paragraph } = Typography;

// 内置插件列表
const builtInPlugins = [
  {
    id: 'screen-capture',
    name: '屏幕截图',
    description: '捕获Android设备屏幕并保存为图片',
    icon: <CameraOutlined />,
    color: '#52c41a',
    category: '工具',
  },
  {
    id: 'battery-monitor',
    name: '电池监控',
    description: '监控设备电池状态和电量变化',
    icon: <ThunderboltOutlined />,
    color: '#faad14',
    category: '监控',
  },
  {
    id: 'logcat-viewer',
    name: '日志查看器',
    description: '实时查看和分析设备日志',
    icon: <FileTextOutlined />,
    color: '#1890ff',
    category: '调试',
  },
  {
    id: 'performance-monitor',
    name: '性能监控',
    description: '监控CPU、内存、GPU使用情况',
    icon: <BarChartOutlined />,
    color: '#722ed1',
    category: '监控',
  },
  {
    id: 'app-manager',
    name: '应用管理',
    description: '安装、卸载、列出已安装应用',
    icon: <DatabaseOutlined />,
    color: '#13c2c2',
    category: '管理',
  },
];

// 插件分类颜色
const categoryColors: Record<string, string> = {
  工具: 'green',
  监控: 'orange',
  调试: 'blue',
  管理: 'cyan',
  自动化: 'purple',
};

interface PluginPanelProps {
  selectedDevice: DeviceInfo | null;
}

export function PluginPanel({ selectedDevice }: PluginPanelProps) {
  const [loadingPlugin, setLoadingPlugin] = useState<string | null>(null);

  const handleLaunchPlugin = async (pluginId: string) => {
    if (!selectedDevice) {
      message.warning('请先选择一个已连接的设备');
      return;
    }

    setLoadingPlugin(pluginId);
    try {
      // TODO: 实现插件启动逻辑
      message.success(`启动插件: ${pluginId}`);
    } catch (err) {
      message.error(`启动失败: ${err}`);
    } finally {
      setLoadingPlugin(null);
    }
  };

  return (
    <div style={{ height: '100%', padding: 16, overflow: 'auto' }}>
      {/* 插件工具栏 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          插件工具
        </Title>
        <Space>
          <Tooltip title="从目录加载插件">
            <Button icon={<FolderOpenOutlined />}>加载插件</Button>
          </Tooltip>
          <Tooltip title="创建新插件">
            <Button type="primary" icon={<PlusOutlined />}>
              创建插件
            </Button>
          </Tooltip>
        </Space>
      </div>

      {/* 设备选择提示 */}
      {!selectedDevice && (
        <Card style={{ marginBottom: 16, background: 'var(--bg-card)' }}>
          <Space direction="vertical" align="center" style={{ width: '100%' }}>
            <ToolOutlined style={{ fontSize: 32, color: '#faad14' }} />
            <Text type="warning">请先选择一个已连接的设备以使用插件功能</Text>
          </Space>
        </Card>
      )}

      {/* 插件网格 */}
      <Row gutter={[16, 16]}>
        {builtInPlugins.map((plugin) => (
          <Col xs={24} sm={12} lg={8} xl={6} key={plugin.id}>
            <Card
              hoverable
              style={{
                height: '100%',
                background: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
              }}
              actions={[
                <Button
                  key="launch"
                  type="text"
                  onClick={() => handleLaunchPlugin(plugin.id)}
                  loading={loadingPlugin === plugin.id}
                  disabled={!selectedDevice}
                >
                  启动
                </Button>,
                <Button key="config" type="text">
                  配置
                </Button>,
              ]}
            >
              <Card.Meta
                avatar={
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      background: `${plugin.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: plugin.color,
                      fontSize: 20,
                    }}
                  >
                    {plugin.icon}
                  </div>
                }
                title={
                  <Space>
                    {plugin.name}
                    <Tag color={categoryColors[plugin.category]} style={{ margin: 0 }}>
                      {plugin.category}
                    </Tag>
                  </Space>
                }
                description={
                  <Paragraph
                    type="secondary"
                    style={{ fontSize: 12, marginBottom: 0, marginTop: 8 }}
                    ellipsis={{ rows: 2 }}
                  >
                    {plugin.description}
                  </Paragraph>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 已安装插件列表 */}
      <div style={{ marginTop: 32 }}>
        <Title level={5}>
          <ToolOutlined /> 已安装插件
        </Title>
        <Empty
          description="暂无已安装的自定义插件"
          style={{ padding: '40px 0' }}
        >
          <Button type="link">浏览插件市场</Button>
        </Empty>
      </div>
    </div>
  );
}
