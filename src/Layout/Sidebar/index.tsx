import { useState, type FC } from 'react';
import { Layout, Menu, Drawer, Grid, Flex, Avatar, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/Store/hooks';
import { setToggleSidebar } from '@/Store';
import type { SidebarProps } from '@/Types';
import { NavItems, UserMenuData } from '@/Data';
const { Sider } = Layout;
const { useBreakpoint } = Grid;

const Sidebar: FC<SidebarProps> = ({ isExpanded }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const screens = useBreakpoint();
  const user = useAppSelector((store) => store.auth.user);
  const [hoverExpanded, setHoverExpanded] = useState(false);
  const isMobile = !screens.md;
  const isActuallyCollapsed = !isExpanded && !hoverExpanded;
  const handleMouseEnter = () => { if (!isExpanded && !isMobile) setHoverExpanded(true) };
  const handleMouseLeave = () => { setHoverExpanded(false) };
  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
    if (isMobile) dispatch(setToggleSidebar()); 
  };
  const menuItems: MenuProps['items'] = NavItems .filter((item): item is typeof item & { path: string } => typeof item.path === 'string' ) .map(item => ({
    key: item.path,
    icon: item.icon,
    label: item.name,
  }));

  const isDividerItem = (item: typeof UserMenuData[number]): item is { type: 'divider' } =>
    'type' in item && item.type === 'divider';

  const userMenuItems: MenuProps['items'] = UserMenuData.map((item) =>
    isDividerItem(item)
      ? { type: 'divider' }
      : {
          key: item.key,
          icon: item.icon,
          label: item.label,
          danger: item.danger,
        }
  );

  const getSelectedKey = () => {
    if (location.pathname.startsWith('/courses')) return '/courses';
    if (location.pathname.startsWith('/workshops')) return '/workshops';
    return location.pathname;
  };

  const sidebarContent = (
    <Flex vertical style={{ height: '100%' }}>
      <div className="flex items-center justify-center" style={{ height: 64, borderBottom: '1px solid var(--border)' }} >
        {isActuallyCollapsed ? (
          <div style={{ 
            width: 36, height: 36, background: 'var(--primary)', borderRadius: 8, 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            color: '#fff', fontWeight: 800, fontSize: '18px' 
          }}>
            M
          </div>
        ) : (
          <h2 style={{ color: 'var(--primary)', margin: 0, fontWeight: 700, fontSize: '20px', whiteSpace: 'nowrap' }}>
            MyApp
          </h2>
        )}
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Menu mode="inline" selectedKeys={[getSelectedKey()]} items={menuItems} onClick={handleMenuClick} style={{ borderRight: 0, background: 'transparent' }} />
      </div>
      <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="topRight">
        <div style={{ borderTop: '1px solid var(--border)', padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }} >
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: 'var(--primary)', flexShrink: 0 }} />
          {!isActuallyCollapsed && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{ color: 'var(--foreground)', fontWeight: 500, fontSize: '14px', lineHeight: '20px', whiteSpace: 'nowrap' }}>
                 {user?.name || 'Guest User'}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px', lineHeight: '16px', whiteSpace: 'nowrap' }}>
                {user?.email || 'guest@myapp.com'}
              </div>
            </div>
          )}
        </div>
      </Dropdown>
    </Flex>
  );
    if (isMobile) {
    return (
      <Drawer placement="left" closable={false} onClose={() => dispatch(setToggleSidebar())} open={isExpanded} styles={{ body: { padding: 0 }, header: { display: 'none' } }} style={{ background: 'var(--surface)' }} >
        {sidebarContent}
      </Drawer>
    );
  }
  return (
    <Sider  trigger={null} collapsible collapsed={isActuallyCollapsed} width={250} collapsedWidth={80} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ overflow: 'hidden', height: '100vh', position: 'sticky', top: 0, left: 0, background: 'var(--surface)', borderRight: '1px solid var(--border)',transition: 'all 0.2s ease' }} >
      {sidebarContent}
    </Sider>
  );
};

export default Sidebar;
