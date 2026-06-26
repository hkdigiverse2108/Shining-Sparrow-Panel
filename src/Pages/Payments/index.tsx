import { useState, useMemo, type FC } from 'react';
import { Avatar, Tag, Segmented, Button, Tooltip, Col, Slider } from 'antd';
import { 
  BookOutlined, 
  CalendarOutlined, 
  UserOutlined, 
  CreditCardOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CommonBreadcrumbs, CommonPageWrapper, AdvancedSearch } from '@/Components';
import CommonTable from '@/Components/Common/CommonTable';
import { blurRevealUp, staggerContainer } from '@/Utils/animations';
import { BREADCRUMBS } from '@/Data';
import { Queries } from '@/Api';
import { ROUTES } from '@/Constants';
import type { ColumnType } from 'antd/es/table';
import dayjs from 'dayjs';

const PaymentsPage: FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'courses' | 'workshops'>('courses');
  
  // Courses pagination & search states
  const [coursePage, setCoursePage] = useState(1);
  const [coursePageSize, setCoursePageSize] = useState(10);
  const [courseSearch, setCourseSearch] = useState("");

  // Workshops pagination & search states
  const [workshopPage, setWorkshopPage] = useState(1);
  const [workshopPageSize, setWorkshopPageSize] = useState(10);
  const [workshopSearch, setWorkshopSearch] = useState("");

  // Advanced Filter states
  const [courseFilter, setCourseFilter] = useState<string | undefined>("all");
  const [workshopFilter, setWorkshopFilter] = useState<string | undefined>("all");
  const [amountRange, setAmountRange] = useState<[number, number]>([0, 100000]);

  // Fetch courses list and workshops list for filters
  const { data: allCoursesRes, isLoading: coursesListLoading } = Queries.useGetCourses({ page: 1, limit: 1000 });
  const { data: allWorkshopsRes, isLoading: workshopsListLoading } = Queries.useGetWorkshops({ page: 1, limit: 1000 });

  const courseOptions = useMemo(() => {
    const list = (allCoursesRes?.data?.course_data || []).map((c: any) => ({
      label: c.name,
      value: c._id,
    }));
    return [{ label: "All", value: "all" }, ...list];
  }, [allCoursesRes]);

  const workshopOptions = useMemo(() => {
    const list = (allWorkshopsRes?.data?.workshop_data || []).map((w: any) => ({
      label: w.title,
      value: w._id,
    }));
    return [{ label: "All", value: "all" }, ...list];
  }, [allWorkshopsRes]);

  // Fetch course purchases
  const { data: coursesRes, isLoading: coursesLoading, isFetching: coursesFetching } = Queries.useGetMyCourses({
    page: coursePage,
    limit: coursePageSize,
    search: courseSearch || undefined,
    courseId: courseFilter === "all" ? undefined : courseFilter,
    minAmount: amountRange[0] === 0 ? undefined : amountRange[0].toString(),
    maxAmount: amountRange[1] === 100000 ? undefined : amountRange[1].toString(),
  });

  // Fetch workshop purchases
  const { data: workshopsRes, isLoading: workshopsLoading, isFetching: workshopsFetching } = Queries.useGetMyWorkshops({
    page: workshopPage,
    limit: workshopPageSize,
    search: workshopSearch || undefined,
    workshopId: workshopFilter === "all" ? undefined : workshopFilter,
    minAmount: amountRange[0] === 0 ? undefined : amountRange[0].toString(),
    maxAmount: amountRange[1] === 100000 ? undefined : amountRange[1].toString(),
  });

  const coursesData = coursesRes?.data?.purchased_course_data || [];
  const coursesTotal = coursesRes?.data?.totalData || 0;

  const workshopsData = workshopsRes?.data?.purchased_workshop_data || [];
  const workshopsTotal = workshopsRes?.data?.totalData || 0;

  // Calculate metrics
  const totalPurchases = coursesTotal + workshopsTotal;

  // Handler for course table changes
  const handleCourseTableChange = (pagination: any) => {
    setCoursePage(pagination.current);
    setCoursePageSize(pagination.pageSize);
  };

  // Handler for workshop table changes
  const handleWorkshopTableChange = (pagination: any) => {
    setWorkshopPage(pagination.current);
    setWorkshopPageSize(pagination.pageSize);
  };

  // Open detail page
  const handleOpenDetails = (record: any, type: 'course' | 'workshop') => {
    navigate(`${ROUTES.PAYMENTS}/${type}/${record._id}`, { state: { record } });
  };

  // Status tag renderer
  const renderStatus = (status: string) => {
    const s = String(status).toLowerCase();
    if (s === 'completed' || s === 'success') {
      return (
        <Tag icon={<CheckCircleOutlined />} color="success" className="rounded-full px-2.5 py-0.5 m-0 capitalize font-medium">
          Completed
        </Tag>
      );
    }
    if (s === 'pending') {
      return (
        <Tag icon={<SyncOutlined spin />} color="warning" className="rounded-full px-2.5 py-0.5 m-0 capitalize font-medium">
          Pending
        </Tag>
      );
    }
    return (
      <Tag icon={<CloseCircleOutlined />} color="error" className="rounded-full px-2.5 py-0.5 m-0 capitalize font-medium">
        Failed
      </Tag>
    );
  };

  // Course Purchases Columns (Minimalized)
  const courseColumns = useMemo((): ColumnType<any>[] => [
    {
      title: '#',
      key: 'srNo',
      dataIndex: 'srNo',
      align: 'center',
      width: 70,
      render: (_: any, __: any, index: number) => (
        <span className="font-mono text-xs font-semibold text-text-muted">
          {(coursePage - 1) * coursePageSize + index + 1}
        </span>
      ),
    },
    {
      title: 'User',
      dataIndex: 'userId',
      align: 'left',
      render: (user: any) => {
        const name = user?.fullName || 'Unknown User';
        const email = user?.email || 'N/A';
        return (
          <div className="user-cell-profile">
            <Avatar 
              size={40} 
              src={user?.profilePhoto || undefined} 
              icon={<UserOutlined />} 
              className="shrink-0 bg-primary-soft text-primary shadow-sm border border-primary/10"
            />
            <div className="user-cell-info">
              <div className="font-semibold text-foreground text-sm truncate max-w-[150px]">{name}</div>
              <div className="text-xs text-text-muted truncate max-w-[150px]">{email}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: 'Course Name',
      dataIndex: 'courseId',
      align: 'left',
      render: (course: any) => (
        <span className="font-semibold text-foreground text-sm truncate block max-w-[250px]">
          {course?.name || 'Deleted Course'}
        </span>
      ),
    },
    {
      title: 'Amount',
      key: 'amount',
      dataIndex: 'amount',
      align: 'center',
      render: (_: any, r: any) => (
        <span className="font-bold text-foreground text-sm">
          ₹{(r.courseId?.price || 0).toLocaleString()}
        </span>
      ),
    },
    {
      title: 'Purchase Date',
      dataIndex: 'purchaseDate',
      align: 'center',
      render: (date: any) => (
        <span className="text-sm font-medium text-foreground">
          {date ? dayjs(date).format('DD-MM-YYYY') : 'N/A'}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'paymentStatus',
      align: 'center',
      render: (status: any) => renderStatus(status),
    },
    {
      title: 'Actions',
      key: 'actions',
      dataIndex: 'actions',
      align: 'center',
      width: 80,
      render: (_: any, r: any) => (
        <Tooltip title="View Details">
          <Button 
            type="text" 
            shape="circle" 
            icon={<EyeOutlined />} 
            onClick={() => handleOpenDetails(r, 'course')} 
            className="hover:!bg-primary/10 hover:!text-primary text-muted transition-all duration-200"
          />
        </Tooltip>
      ),
    },
  ], [coursePage, coursePageSize]);

  // Workshop Payments Columns (Minimalized)
  const workshopColumns = useMemo((): ColumnType<any>[] => [
    {
      title: '#',
      key: 'srNo',
      dataIndex: 'srNo',
      align: 'center',
      width: 70,
      render: (_: any, __: any, index: number) => (
        <span className="font-mono text-xs font-semibold text-text-muted">
          {(workshopPage - 1) * workshopPageSize + index + 1}
        </span>
      ),
    },
    {
      title: 'User',
      dataIndex: 'userId',
      align: 'left',
      render: (user: any) => {
        const name = user?.fullName || 'Unknown User';
        const email = user?.email || 'N/A';
        return (
          <div className="user-cell-profile">
            <Avatar 
              size={40} 
              src={user?.profilePhoto || undefined} 
              icon={<UserOutlined />} 
              className="shrink-0 bg-primary-soft text-primary shadow-sm border border-primary/10"
            />
            <div className="user-cell-info">
              <div className="font-semibold text-foreground text-sm truncate max-w-[150px]">{name}</div>
              <div className="text-xs text-text-muted truncate max-w-[150px]">{email}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: 'Workshop Name',
      dataIndex: 'workshopId',
      align: 'left',
      render: (workshop: any) => (
        <span className="font-semibold text-foreground text-sm truncate block max-w-[250px]">
          {workshop?.title || 'Deleted Workshop'}
        </span>
      ),
    },
    {
      title: 'Amount',
      key: 'amount',
      dataIndex: 'finalAmount',
      align: 'center',
      render: (amount: any, r: any) => {
        const finalVal = amount ?? r.amount ?? 0;
        return (
          <span className="font-bold text-foreground text-sm">
            ₹{finalVal.toLocaleString()}
          </span>
        );
      },
    },
    {
      title: 'Purchase Date',
      dataIndex: 'transactionDate',
      align: 'center',
      render: (date: any, r: any) => {
        const d = date || r.createdAt;
        return (
          <span className="text-sm font-medium text-foreground">
            {d ? dayjs(d).format('DD-MM-YYYY') : 'N/A'}
          </span>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'paymentStatus',
      align: 'center',
      render: (status: any) => renderStatus(status),
    },
    {
      title: 'Actions',
      key: 'actions',
      dataIndex: 'actions',
      align: 'center',
      width: 80,
      render: (_: any, r: any) => (
        <Tooltip title="View Details">
          <Button 
            type="text" 
            shape="circle" 
            icon={<EyeOutlined />} 
            onClick={() => handleOpenDetails(r, 'workshop')} 
            className="hover:!bg-primary/10 hover:!text-primary text-muted transition-all duration-200"
          />
        </Tooltip>
      ),
    },
  ], [workshopPage, workshopPageSize]);

  // Tab selector nested in the toolbar extra area
  const toolbarTabs = (
    <Segmented
      value={activeTab}
      onChange={(v) => {
        const targetTab = v as 'courses' | 'workshops';
        setActiveTab(targetTab);
        if (targetTab === 'courses') {
          setWorkshopFilter(undefined);
        } else {
          setCourseFilter(undefined);
        }
      }}
      options={[
        { label: 'Courses Purchases', value: 'courses', icon: <BookOutlined /> },
        { label: 'Workshops Payments', value: 'workshops', icon: <CalendarOutlined /> }
      ]}
      className="text-xs font-semibold py-0.5 rounded-lg border border-border"
    />
  );

  return (
    <>
      <CommonBreadcrumbs title="Payments Management" breadcrumbs={BREADCRUMBS.PAYMENTS?.BASE || []} />
      <CommonPageWrapper noPadding className="h-full">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col gap-6 p-4 md:p-6">
          
          {/* Summary Metrics */}
          <motion.div variants={blurRevealUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col p-5 rounded-2xl bg-surface border border-border hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-primary bg-primary/10 text-lg">
                  <CreditCardOutlined />
                </div>
              </div>
              <div className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1">Total Enrollments</div>
              <div className="text-3xl font-extrabold text-foreground leading-tight">{totalPurchases}</div>
            </div>

            <div className="flex flex-col p-5 rounded-2xl bg-surface border border-border hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-success bg-success/10 text-lg">
                  <BookOutlined />
                </div>
              </div>
              <div className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1">Course Purchases</div>
              <div className="text-3xl font-extrabold text-foreground leading-tight">{coursesTotal}</div>
            </div>

            <div className="flex flex-col p-5 rounded-2xl bg-surface border border-border hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-warning bg-warning/10 text-lg">
                  <CalendarOutlined />
                </div>
              </div>
              <div className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1">Workshop Payments</div>
              <div className="text-3xl font-extrabold text-foreground leading-tight">{workshopsTotal}</div>
            </div>
          </motion.div>

          {/* Tables Section with nested toolbar extra tabs */}
          <motion.div variants={blurRevealUp} className="flex flex-col gap-5">
            <AdvancedSearch 
              filter={activeTab === 'courses' ? [
                { 
                  label: "Course", 
                  value: courseFilter, 
                  options: courseOptions, 
                  onChange: (val: any) => {
                    setCourseFilter(val);
                    setCoursePage(1);
                  },
                  isLoading: coursesListLoading,
                  grid: { xs: 24, sm: 12, md: 8 }
                }
              ] : [
                { 
                  label: "Workshop", 
                  value: workshopFilter, 
                  options: workshopOptions, 
                  onChange: (val: any) => {
                    setWorkshopFilter(val);
                    setWorkshopPage(1);
                  },
                  isLoading: workshopsListLoading,
                  grid: { xs: 24, sm: 12, md: 8 }
                }
              ]}
            >
              <Col xs={24} sm={12} md={8} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Amount: ₹{amountRange[0]} - ₹{amountRange[1] === 100000 ? "100,000+" : amountRange[1]}
                </span>
                <div className="ant-picker w-full h-[40px] flex items-center px-4 rounded-lg">
                  <Slider
                    range
                    min={0}
                    max={100000}
                    step={500}
                    value={amountRange}
                    onChange={(val) => {
                      setAmountRange(val as [number, number]);
                      setCoursePage(1);
                      setWorkshopPage(1);
                    }}
                    tooltip={{ formatter: (v) => `₹${v}` }}
                    style={{ width: "100%", margin: 0, padding: 0 }}
                  />
                </div>
              </Col>
              {(courseFilter !== "all" || workshopFilter !== "all" || amountRange[0] !== 0 || amountRange[1] !== 100000) && (
                <Col xs={24} sm={24} md={8}>
                  <Button 
                    onClick={() => {
                      setCourseFilter("all");
                      setWorkshopFilter("all");
                      setAmountRange([0, 100000]);
                      setCoursePage(1);
                      setWorkshopPage(1);
                    }}
                    className="h-[40px] px-6 rounded-lg font-semibold hover:border-primary hover:text-primary transition-all duration-200 text-foreground"
                  >
                    Clear Filters
                  </Button>
                </Col>
              )}
            </AdvancedSearch>

            {activeTab === 'courses' ? (
              <CommonTable
                key="courses-table"
                columns={courseColumns}
                data={coursesData}
                loading={coursesLoading || coursesFetching}
                total={coursesTotal}
                current={coursePage}
                pageSize={coursePageSize}
                onTableChange={handleCourseTableChange}
                onSearch={setCourseSearch}
                searchPlaceholder="Search by student name..."
                fileName="Course_Purchases"
                title="Course Purchases"
                toolbarExtra={toolbarTabs}
              />
            ) : (
              <CommonTable
                key="workshops-table"
                columns={workshopColumns}
                data={workshopsData}
                loading={workshopsLoading || workshopsFetching}
                total={workshopsTotal}
                current={workshopPage}
                pageSize={workshopPageSize}
                onTableChange={handleWorkshopTableChange}
                onSearch={setWorkshopSearch}
                searchPlaceholder="Search by subscriber name..."
                fileName="Workshop_Payments"
                title="Workshop Payments"
                toolbarExtra={toolbarTabs}
              />
            )}
          </motion.div>

        </motion.div>
      </CommonPageWrapper>
    </>
  );
};

export default PaymentsPage;
