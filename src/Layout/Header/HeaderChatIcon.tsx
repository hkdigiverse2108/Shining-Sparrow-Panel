// Components/Dashboard/Header/HeaderChatIcon.tsx
import { Badge, Button } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Queries } from '@/Api/Queries';

const HeaderChatIcon: React.FC = () => {
  const navigate = useNavigate();

  // Use your existing query
  const { data: roomsData } = Queries.useGetRooms();

  // Calculate unread count
  const rooms = roomsData?.data?.room_data || [];
  const unreadCount = rooms.reduce((acc: number, room: any) => acc + (room.unreadCount || 0), 0);

  return (
    <Badge count={unreadCount} size="small" offset={[-2, 2]}>
      <Button
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
          transition: 'background 0.2s ease',
        }}
      />
    </Badge>
  );
};

export default HeaderChatIcon;