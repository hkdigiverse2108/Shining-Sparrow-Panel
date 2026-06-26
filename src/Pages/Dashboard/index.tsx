import { type FC } from 'react';
import { CommonPageWrapper, CourseStatusOverview, DashboardBanner, WorkshopSummary, DashboardCoursesTable, DashboardUsersTable, DashboardLoginHistoryTable, RevenueChart, PurchasesChart } from '@/Components';

const LMSDashboard: FC = () => (
  <>
    <CommonPageWrapper noPadding>
      <div className="dashboard-page">
        <DashboardBanner />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          <RevenueChart />
          <PurchasesChart />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          <DashboardCoursesTable />
          <DashboardUsersTable />
        </div>
        <div className="mb-5">
          <CourseStatusOverview />
        </div>
        <div className="mb-5">
          <WorkshopSummary />
        </div>
        <DashboardLoginHistoryTable />
      </div>
    </CommonPageWrapper>
  </>
);

export default LMSDashboard;