import React, { useMemo } from 'react';
import { CalendarOutlined, TeamOutlined } from '@ant-design/icons';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/Constants';
import { CommonCard, CommonTag } from '@/Components';
import { useAppSelector } from '@/Store/hooks';
import { CommonButton } from '@/Attribute';
import { fadeInUp } from '@/Utils/animations';

const FeaturedWorkshop: React.FC = () => {
  const navigate = useNavigate();
  const workshops = useAppSelector(state => state.workshops.data);
  const users = useAppSelector(state => state.users.data);

  const featured = useMemo(() => {
    // Find the workshop marked as featured, or just get the first one
    return workshops.find(w => w.featured) || workshops[0];
  }, [workshops]);

  const speakerUser = useMemo(() => {
    if (!featured) return null;
    return users.find(u => u.id === featured.speakerId);
  }, [featured, users]);

  if (!featured) return null;

  return (
    <motion.div variants={fadeInUp}>
      <CommonCard 
        title="Featured Workshop" 
        extra={<Link to={ROUTES.WORKSHOP.BASE} className="text-sm text-primary hover:underline">View All</Link>}
        cardProps={{ className: "h-full bg-surface!" }}
      >
        <div className="flex flex-col h-full justify-between">
          <div>
            <h4 className="text-lg font-bold text-foreground mb-2">{featured.title}</h4>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {featured.category && <CommonTag>{featured.category}</CommonTag>}
              <CommonTag icon={<CalendarOutlined />} color="processing">{featured.date}</CommonTag>
              <CommonTag icon={<TeamOutlined />} color="success">{featured.registrations?.length || 0} Registered</CommonTag>
            </div>

            {speakerUser && (
              <div className="flex items-center gap-3 mt-4 p-3 bg-surface/50 rounded-lg border border-primary/30">
                <img src={speakerUser.profileImage} alt={speakerUser.username} className="w-8 h-8 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{speakerUser.username}</p>
                  <p className="text-xs text-muted">Speaker</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6">
            <CommonButton 
              block 
              type="primary" 
              onClick={() => navigate(`${ROUTES.WORKSHOP.BASE}/${featured.id}`)}
            >
              View Details
            </CommonButton>
          </div>
        </div>
      </CommonCard>
    </motion.div>
  );
};

export default FeaturedWorkshop;