import { Avatar, Button, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined, LockOutlined, UnlockOutlined, CommentOutlined, UserOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import type { ColumnType, HandlerProps } from "@/Types";
import { CommonTag } from "@/Components/Common/CommonTag";
import { Link } from "react-router-dom";
import { ROUTES } from "@/Constants";
import dayjs from "dayjs";
import { getImageUrl } from "@/Utils";

export const getUserColumns = ({ onEdit, onToggleStatus, onDelete, onStartChat, current = 1, pageSize = 10 }: HandlerProps & { current?: number; pageSize?: number }): ColumnType<any>[] => [
  {
    title: "#",
    key: "srNo",
    align: "center",
    width: 60,
    render: (_: any, __: any, index: number) => (
      <span className="font-mono text-muted text-xs font-semibold">{(current - 1) * pageSize + index + 1}</span>
    )
  },
  {
    title: "User", 
    dataIndex: "fullName",
    align: "left",
    render: (_, r) => (
      <div className="user-cell-profile">
        <Avatar src={getImageUrl(r.profilePhoto) || undefined} size={40} icon={<UserOutlined />} className="shadow-sm border-2 border-primary/20 shrink-0" />
        <div className="user-cell-info">
          <Link to={`${ROUTES.USERS.BASE}/${r._id}`} className="user-cell-name items-start hover:text-primary! transition-colors text-sm font-semibold">
            {r.fullName}
          </Link>
          <div className="user-cell-date flex items-center gap-1 text-[10px] text-muted mt-0.5">
            Joined {r.createdAt ? dayjs(r.createdAt).format("DD-MM-YYYY") : "N/A"}
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Email", 
    dataIndex: "email", 
    align: "center",
    render: (v) => (
      <div className="flex items-center gap-2 text-sm text-muted">
        <MailOutlined className="text-primary/40 text-xs shrink-0" />
        <span className="user-cell-email truncate max-w-[180px]">{v}</span>
      </div>
    ) 
  },
  {
    title: "Phone", 
    dataIndex: "phoneNumber", 
    align: "center",
    render: (v) => (
      <div className="flex items-center gap-2 text-sm text-muted">
        <PhoneOutlined className="text-primary/40 text-xs shrink-0" />
        <span className="user-cell-phone font-mono text-xs">{v || "N/A"}</span>
      </div>
    ) 
  },
  {
    title: "OTR", 
    dataIndex: "otr", 
    align: "center",
    render: (v) => (
      v ? (
        <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 text-xs font-mono font-semibold tracking-wide">
          {v}
        </span>
      ) : (
        <span className="text-muted/30 font-mono">—</span>
      )
    ) 
  },
  {
    title: "Status", 
    dataIndex: "isBlocked", 
    align: "center",
    render: (v) => (
      <CommonTag className={v ? "status-dot status-dot-blocked" : "status-dot status-dot-active"}>
        {v ? "Blocked" : "Active"}
      </CommonTag>
    ) 
  },
  {
    title: "Actions", 
    dataIndex: "actions",
    align: "center",
    width: 120,
    render: (_, r) => (
      <div className="user-cell-actions flex items-center gap-1">
        <Tooltip title="Start Chat">
          <Button 
            type="text" 
            shape="circle"
            icon={<CommentOutlined />} 
            onClick={() => onStartChat?.(r)} 
            className="hover:!bg-primary/10 hover:!text-primary text-muted transition-all duration-200"
          />
        </Tooltip>
        <Tooltip title="Edit User">
          <Button 
            type="text" 
            shape="circle" 
            icon={<EditOutlined />} 
            onClick={() => onEdit(r)} 
            className="hover:!bg-primary/10 hover:!text-primary text-muted transition-all duration-200" 
          />
        </Tooltip>
        <Tooltip title={r.isBlocked ? "Unlock User" : "Lock User"}>
          <Button 
            type="text" 
            shape="circle" 
            icon={r.isBlocked ? <UnlockOutlined /> : <LockOutlined />} 
            onClick={() => onToggleStatus(r)} 
            className={r.isBlocked ? "hover:!bg-emerald-500/10 hover:!text-emerald-500 text-muted transition-all duration-200" : "hover:!bg-amber-500/10 hover:!text-amber-500 text-muted transition-all duration-200"} 
          />
        </Tooltip>
        <Tooltip title="Delete User">
          <Button 
            type="text" 
            shape="circle" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => onDelete(r)} 
            className="hover:!bg-rose-500/10 transition-all duration-200"
          />
        </Tooltip>
      </div>
    ),
  },
];
