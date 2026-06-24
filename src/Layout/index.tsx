import { useEffect, type FC } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout, ConfigProvider, theme } from 'antd'; 
import Sidebar from './Sidebar';
import DashboardHeader from './Header';
import { useAppSelector, useAppDispatch } from '@/Store/hooks'; 
import { setToggleSidebar, setToggleTheme } from '@/Store';

const DashboardLayout: FC = () => {
  const dispatch = useAppDispatch();
  const { isToggleTheme, isExpanded } = useAppSelector((state) => state.layout);
  const isDark = isToggleTheme === "dark";
  useEffect(() => {
    const handleResize = () => {
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);
  const setCollapsed = (val: boolean) => {
    const collapsed = !isExpanded;
    if (val !== collapsed) {
      dispatch(setToggleSidebar());
    }
  };
  const setIsDark = (val: boolean) => {
    dispatch(setToggleTheme(val ? 'dark' : 'light'));
  };
  const brandColor = '#e86424';
  return (
    <ConfigProvider
      theme={{ algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: brandColor,
          colorBgContainer: 'transparent', 
          colorBgElevated: 'var(--surface)', 
          colorBorderSecondary: 'var(--border)',
        },
        components: {
          Layout: { headerBg: 'var(--surface)', siderBg: 'var(--surface)' }
        }
      }}
    >
      <Layout style={{ minHeight: '100vh', background: 'var(--background)' }}>
        <Sidebar isExpanded={isExpanded} />
        <Layout style={{ background: 'transparent' }}>
          <DashboardHeader collapsed={!isExpanded} setCollapsed={setCollapsed} isDark={isDark} setIsDark={setIsDark} />
          <Layout.Content 
            style={{ 
              margin: '14px 16px', 
              padding: 10, 
              minHeight: 280, 
              borderRadius: 8, 
              background: 'var(--surface)', 
              border: '1px solid var(--border)',
              color: 'var(--foreground)'
            }}
          >
            <Outlet />
          </Layout.Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default DashboardLayout;