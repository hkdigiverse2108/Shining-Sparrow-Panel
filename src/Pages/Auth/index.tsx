import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Flex, ConfigProvider, theme } from 'antd';
import { SunOutlined, MoonOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/Store/hooks';
import { setToggleTheme } from '@/Store';

const AuthLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isToggleTheme } = useAppSelector((state) => state.layout);
  const isDark = isToggleTheme === 'dark';
  
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    dispatch(setToggleTheme(isDark ? 'light' : 'dark'));
  };

  const brandColor = isDark ? '#FFC32C' : '#FF8A1F';
  const antTheme = {
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: { 
      colorPrimary: brandColor,
    },
  };

  return (
    <ConfigProvider theme={antTheme}>
      <div className={`universal-container ${isDark ? 'dark' : ''}`} style={{ '--color-primary': brandColor } as React.CSSProperties}>
        <section className="universal-visual-side" aria-hidden="true">
          <div className="universal-orb orb-1" />
          <div className="universal-orb orb-2" />
          <div className="universal-dots" />
          <div className="network-lines">
            <div className="network-line" style={{ top: '25%', left: '20%', width: '300px', transform: 'rotate(15deg)' }} />
            <div className="network-line" style={{ top: '55%', left: '10%', width: '400px', transform: 'rotate(-10deg)', animationDelay: '1s' }} />
          </div>
          <div className="abstract-ui-card abstract-chart">
            <div className="abstract-bars">
              <div className="abstract-bar" style={{ height: '40%' }} />
              <div className="abstract-bar" style={{ height: '70%' }} />
              <div className="abstract-bar" style={{ height: '50%' }} />
              <div className="abstract-bar accent-bar" style={{ height: '90%' }} />
              <div className="abstract-bar" style={{ height: '60%' }} />
            </div>
          </div>
          <div className="abstract-ui-card abstract-profile">
            <div className="abstract-avatar" />
            <div className="abstract-text-stack">
              <div className="abstract-line" />
              <div className="abstract-line abstract-line-short" />
            </div>
          </div>
          <div className="abstract-ui-card abstract-stats">
            <div className="abstract-line" />
            <div className="abstract-line" />
            <div className="abstract-line abstract-line-short" />
          </div>
        </section>
        <section className="universal-form-side">
          <Flex className="controls-area" gap="middle" align="center">
            <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
              {isDark ? <SunOutlined /> : <MoonOutlined />}
            </button>
          </Flex>
          <div className="universal-form-shell">
            <Outlet />
            <Flex align="center" justify="center" gap={6} className="security-footer">
              <SafetyCertificateOutlined style={{ fontSize: '12px', color: 'var(--text-muted)' }} />
              <span style={{ fontSize: '12px', letterSpacing: '0.5px', color: 'var(--text-muted)' }}>
                Shining Sparrow
              </span>
            </Flex>
          </div>
        </section>
      </div>
    </ConfigProvider>
  );
};

export default AuthLayout;