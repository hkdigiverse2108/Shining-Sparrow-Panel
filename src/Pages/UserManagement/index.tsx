import { useMemo, useState, type FC } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { DatePicker, Col, Button } from "antd";
import dayjs from "dayjs";
import { CommonBreadcrumbs, CommonPageWrapper, CommonTable, AdvancedSearch, CommonSummaryCards, CommonDeleteModal } from "@/Components";
import { staggerContainer, blurRevealUp } from "@/Utils/animations";
import { getUserColumns } from "./columns";
import { BREADCRUMBS } from "@/Data";
import { Queries, Mutations, Get } from "@/Api";
import { KEYS, ROUTES, URL_KEYS } from "@/Constants";
import { useDebounce } from "@/Utils";
import { UserForm } from "./UserForm";

const UserManagement: FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Advanced filters state
  const [isBlockedFilter, setIsBlockedFilter] = useState<string | undefined>("all");
  const [courseIdFilter, setCourseIdFilter] = useState<string | undefined>("all");
  const [workshopIdFilter, setWorkshopIdFilter] = useState<string | undefined>("all");
  const [signupDateRange, setSignupDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  // Fetch courses and workshops for associations
  const { data: coursesRes, isLoading: coursesLoading } = Queries.useGetCourses({ page: 1, limit: 1000 });
  const { data: workshopsRes, isLoading: workshopsLoading } = Queries.useGetWorkshops({ page: 1, limit: 1000 });

  const coursesOptions = useMemo(() => {
    const list = (coursesRes?.data?.course_data || []).map((c: any) => ({
      label: c.name,
      value: c._id,
    }));
    return [{ label: "All", value: "all" }, ...list];
  }, [coursesRes]);

  const workshopsOptions = useMemo(() => {
    const list = (workshopsRes?.data?.workshop_data || []).map((w: any) => ({
      label: w.title,
      value: w._id,
    }));
    return [{ label: "All", value: "all" }, ...list];
  }, [workshopsRes]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any | null>(null);

  const { data: responseData, isLoading, isFetching } = Queries.useGetUser({
    page: current,
    limit: pageSize,
    search: debouncedSearchQuery,
    isBlocked: isBlockedFilter === "all" ? undefined : isBlockedFilter,
    courseIds: courseIdFilter === "all" ? undefined : courseIdFilter,
    workshopIds: workshopIdFilter === "all" ? undefined : workshopIdFilter,
    startDate: signupDateRange?.[0] ? signupDateRange[0].startOf('day').toISOString() : undefined,
    endDate: signupDateRange?.[1] ? signupDateRange[1].endOf('day').toISOString() : undefined,
  });
  const users = useMemo(() => responseData?.data?.user_data || [], [responseData]);
  const totalUsers = Number(responseData?.data?.totalData) || 0;

  const addUserMutation = Mutations.useAddUser();
  const editUserMutation = Mutations.useUpdateUser();
  const deleteUserMutation = Mutations.useDeleteUser();

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setCurrent(1);
  };


  const handleSave = (values: any) => {
    if (editingUser) {
      editUserMutation.mutate(
        { ...values, userId: editingUser._id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [KEYS.USER.BASE] });
            setDrawerOpen(false);
          },
        }
      );
    } else {
      addUserMutation.mutate(
        values,
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [KEYS.USER.BASE] });
            setDrawerOpen(false);
          },
        }
      );
    }
  };

  const handleToggleStatus = (user: any) => { 
    editUserMutation.mutate(
      { userId: user._id, isBlocked: !user.isBlocked },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [KEYS.USER.BASE] });
        }
      }
    );
  };
  
  const handleDeleteClick = (user: any) => { 
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };
  
  const handleConfirmDelete = () => { 
    if (!userToDelete) return;
    deleteUserMutation.mutate(
      userToDelete._id,
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [KEYS.USER.BASE] });
          setIsDeleteModalOpen(false);
          setUserToDelete(null);
        }
      }
    );
  };

  const handleTableChange = (pagination: any) => {
    setCurrent(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const columns = useMemo(() => getUserColumns({ 
    onEdit: (u: any) => { setEditingUser(u); setDrawerOpen(true); }, 
    onToggleStatus: handleToggleStatus, 
    onDelete: handleDeleteClick,
    onStartChat: (u: any) => navigate(ROUTES.CHAT, { state: { userId: u._id } }),
    current,
    pageSize
  }), [navigate, current, pageSize]);

  const handleExportAll = async () => {
    const res = await Get<any>(URL_KEYS.USER.GET, {
      page: 1,
      limit: 10000,
      search: debouncedSearchQuery || undefined,
      isBlocked: isBlockedFilter === "all" ? undefined : isBlockedFilter,
      courseIds: courseIdFilter === "all" ? undefined : courseIdFilter,
      workshopIds: workshopIdFilter === "all" ? undefined : workshopIdFilter,
      startDate: signupDateRange?.[0] ? signupDateRange[0].startOf('day').toISOString() : undefined,
      endDate: signupDateRange?.[1] ? signupDateRange[1].endOf('day').toISOString() : undefined,
    });
    return res?.data?.user_data || [];
  };

  return (
    <>
      <CommonBreadcrumbs title="User Management" breadcrumbs={BREADCRUMBS.USERS.BASE || []} />
      <CommonPageWrapper>
        {drawerOpen ? (
          <div className="course-container course-container--narrow">
            <UserForm open={drawerOpen} onClose={() => setDrawerOpen(false)} onSave={handleSave} editingUser={editingUser} />
          </div>
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col gap-5">
            <CommonSummaryCards 
              total={totalUsers} 
              active={users.filter((u: any) => !u.isBlocked).length} 
              blocked={users.filter((u: any) => u.isBlocked).length} 
              subject="Users" 
            />
            <motion.div variants={blurRevealUp}>
              <AdvancedSearch filter={[
                { 
                  label: "Account Status", 
                  value: isBlockedFilter, 
                  options: [
                    { label: "All", value: "all" },
                    { label: "Active", value: "false" },
                    { label: "Blocked", value: "true" }
                  ], 
                  onChange: (val: any) => { setIsBlockedFilter(val); setCurrent(1); },
                  grid: { xs: 24, sm: 12, md: 5 }
                },
                { 
                  label: "Course Enrollment", 
                  value: courseIdFilter, 
                  options: coursesOptions, 
                  onChange: (val: any) => { setCourseIdFilter(val); setCurrent(1); },
                  isLoading: coursesLoading,
                  grid: { xs: 24, sm: 12, md: 5 }
                },
                { 
                  label: "Workshop Enrollment", 
                  value: workshopIdFilter, 
                  options: workshopsOptions, 
                  onChange: (val: any) => { setWorkshopIdFilter(val); setCurrent(1); },
                  isLoading: workshopsLoading,
                  grid: { xs: 24, sm: 12, md: 5 }
                }
              ]}>
                <Col xs={24} sm={12} md={5} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted">Signup Date Range</span>
                  <DatePicker.RangePicker
                    value={signupDateRange}
                    onChange={(dates) => {
                      setSignupDateRange(dates as any);
                      setCurrent(1);
                    }}
                    className="rounded-lg h-[40px]"
                    style={{ width: '100%' }}
                  />
                </Col>
                {(isBlockedFilter !== "all" || courseIdFilter !== "all" || workshopIdFilter !== "all" || signupDateRange !== null) && (
                  <Col xs={24} sm={12} md={4}>
                    <Button 
                      onClick={() => {
                        setIsBlockedFilter("all");
                        setCourseIdFilter("all");
                        setWorkshopIdFilter("all");
                        setSignupDateRange(null);
                        setCurrent(1);
                      }}
                      className="h-[40px] px-6 rounded-lg font-semibold hover:border-primary hover:text-primary transition-all duration-200 text-foreground"
                    >
                      Clear Filters
                    </Button>
                  </Col>
                )}
              </AdvancedSearch>
              <CommonTable columns={columns} data={users} loading={isLoading || isFetching || addUserMutation.isPending || editUserMutation.isPending} searchPlaceholder="Search users by name, email, phone..." onSearch={handleSearch} onAdd={() => { setEditingUser(null); setDrawerOpen(true); }} fileName="Users" title="User Management" current={current} pageSize={pageSize} total={totalUsers} onTableChange={handleTableChange} onExportAll={handleExportAll} />
            </motion.div>       
          </motion.div>
        )}
      </CommonPageWrapper>
      <CommonDeleteModal 
        open={isDeleteModalOpen} 
        title="Delete User" 
        itemName={userToDelete?.fullName} 
        loading={deleteUserMutation.isPending} 
        onClose={() => { setIsDeleteModalOpen(false); setUserToDelete(null); }} 
        onConfirm={handleConfirmDelete} 
      />
    </>
  );
};

export default UserManagement;