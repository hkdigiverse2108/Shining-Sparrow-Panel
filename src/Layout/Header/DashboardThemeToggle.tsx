import React from 'react';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import type { DashboardThemeToggleProps } from '@/Types';
import { motion } from 'motion/react';

const DashboardThemeToggle: React.FC<DashboardThemeToggleProps> = ({ isDark, setIsDark }) => {
  const toggleTheme = () => {
    setIsDark(!isDark);
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <motion.button 
        className="theme-toggle-btn" 
        onClick={toggleTheme} 
        aria-label="Toggle theme" 
        style={{ 
          background: 'none', 
          border: '1px solid var(--border)', 
          cursor: 'pointer', 
          fontSize: '16px', 
          color: 'var(--foreground)', 
          width: 38, 
          height: 38, 
          borderRadius: 10, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          outline: 'none'
        }} 
        whileHover={{ scale: 1.08, rotate: 15 }}
        whileTap={{ scale: 0.93 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
      > 
        {isDark ? <SunOutlined /> : <MoonOutlined />} 
      </motion.button>
    </div>
  );
};

export default DashboardThemeToggle;