import { useMemo, type FC } from 'react';
import { motion } from 'motion/react';
import { Avatar } from 'antd';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/Constants';
import { CommonCard, CommonTag } from '@/Components';
import { useAppSelector } from '@/Store/hooks';
import { roleColors } from '@/Data';
import { fadeInUp } from '@/Utils/animations';

const RecentUsers: FC = () => {
  const users = useAppSelector(state => state.users.data);
  const recentUsers = useMemo(() => {
    return [...users]
      .reverse()
      .slice(1, 4);
  }, [users]);

  return (
    <motion.div variants={fadeInUp}>
      <CommonCard 
        title="Recent Users" 
        extra={<Link to={ROUTES.USERS.BASE} className="text-sm text-primary hover:underline">View All</Link>}
        cardProps={{ className: "h-full bg-surface!" }}
      >
        <div className="dashboard-list space-y-3">
          {recentUsers.map(user => (
            <Link 
              key={user.id} 
              to={`${ROUTES.USERS.BASE}/${user.id}`}
              className="flex items-center justify-between rounded-lg hover:bg-muted/50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Avatar src={user.profileImage} size={36} />
                <div>
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {user.username}
                  </p>
                  <p className="text-xs text-muted">{user.email}</p>
                </div>
              </div>
              <CommonTag className={roleColors[user.role] || roleColors.student}>{user.role}</CommonTag>
            </Link>
          ))}
        </div>
      </CommonCard>
    </motion.div>
  );
};

export default RecentUsers;