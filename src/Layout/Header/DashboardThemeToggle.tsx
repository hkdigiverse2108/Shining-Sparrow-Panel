import React from 'react';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import type { DashboardThemeToggleProps } from '@/Types';

const DashboardThemeToggle: React.FC<DashboardThemeToggleProps> = ({ isDark, setIsDark }) => {
  const toggleTheme = () => {
    setIsDark(!isDark);
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme" style={{ background: 'none', border: '1px solid var(--border)', cursor: 'pointer', fontSize: '16px', color: 'var(--foreground)', width: 38, height: 38, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }} > 
        {isDark ? <SunOutlined /> : <MoonOutlined />} 
      </button>
    </div>
  );
};

export default DashboardThemeToggle;