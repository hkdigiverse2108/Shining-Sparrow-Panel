import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Skeleton, Tag } from 'antd';
import { AppstoreOutlined, ClockCircleOutlined, DollarOutlined, FileTextOutlined } from '@ant-design/icons';
import { ROUTES } from '@/Constants';
import { fadeInUp } from '@/Utils/animations';
import { CommonCard } from '@/Components';
import { CommonButton } from '@/Attribute';
import { Queries } from '@/Api';

const WorkshopSummary: React.FC = () => {
  const navigate = useNavigate();
  const { data: workshopRes, isLoading } = Queries.useGetWorkshops({ page: 1, limit: 1000 });
  const { data: dashRes } = Queries.useGetDashboard();

  const stats = dashRes?.data?.sec1 ?? {};
  const workshopPurchaseCount = stats.workshopPurchaseCount ?? 0;
  const totalWorkshopsCount = stats.totalWorkshops ?? 0;

  const workshops = useMemo(() => {
    const data = workshopRes?.data?.workshop_data || [];
    return Array.isArray(data) ? data : [];
  }, [workshopRes]);

  const activeCount = useMemo(() => workshops.filter((w: any) => !w.isBlocked).length, [workshops]);
  const blockedCount = useMemo(() => workshops.filter((w: any) => w.isBlocked).length, [workshops]);

  return (
    <motion.div variants={fadeInUp} className="col-span-full mt-5">
      <CommonCard
        title="Workshops"
        extra={
          <div className="flex items-center gap-3">
            <Tag color="cyan">{totalWorkshopsCount} Total</Tag>
            <Link to={ROUTES.WORKSHOP.BASE} className="text-sm text-primary hover:underline">Manage</Link>
          </div>
        }
        cardProps={{ className: 'bg-surface!' }}
      >
        {isLoading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : (
          <>
            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              <div className="flex flex-col gap-1 p-3 rounded-xl border border-border">
                <span className="text-xs text-muted font-semibold uppercase tracking-wider">Total</span>
                <span className="text-xl font-extrabold text-primary">{totalWorkshopsCount}</span>
              </div>
              <div className="flex flex-col gap-1 p-3 rounded-xl border border-border">
                <span className="text-xs text-muted font-semibold uppercase tracking-wider">Active</span>
                <span className="text-xl font-extrabold text-success">{activeCount}</span>
              </div>
              <div className="flex flex-col gap-1 p-3 rounded-xl border border-border">
                <span className="text-xs text-muted font-semibold uppercase tracking-wider">Blocked</span>
                <span className="text-xl font-extrabold text-danger">{blockedCount}</span>
              </div>
              <div className="flex flex-col gap-1 p-3 rounded-xl border border-border">
                <span className="text-xs text-muted font-semibold uppercase tracking-wider">Purchases</span>
                <span className="text-xl font-extrabold text-indigo">{workshopPurchaseCount}</span>
              </div>
            </div>

            {/* Workshop list */}
            {workshops.length === 0 ? (
              <div className="text-center py-8 text-muted text-sm">No workshops found.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {workshops.slice(0, 6).map((ws: any) => (
                  <div
                    key={ws._id}
                    className="flex flex-col gap-3 p-4 rounded-xl border border-border hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer group"
                    onClick={() => navigate(ROUTES.WORKSHOP.BASE)}
                  >
                    {ws.image ? (
                      <img
                        src={ws.image}
                        alt={ws.title}
                        className="w-full h-28 rounded-lg object-cover"
                        onError={(e: any) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-full h-28 rounded-lg bg-teal/10 flex items-center justify-center text-teal text-2xl">
                        <AppstoreOutlined />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">
                        {ws.title}
                      </h4>
                      {ws.subTitle && (
                        <p className="text-xs text-muted truncate mt-0.5">{ws.subTitle}</p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {ws.price !== undefined && (
                        <span className="text-xs text-muted flex items-center gap-1 bg-border/50 px-2 py-0.5 rounded-full">
                          <DollarOutlined /> ₹{ws.price}
                        </span>
                      )}
                      {ws.duration && (
                        <span className="text-xs text-muted flex items-center gap-1 bg-border/50 px-2 py-0.5 rounded-full">
                          <ClockCircleOutlined /> {ws.duration}
                        </span>
                      )}
                      {ws.language && (
                        <span className="text-xs text-muted flex items-center gap-1 bg-border/50 px-2 py-0.5 rounded-full">
                          <FileTextOutlined /> {ws.language}
                        </span>
                      )}
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ws.isBlocked ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'}`}>
                        {ws.isBlocked ? 'Blocked' : 'Active'}
                      </span>
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
