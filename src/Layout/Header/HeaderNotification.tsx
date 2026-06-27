import { useState, useMemo } from 'react';
import { Badge, Popover, List, Button, Space, Empty, Typography } from 'antd';
import { BellOutlined, CheckOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Queries, Mutations } from '@/Api';
import { KEYS } from '@/Constants';
import { motion } from 'motion/react';

dayjs.extend(relativeTime);

const MotionButton = motion.create(Button);

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
  
  const queryClient = useQueryClient();

  // Fetch notifications from the backend API
  const { data: notifRes } = Queries.useGetNotifications();
  
  // Mutations for marking read and deleting
  const { mutate: markReadMutate } = Mutations.useMarkNotificationRead();
  const { mutate: deleteNotificationMutate } = Mutations.useDeleteNotification();

  // Categorize notifications into notif and alerts
  const notif = useMemo<HeaderNotificationItem[]>(() => {
    return (notifRes?.data?.notification_data || [])
      .filter((item: any) => item.type !== 'system' && item.type !== 'alert')
      .map((item: any) => ({
        id: item._id,
        title: item.title,
        desc: item.message,
        read: item.isRead,
        time: dayjs(item.createdAt).fromNow(),
        link: item.type === 'workshop' ? '/workshops' : item.type === 'news' ? '/blog' : undefined,
      }));
  }, [notifRes]);

  const alerts = useMemo<HeaderNotificationItem[]>(() => {
    return (notifRes?.data?.notification_data || [])
      .filter((item: any) => item.type === 'system' || item.type === 'alert')
      .map((item: any) => ({
        id: item._id,
        title: item.title,
        desc: item.message,
        read: item.isRead,
        time: dayjs(item.createdAt).fromNow(),
        link: undefined,
      }));
  }, [notifRes]);

  const currentList = tab === 'notif' ? notif : alerts;
  const unread = [...notif, ...alerts].filter((i) => !i.read).length;
  const notifUnread = notif.filter((i) => !i.read).length;
  const alertUnread = alerts.filter((i) => !i.read).length;

  const markRead = (id: string) => {
    markReadMutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [KEYS.NOTIFICATION.BASE] });
        },
      }
    );
  };

  const markAllRead = () => {
    markReadMutate(
      { id: 'all' },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [KEYS.NOTIFICATION.BASE] });
        },
      }
    );
  };

  const clearAll = () => {
    deleteNotificationMutate(
      { id: 'all' },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [KEYS.NOTIFICATION.BASE] });
        },
      }
    );
  };
  
  const handleClick = (item: HeaderNotificationItem) => {
    markRead(item.id);
    if (item.link) { 
      setOpen(false); 
      navigate(item.link); 
    }
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
      styles={{
        content: {
          padding: '16px',
          background: 'var(--surface)',
          borderRadius: 14,
          border: '1px solid var(--border)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        }
      }}
    >
      <Badge count={unread} size="small" offset={[-2, 2]}>
        <MotionButton
          type="text"
          icon={<BellOutlined style={{ fontSize: 18 }} />}
          style={{ color: 'var(--foreground)', width: 38, height: 38, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        />
      </Badge>
    </Popover>
  );
};

export default HeaderNotifications;