import React from 'react';
import { Layout, Flex } from 'antd';
import HeaderBrand from './HeaderBrand';
import DashboardThemeToggle from './DashboardThemeToggle';
import HeaderActions from './HeaderActions';
import type { HeaderProps } from '@/Types/Common';
import HeaderNotifications from './HeaderNotification';
import HeaderChatIcon from './HeaderChatIcon';

const { Header } = Layout;

const DashboardHeader: React.FC<HeaderProps> = ({ collapsed, setCollapsed, isDark, setIsDark }) => {
  return (
    <Header style={{ position: 'sticky', top: 0, zIndex: 1000, padding: '0 24px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', color: 'var(--foreground)', transition: 'all 0.2s ease' }} >
      <Flex align="center" justify="space-between" style={{ height: '100%' }}>
        <HeaderBrand collapsed={collapsed} setCollapsed={setCollapsed} />
        <Flex align="center" gap={6}>
          <HeaderChatIcon />
          <HeaderNotifications />
          <div style={{ width: 1, height: 24, background: 'var(--border)', margin: '0 6px' }} />
          <DashboardThemeToggle isDark={isDark} setIsDark={setIsDark} />
          <HeaderActions />
        </Flex>
      </Flex>
    </Header>
  );
};

export default DashboardHeader;