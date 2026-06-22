import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Skeleton, Avatar } from 'antd';
import { UserOutlined, MailOutlined } from '@ant-design/icons';
import { ROUTES } from '@/Constants';
import { fadeInUp } from '@/Utils/animations';
import { CommonCard } from '@/Components';
import { Queries } from '@/Api';

const RecentUsers: React.FC = () => {
  const { data: userRes, isLoading } = Queries.useGetUser({ page: 1, limit: 10 });

  const recentUsers = useMemo(() => {
    const data = userRes?.data?.user_data || userRes?.data || [];
    const arr = Array.isArray(data) ? data : [];
    return arr.slice(0, 5);
  }, [userRes]);

  const getRoleColor = (role: string) => {
    const map: Record<string, string> = {
      admin: 'bg-purple/10 text-purple',
      instructor: 'bg-orange/10 text-orange',
      student: 'bg-teal/10 text-teal',
    };
    return map[role?.toLowerCase()] || 'bg-muted/10 text-muted';
  };

  return (
    <motion.div variants={fadeInUp}>
      <CommonCard
        title="Recent Users"
        extra={<Link to={ROUTES.USERS.BASE} className="text-sm text-primary hover:underline">View All</Link>}
        cardProps={{ className: 'h-full bg-surface!' }}
      >
        {isLoading ? (
          <Skeleton active avatar paragraph={{ rows: 3 }} />
        ) : recentUsers.length === 0 ? (
          <div className="text-center py-8 text-muted text-sm">No users found.</div>
        ) : (
          <div className="flex flex-col gap-3">
            {recentUsers.map((user: any) => (
              <div
                key={user._id}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/30 transition-colors cursor-pointer group"
                onClick={() => {}}
              >
                <Avatar
                  src={user.profileImage || user.image}
                  size={36}
                  icon={<UserOutlined />}
                  className="shrink-0 bg-primary/10 text-primary"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                    {user.name || user.username || 'Unknown User'}
                  </p>
                  <p className="text-xs text-muted flex items-center gap-1 truncate">
                    <MailOutlined className="shrink-0" />
                    {user.email}
                  </p>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${getRoleColor(user.role)}`}>
                  {user.role || 'user'}
                </span>
              </div>
            ))}
          </div>
        )}
      </CommonCard>
    </motion.div>
  );
};

export default RecentUsers;