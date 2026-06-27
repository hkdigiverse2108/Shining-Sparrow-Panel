import { Badge, Button } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/Store/hooks';
import { motion } from 'motion/react';

const MotionButton = motion.create(Button);

const HeaderChatIcon: React.FC = () => {
  const navigate = useNavigate();

  // Read unread count from Redux store
  const unreadRooms = useAppSelector((state) => state.layout.unreadRooms);
  const unreadCount = unreadRooms.length;

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