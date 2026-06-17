import { useMemo, useState, type FC } from "react";
import { message } from "antd";
import { motion } from "motion/react";
import { CommonBreadcrumbs, CommonPageWrapper, CommonTable, AdvancedSearch } from "@/Components";
import { staggerContainer, blurRevealUp } from "@/Utils/animations";
import { getUserColumns } from "./columns";
import { metricCards, roleOptions, statusOptions, BREADCRUMBS, metricStyles } from "@/Data";
import type { UserRole, UserStatus, UserTable } from "@/Types";
import { UserDrawer } from "./UserDrawer";
import { useAppDispatch, useAppSelector } from "@/Store/hooks";
import { addUser, editUser, deleteUser, toggleUserStatus } from "@/Store/Slices/UserSlice";

const UserManagement: FC = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector(state => state.users.data);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserTable | null>(null);
  
  // 1. Added Pagination State
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const metrics = useMemo(() => ({
    total: users.length, 
    admin: users.filter(u => u.role === "admin").length,
    instructor: users.filter(u => u.role === "instructor").length, 
    student: users.filter(u => u.role === "student").length,
  }), [users]);

  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return users.filter(user => 
      user.role !== "admin" && 
      (!q || user.username.toLowerCase().includes(q) || user.email.toLowerCase().includes(q)) && 
      (roleFilter === "all" || user.role === roleFilter) && 
      (statusFilter === "all" || user.status === statusFilter)
    );
  }, [users, searchQuery, roleFilter, statusFilter]);

  // 2. Handlers that reset pagination back to page 1 when filtering/searching
  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setCurrent(1);
  };

  const handleRoleChange = (v: any) => {
    setRoleFilter(v);
    setCurrent(1);
  };

  const handleStatusChange = (v: any) => {
    setStatusFilter(v);
    setCurrent(1);
  };

  const handleSave = (values: any) => {
    const isEdit = !!editingUser;
    const { password, ...rest } = values;
    if (isEdit) {
      const payload = { ...editingUser, ...rest, createdAt: editingUser?.createdAt };
      if (password) payload.password = password;
      dispatch(editUser(payload));
      message.success("User updated successfully!");
    } else {
      const payload = { ...rest, id: Date.now(), username: rest.username ?? "", phone: rest.phone ?? "", createdAt: new Date().toLocaleDateString("en-GB"), profileImage: rest.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${rest.username}` };
      dispatch(addUser(payload));
      message.success("User created successfully!");
    }
    setDrawerOpen(false);
  };

  const handleToggleStatus = (id: number) => { 
    dispatch(toggleUserStatus(id)); 
    message.info("User status toggled"); 
  };
  
  const handleDelete = (id: number) => { 
    dispatch(deleteUser(id)); 
    message.success("User deleted"); 
  };

  // 3. Table change handler to update pagination
  const handleTableChange = (pagination: any) => {
    setCurrent(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const columns = useMemo(() => getUserColumns({ 
    onEdit: (u) => { setEditingUser(u); setDrawerOpen(true); }, 
    onToggleStatus: handleToggleStatus, 
    onDelete: handleDelete 
  }), [users]);

  return (
    <>
      <CommonBreadcrumbs title="User Management" breadcrumbs={BREADCRUMBS.USERS.BASE || []} />
      <CommonPageWrapper>
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <motion.div variants={blurRevealUp} className="user-metrics-grid">
            {metricCards.map(m => {
              const Icon = m.icon;
              return (
                <div key={m.key} className="user-metric-card group">
                  <div className={`user-metric-icon ${metricStyles[m.key]}`}>
                    <Icon />
                  </div>
                  <div className="user-metric-info">
                    <p className="user-metric-title">{m.title}</p>
                    <p className="user-metric-value">{metrics[m.key as keyof typeof metrics]}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>
          <motion.div variants={blurRevealUp}>
            <AdvancedSearch filter={[
              { label: "Role", value: roleFilter, options: roleOptions.filter(o => o.value !== "all" && o.value !== "admin"), onChange: handleRoleChange },
              { label: "Status", value: statusFilter, options: statusOptions.filter(o => o.value !== "all"), onChange: handleStatusChange }
            ]} />
            <CommonTable 
              columns={columns} 
              data={filteredUsers} 
              loading={false} 
              searchPlaceholder="Search users..." 
              onSearch={handleSearch} 
              onAdd={() => { setEditingUser(null); setDrawerOpen(true); }} 
              fileName="Users" 
              title="User Management"
              // 4. Pass pagination props down
              current={current}
              pageSize={pageSize}
              total={filteredUsers.length}
              onTableChange={handleTableChange}
            />
          </motion.div>       
        </motion.div>
      </CommonPageWrapper>
      <UserDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onSave={handleSave} editingUser={editingUser} />
    </>
  );
};

export default UserManagement;