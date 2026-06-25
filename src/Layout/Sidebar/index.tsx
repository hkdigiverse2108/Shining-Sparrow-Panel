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
      <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: isActuallyCollapsed ? 'center' : 'flex-start' }}>
        {isActuallyCollapsed ? (
          <img 
            src="/assets/images/Logo_icon.png" 
            alt="Logo Icon" 
            style={{ height: 32, width: 32, objectFit: 'contain' }} 
          />
        ) : (
          <img 
            src="/assets/images/Logo_full.png" 
            alt="Logo Full" 
            style={{ height: 38, width: 'auto', objectFit: 'contain' }} 
          />
        )}
      </div>
      <div className="sidebar-scroll" style={{ flex: 1, overflowY: 'auto', padding: '12px 8px' }}>
        <div style={{ padding: '0 12px 8px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
          {isActuallyCollapsed ? '' : 'Menu'}
        </div>
        <Menu mode="inline" selectedKeys={[getSelectedKey()]} items={menuItems} onClick={handleMenuClick} style={{ borderRight: 0, background: 'transparent' }} />
      </div>
      <div style={{ borderTop: '1px solid var(--border)', padding: '12px 8px' }}>
        <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="topRight">
          <div style={{ padding: '10px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', borderRadius: '8px', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-muted)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'} >
            <Avatar icon={<UserOutlined />} size={36} style={{ backgroundColor: '#e86424', flexShrink: 0 }} />
            {!isActuallyCollapsed && (
              <div style={{ overflow: 'hidden', flex: 1 }}>
                <div style={{ color: 'var(--foreground)', fontWeight: 600, fontSize: '13px', lineHeight: '18px', whiteSpace: 'nowrap' }}>
                   {user?.name || 'Guest User'}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '11px', lineHeight: '14px', whiteSpace: 'nowrap' }}>
                  {user?.email || 'guest@myapp.com'}
                </div>
              </div>
            )}
          </div>
        </Dropdown>
      </div>
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
    <Sider  trigger={null} collapsible collapsed={isActuallyCollapsed} width={250} collapsedWidth={80} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ overflow: 'hidden', height: '100vh', position: 'sticky', top: 0, left: 0, background: 'var(--surface)', borderRight: '1px solid var(--border)', transition: 'all 0.2s ease' }} >
      {sidebarContent}
    </Sider>
  );
};

export default Sidebar;
