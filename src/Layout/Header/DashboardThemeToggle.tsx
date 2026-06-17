import React from 'react';
import { ColorPicker } from 'antd';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import type { DashboardThemeToggleProps } from '@/Types';

const DashboardThemeToggle: React.FC<DashboardThemeToggleProps> = ({ isDark, setIsDark, primaryColor, setPrimaryColor }) => {
  const handleColorChange = (_: any, hex: string) => {
    setPrimaryColor(hex);
  };
  const toggleTheme = () => {
    setIsDark(!isDark);
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <ColorPicker value={primaryColor} onChange={handleColorChange} />
      <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: 'inherit' }} > 
        {isDark ? <SunOutlined /> : <MoonOutlined />} 
      </button>
    </div>
  );
};

export default DashboardThemeToggle;