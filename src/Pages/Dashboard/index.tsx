import { type FC } from 'react';
import { motion } from 'motion/react';
import { CommonPageWrapper, CourseStatusOverview, DashboardBanner, WorkshopSummary, DashboardCoursesTable, DashboardUsersTable } from '@/Components';
import { staggerContainer } from '@/Utils/animations';

const LMSDashboard: FC = () => (
  <>
    <CommonPageWrapper noPadding>
      <motion.div className="dashboard-page" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} >
        <DashboardBanner />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          <DashboardCoursesTable />
          <DashboardUsersTable />
        </div>
        <div className="mb-5">
          <CourseStatusOverview />
        </div>
        <WorkshopSummary />
      </motion.div>
    </CommonPageWrapper>
  </>
);

export default LMSDashboard;