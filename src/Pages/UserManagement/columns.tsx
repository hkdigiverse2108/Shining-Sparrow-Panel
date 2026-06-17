import { Avatar, Button, Popconfirm } from "antd";
import { BookOutlined, CrownOutlined, DeleteOutlined, EditOutlined, LockOutlined, UnlockOutlined, UserOutlined } from "@ant-design/icons";
import type { ColumnType, HandlerProps, UserTable } from "@/Types";
import { CommonTag } from "@/Components/Common/CommonTag";
import { roleColors, userStatusColors } from "@/Data";
import { Link } from "react-router-dom";
import { ROUTES } from "@/Constants";

const roleIcons: Record<string, React.ReactNode> = { 
  admin: <CrownOutlined />, 
  instructor: <UserOutlined />, 
  student: <BookOutlined /> 
};

export const getUserColumns = ({ onEdit, onToggleStatus, onDelete }: HandlerProps): ColumnType<UserTable>[] => [
  {
    title: "User", 
    dataIndex: "name",
    render: (_, r) => (
      <div className="user-cell-profile">
        <Avatar src={r.profileImage} size={40} />
        <div className="user-cell-info">
          <Link to={`${ROUTES.USERS.BASE}/${r.id}`} className="user-cell-name hover:!text-primary transition-colors">
            {r.username}
          </Link>
          <div className="user-cell-date">Joined {r.createdAt}</div>
        </div>
      </div>
    ),
  },
  {
    title: "Email", 
    dataIndex: "email", 
    render: (v) => <span className="user-cell-email">{v}</span> 
  },
  {
    title: "Role", 
    dataIndex: "role", 
    render: (v) => <CommonTag className={roleColors[v] || roleColors.student} icon={roleIcons[v]}>{v}</CommonTag> 
  },
  {
    title: "Status", 
    dataIndex: "status", 
    render: (v) => <CommonTag className={userStatusColors[v] || userStatusColors.inactive}>{v}</CommonTag> 
  },
  {
    title: "Actions", 
    dataIndex: "actions",
    render: (_, r) => (
      <div className="user-cell-actions">
        <Button type="text" size="small" icon={<EditOutlined />} onClick={() => onEdit(r)} className="user-action-btn" />
        <Button 
          type="text" 
          size="small" 
          icon={r.status === "blocked" ? <UnlockOutlined /> : <LockOutlined />} 
          onClick={() => onToggleStatus(r.id)} 
          className="user-action-btn" 
        />
        <Popconfirm title="Delete user?" onConfirm={() => onDelete(r.id)}>
          <Button type="text" size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      </div>
    ),
  },
];