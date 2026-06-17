import React from 'react';
import { Layout, Flex } from 'antd';
import HeaderBrand from './HeaderBrand';
import DashboardThemeToggle from './DashboardThemeToggle';
import HeaderActions from './HeaderActions';
import type { HeaderProps } from '@/Types/Common';

const { Header } = Layout;

const DashboardHeader: React.FC<HeaderProps> = ({ collapsed, setCollapsed, isDark, setIsDark, primaryColor, setPrimaryColor }) => {
  return (
    <Header style={{ position: 'sticky', top: 0, zIndex: 1000, padding: '0 24px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', color: 'var(--foreground)' }} >
      <Flex align="center" justify="space-between" style={{ height: '100%' }}>
        <HeaderBrand collapsed={collapsed} setCollapsed={setCollapsed} />
        <Flex align="center" gap="middle">
          <DashboardThemeToggle isDark={isDark} setIsDark={setIsDark} primaryColor={primaryColor} setPrimaryColor={setPrimaryColor}  />
          <HeaderActions />
        </Flex>
      </Flex>
    </Header>
  );
};

export default DashboardHeader;