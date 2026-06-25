import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Skeleton } from 'antd';
import { AppstoreOutlined } from '@ant-design/icons';
import { ROUTES } from '@/Constants';
import { fadeInUp } from '@/Utils/animations';
import { CommonCard } from '@/Components';
import { CommonButton } from '@/Attribute';
import { Queries } from '@/Api';

const WorkshopSummary: React.FC = () => {
  const navigate = useNavigate();
  const { data: workshopRes, isLoading } = Queries.useGetWorkshops({ page: 1, limit: 1000 });

  const workshops = useMemo(() => {
    const data = workshopRes?.data?.workshop_data || [];
    return Array.isArray(data) ? data : [];
  }, [workshopRes]);

  const totalWorkshopsCount = workshops.length;

  return (
    <motion.div variants={fadeInUp}>
      <CommonCard
        title="Workshops"
        extra={
          <div className="flex items-center gap-3">
            <span className="text-sm text-text-muted">{totalWorkshopsCount} Total</span>
            <Link to={ROUTES.WORKSHOP.BASE} className="text-sm text-primary hover:text-primary-dark font-medium">View All</Link>
          </div>
        }
      >
        {isLoading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : (
          <>

            {workshops.length === 0 ? (
              <div className="text-center py-8 text-muted text-sm">No workshops found.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {workshops.slice(0, 6).map((ws: any) => (
                  <div
                    key={ws._id}
                    className="rounded-lg border border-border bg-surface overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                    onClick={() => navigate(ROUTES.WORKSHOP.BASE)}
                  >
                    {ws.image ? (
                      <img
                        src={ws.image}
                        alt={ws.title}
                        className="w-full h-32 object-cover"
                        onError={(e: any) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-full h-32 bg-surface-muted flex items-center justify-center text-muted text-3xl">
                        <AppstoreOutlined />
                      </div>
                    )}
                    <div className="p-3">
                      <h4 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {ws.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-2">
                        {ws.price !== undefined && (
                          <span className="text-xs text-text-muted font-medium">₹{ws.price}</span>
                        )}
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ws.isBlocked ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'}`}>
                          {ws.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {workshops.length > 0 && (
              <div className="mt-4">
                <CommonButton
                  block
                  type="primary"
                  onClick={() => navigate(ROUTES.WORKSHOP.BASE)}
                >
                  View All Workshops
                </CommonButton>
              </div>
            )}
          </>
        )}
      </CommonCard>
    </motion.div>
  );
};

export default WorkshopSummary;
