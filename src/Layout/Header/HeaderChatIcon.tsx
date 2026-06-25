import { Badge, Button } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Queries } from '@/Api/Queries';
import { motion } from 'motion/react';

const MotionButton = motion(Button);

const HeaderChatIcon: React.FC = () => {
  const navigate = useNavigate();

  // Use your existing query
  const { data: roomsData } = Queries.useGetRooms();

  // Calculate unread count
  const rooms = roomsData?.data?.room_data || [];
  const unreadCount = rooms.reduce((acc: number, room: any) => acc + (room.unreadCount || 0), 0);

  return (
    <Badge count={unreadCount} size="small" offset={[-2, 2]}>
      <MotionButton
        type="text"
        icon={<MessageOutlined style={{ fontSize: 18 }} />}
        onClick={() => navigate('/chat')}
        style={{
          color: 'var(--foreground)',
          width: 38,
          height: 38,
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
      />
    </Badge>
  );
};

export default HeaderChatIcon;