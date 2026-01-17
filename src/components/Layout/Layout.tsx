import React from 'react';
import { Layout as AntLayout, theme } from 'antd';
import { ActivityBar } from './ActivityBar';
import { Sidebar } from './Sidebar';
import { MainContent } from './MainContent';
import { StatusBar } from './StatusBar';
import './Layout.css';

const { Sider, Content } = AntLayout;

export const Layout: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <AntLayout className="app-layout">
      <ActivityBar />
      <AntLayout className="main-layout">
        <Sider
          width={60}
          style={{
            background: colorBgContainer,
            borderRight: '1px solid #303030',
          }}
        >
          <Sidebar />
        </Sider>
        <Layout>
          <Content
            style={{
              background: '#1e1e1e',
              padding: 0,
              height: '100%',
              overflow: 'hidden',
            }}
          >
            <MainContent />
          </Content>
          <StatusBar />
        </Layout>
      </AntLayout>
    </AntLayout>
  );
};
