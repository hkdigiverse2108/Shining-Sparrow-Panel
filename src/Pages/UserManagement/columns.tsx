import { Avatar, Button } from "antd";
import { DeleteOutlined, EditOutlined, LockOutlined, UnlockOutlined, CommentOutlined, UserOutlined } from "@ant-design/icons";
import type { ColumnType, HandlerProps } from "@/Types";
import { CommonTag } from "@/Components/Common/CommonTag";
import { userStatusColors } from "@/Data";
import { Link } from "react-router-dom";
import { ROUTES } from "@/Constants";
import dayjs from "dayjs";

export const getUserColumns = ({ onEdit, onToggleStatus, onDelete, onStartChat, current = 1, pageSize = 10 }: HandlerProps & { current?: number; pageSize?: number }): ColumnType<any>[] => [
  {
    title: "Sr. No.",
    key: "srNo",
    width: 80,
    render: (_: any, __: any, index: number) => (current - 1) * pageSize + index + 1
  },
  {
    title: "User", 
    dataIndex: "fullName",
    render: (_, r) => (
      <div className="user-cell-profile">
        <Avatar src={r.profilePhoto || undefined} size={40} icon={<UserOutlined />} />
        <div className="user-cell-info">
          <Link to={`${ROUTES.USERS.BASE}/${r._id}`} className="user-cell-name hover:!text-primary transition-colors">
            {r.fullName}
          </Link>
          <div className="user-cell-date">Joined {r.createdAt ? dayjs(r.createdAt).format("DD-MM-YYYY") : "N/A"}</div>
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
    title: "Phone Number", 
    dataIndex: "phoneNumber", 
    render: (v) => <span className="user-cell-phoe">{v}</span> 
  },
  {
    title: "OTR", 
    dataIndex: "otr", 
    render: (v) => <span className="user-cell-otr">{v || "N/A"}</span> 
  },
  {
    title: "Status", 
    dataIndex: "isBlocked", 
    render: (v) => <CommonTag className={v ? userStatusColors.blocked : userStatusColors.active}>{v ? "Blocked" : "Active"}</CommonTag> 
  },
  {
    title: "Actions", 
    dataIndex: "actions",
    render: (_, r) => (
      <div className="user-cell-actions">
        <Button 
          type="text" 
          size="small" 
          icon={<CommentOutlined />} 
          onClick={() => onStartChat?.(r)} 
          className="user-action-btn"
          title="Start Chat"
        />
        <Button type="text" size="small" icon={<EditOutlined />} onClick={() => onEdit(r)} className="user-action-btn" />
        <Button 
          type="text" 
          size="small" 
          icon={r.isBlocked ? <UnlockOutlined /> : <LockOutlined />} 
          onClick={() => onToggleStatus(r)} 
          className="user-action-btn" 
        />
        <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={() => onDelete(r)} />
      </div>
    ),
  },
];
