import { type FC } from 'react';
import { motion } from 'motion/react';
import { CommonPageWrapper, CommonBreadcrumbs, WorkshopRegistrationsChart, UpcomingWorkshops, CourseStatusOverview, CurrentActivity, DashboardBanner, RecentUsers, CompletionRateChart, PopularCourses, CategoryPerformanceChart, FeaturedWorkshop, } from '@/Components';
import { staggerContainer } from '@/Utils/animations';

const LMSDashboard: FC = () => (
  <>
    <CommonBreadcrumbs title="Dashboard" />
    <CommonPageWrapper noPadding>
      <motion.div className="dashboard-page" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} >
        <DashboardBanner />
        <div className="dashboard-grid-three">
          <PopularCourses />
          <CurrentActivity />
          <UpcomingWorkshops />
        </div> 
        <div className="dashboard-grid-charts">
          <CategoryPerformanceChart />
          <CompletionRateChart />
          <WorkshopRegistrationsChart />
        </div>
        <div className="dashboard-grid-three">
          <CourseStatusOverview />
          <FeaturedWorkshop />
          <RecentUsers />
        </div>
      </motion.div>
    </CommonPageWrapper>
  </>
);

export default LMSDashboard;