import { useMemo, useState, type FC } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { CommonBreadcrumbs, CommonPageWrapper, CommonTable, AdvancedSearch, CommonSummaryCards } from "@/Components";
import { staggerContainer, blurRevealUp } from "@/Utils/animations";
import { getUserColumns } from "./columns";
import { statusOptions, BREADCRUMBS } from "@/Data";
import type { UserStatus } from "@/Types";
import { Queries, Mutations } from "@/Api";
import { KEYS, ROUTES } from "@/Constants";
import { useDebounce } from "@/Utils";
import { UserForm } from "./UserForm";

const UserManagement: FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { data: responseData, isLoading } = Queries.useGetUser({
    page: current,
    limit: pageSize,
    search: debouncedSearchQuery 
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

  const handleStatusChange = (v: any) => {
    setStatusFilter(v);
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
  
  const handleDelete = (id: string) => { 
    deleteUserMutation.mutate(
      id,
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [KEYS.USER.BASE] });
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
    onDelete: handleDelete,
    onStartChat: (u: any) => navigate(ROUTES.CHAT, { state: { userId: u._id } })
  }), [navigate]);

  return (
    <>
      <CommonBreadcrumbs title="User Management" breadcrumbs={BREADCRUMBS.USERS.BASE || []} />
      <CommonPageWrapper>
        {drawerOpen ? (
          <div className="course-container course-container--narrow">
            <UserForm open={drawerOpen} onClose={() => setDrawerOpen(false)} onSave={handleSave} editingUser={editingUser} />
          </div>
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <CommonSummaryCards 
              total={totalUsers} 
              active={users.filter((u: any) => !u.isBlocked).length} 
              blocked={users.filter((u: any) => u.isBlocked).length} 
              subject="Users" 
            />
            <motion.div variants={blurRevealUp}>
              <AdvancedSearch filter={[
                { label: "Status", value: statusFilter, options: statusOptions.filter(o => o.value !== "all"), onChange: handleStatusChange }
              ]} />
              <CommonTable columns={columns} data={users} loading={isLoading || addUserMutation.isPending || editUserMutation.isPending} searchPlaceholder="Search users..." onSearch={handleSearch} onAdd={() => { setEditingUser(null); setDrawerOpen(true); }} fileName="Users" title="User Management" current={current} pageSize={pageSize} total={totalUsers} onTableChange={handleTableChange} />
            </motion.div>       
          </motion.div>
        )}
      </CommonPageWrapper>
    </>
  );
};

export default UserManagement;