import { useState } from 'react';
import { Badge, Popover, List, Button, Space, Empty, Typography } from 'antd';
import { BellOutlined, CheckOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

interface HeaderNotificationItem {
  id: string;
  title: string;
  desc: string;
  read: boolean;
  time: string;
  link?: string;
}

const HeaderNotifications = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'notif' | 'alerts'>('notif');

  const [notif, setNotif] = useState<HeaderNotificationItem[]>([
    { id: '1', title: 'New User', desc: 'John Doe joined', read: false, time: '5m ago', link: '/users' },
    { id: '2', title: 'Payment', desc: '$299 from Acme', read: false, time: '30m ago', link: '/payments' },
    { id: '3', title: 'Backup Done', desc: 'Completed successfully', read: true, time: '3h ago' },
  ]);

  const [alerts, setAlerts] = useState<HeaderNotificationItem[]>([
    { id: '4', title: 'CPU High', desc: 'Server #3 at 90%', read: false, time: '15m ago', link: '/servers' },
    { id: '5', title: 'Disk Low', desc: 'Server #1 below 10%', read: false, time: '45m ago', link: '/servers' },
  ]);

  const currentList = tab === 'notif' ? notif : alerts;
  const setCurrentList = tab === 'notif' ? setNotif : setAlerts;
  const unread = [...notif, ...alerts].filter((i) => !i.read).length;
  const notifUnread = notif.filter((i) => !i.read).length;
  const alertUnread = alerts.filter((i) => !i.read).length;

  const markRead = (id: string) => setCurrentList((p) => p.map((i) => (i.id === id ? { ...i, read: true } : i)));
  const markAllRead = () => setCurrentList((p) => p.map((i) => ({ ...i, read: true })));
  const clearAll = () => setCurrentList(() => []);
  
  const handleClick = (item: HeaderNotificationItem) => {
    markRead(item.id);
    if (item.link) { setOpen(false); navigate(item.link); }
  };

  const content = (
    <div style={{ width: 360 }}>
      {/* Top Row: Tabs on left, Actions on right */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Space size={4}>
          <Button
            type={tab === 'notif' ? 'primary' : 'text'}
            size="small"
            onClick={() => setTab('notif')}
            style={{ fontSize: 13 }}
          >
            Notifications {notifUnread > 0 && `(${notifUnread})`}
          </Button>
          <Button
            type={tab === 'alerts' ? 'primary' : 'text'}
            size="small"
            danger={tab === 'alerts'}
            onClick={() => setTab('alerts')}
            style={{ fontSize: 13 }}
          >
            Alerts {alertUnread > 0 && `(${alertUnread})`}
          </Button>
        </Space>

        {currentList.length > 0 && (
          <Space size={0}>
            <Button type="link" size="small" icon={<CheckOutlined />} onClick={markAllRead} style={{ fontSize: 12, padding: '0 4px' }}>
              Read all
            </Button>
            <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={clearAll} style={{ fontSize: 12, padding: '0 4px' }}>
              Clear
            </Button>
          </Space>
        )}
      </div>

      {/* List */}
      <List
        dataSource={currentList}
        locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No items" style={{ padding: '30px 0' }} /> }}
        style={{ maxHeight: 320, overflowY: 'auto' }}
        renderItem={(item) => (
          <List.Item
            onClick={() => handleClick(item)}
            style={{
              cursor: 'pointer',
              padding: '10px 8px',
              borderRadius: 8,
              background: item.read ? 'transparent' : tab === 'notif' ? 'color-mix(in srgb, var(--primary) 8%, transparent)' : 'rgba(255,77,79,0.08)',
              border: 'none',
            }}
          >
            <List.Item.Meta
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {!item.read && (
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: tab === 'notif' ? 'var(--primary)' : '#ff4d4f', flexShrink: 0 }} />
                  )}
                  <Text style={{ color: 'var(--foreground)', fontSize: 13 }} strong={!item.read} ellipsis>
                    {item.title}
                  </Text>
                </div>
              }
              description={
                <>
                  <Text type="secondary" style={{ fontSize: 12 }}>{item.desc}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 11 }}>{item.time}</Text>
                </>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );

  return (
    <Popover
      content={content}
      trigger="click"
      open={open}
      onOpenChange={setOpen}
      placement="bottomRight"
      overlayInnerStyle={{
        padding: '16px',
        background: 'var(--surface)',
        borderRadius: 14,
        border: '1px solid var(--border)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
      }}
    >
      <Badge count={unread} size="small" offset={[-2, 2]}>
        <Button
          type="text"
          icon={<BellOutlined style={{ fontSize: 18 }} />}
          style={{ color: 'var(--foreground)', width: 38, height: 38, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s ease' }}
        />
      </Badge>
    </Popover>
  );
};

export default HeaderNotifications;