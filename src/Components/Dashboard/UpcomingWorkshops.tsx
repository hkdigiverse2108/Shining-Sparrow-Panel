import { useMemo, type FC } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/Constants';
import { fadeInUp } from '@/Utils/animations';
import { CommonCard } from '@/Components';
import { useAppSelector } from '@/Store/hooks';
import ProgressBar from './ProgressBar';

const UpcomingWorkshops: FC = () => {
  const navigate = useNavigate();
  const workshops = useAppSelector(state => state.workshops.data);

  const latestWorkshops = useMemo(() => {
    return [...workshops]
      .reverse() 
      .slice(0, 2)
      .map(w => ({
        ...w,
        capacity: w.attendees 
          ? Math.min(Math.round(((w.registrations?.length || 0) / w.attendees) * 100), 100) 
          : 0,
      }));
  }, [workshops]);

  return (
    <motion.div variants={fadeInUp}>
      <CommonCard 
        title="Upcoming Workshops" 
        extra={
          <Link to={ROUTES.WORKSHOP.BASE} className="text-sm text-primary">
            View All
          </Link>
        } 
        cardProps={{ className: "h-full bg-surface!" }} 
      >
        <div className="dashboard-learning-grid">
          {latestWorkshops.map((workshop) => (
            <div 
              key={workshop.id} 
              className="dashboard-learning-card" 
              style={{ cursor: 'pointer' }} 
              onClick={() => navigate(`${ROUTES.WORKSHOP.BASE}/${workshop.id}`)}
            >
              <img 
                src={workshop.image} 
                alt={workshop.title} 
                className="dashboard-learning-image"
                style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px' }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null; 
                  target.src = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80"; 
                }}
              />
              <div className="dashboard-learning-title" title={workshop.title}>{workshop.title}</div>
              <div className="dashboard-learning-meta">
                {workshop.category || 'Workshop'} • {workshop.date}
              </div>
              <ProgressBar percent={workshop.capacity} />
            </div>
          ))}
        </div>
      </CommonCard>
    </motion.div>
  );
};

export default UpcomingWorkshops;