import React from 'react';
import { Button } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import type { HeaderBrandProps } from '@/Types';

const HeaderBrand: React.FC<HeaderBrandProps> = ({ collapsed, setCollapsed }) => {
  return (
    <Button
      type="text"
      icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      onClick={() => setCollapsed(!collapsed)}
      style={{
        fontSize: '16px',
        width: 64,
        height: 64,
        color: 'var(--foreground)', 
      }}
    />
  );
};

export default HeaderBrand;