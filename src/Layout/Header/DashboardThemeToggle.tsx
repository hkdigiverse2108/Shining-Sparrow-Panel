import React from 'react';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import type { DashboardThemeToggleProps } from '@/Types';

const DashboardThemeToggle: React.FC<DashboardThemeToggleProps> = ({ isDark, setIsDark }) => {
  const toggleTheme = () => {
    setIsDark(!isDark);
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: 'inherit' }} > 
        {isDark ? <SunOutlined /> : <MoonOutlined />} 
      </button>
    </div>
  );
};

export default DashboardThemeToggle;