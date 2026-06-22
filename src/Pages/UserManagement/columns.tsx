import { Avatar, Button, Popconfirm } from "antd";
import { BookOutlined, CrownOutlined, DeleteOutlined, EditOutlined, LockOutlined, UnlockOutlined, UserOutlined } from "@ant-design/icons";
import type { ColumnType, HandlerProps } from "@/Types";
import { CommonTag } from "@/Components/Common/CommonTag";
import { roleColors, userStatusColors } from "@/Data";
import { Link } from "react-router-dom";
import { ROUTES } from "@/Constants";
import dayjs from "dayjs";

const roleIcons: Record<string, React.ReactNode> = { 
  admin: <CrownOutlined />, 
  instructor: <UserOutlined />, 
  student: <BookOutlined />,
  user: <UserOutlined /> 
};

export const getUserColumns = ({ onEdit, onToggleStatus, onDelete }: HandlerProps): ColumnType<any>[] => [
  {
    title: "User", 
    dataIndex: "fullName",
    render: (_, r) => (
      <div className="user-cell-profile">
        <Avatar src={r.profilePhoto} size={40} />
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
    title: "Role", 
    dataIndex: "role", 
    render: (v) => <CommonTag className={roleColors[v] || roleColors.user} icon={roleIcons[v]}>{v}</CommonTag> 
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
        <Button type="text" size="small" icon={<EditOutlined />} onClick={() => onEdit(r)} className="user-action-btn" />
        <Button 
          type="text" 
          size="small" 
          icon={r.isBlocked ? <UnlockOutlined /> : <LockOutlined />} 
          onClick={() => onToggleStatus(r)} 
          className="user-action-btn" 
        />
        <Popconfirm title="Delete user?" onConfirm={() => onDelete(r._id)}>
          <Button type="text" size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      </div>
    ),
  },
];


// import { Avatar, Button } from "antd";
// import { BookOutlined, CrownOutlined, DeleteOutlined, EditOutlined, LockOutlined, UnlockOutlined, UserOutlined } from "@ant-design/icons";
// import type { ColumnType, HandlerProps } from "@/Types";
// import { CommonTag } from "@/Components/Common/CommonTag";
// import { roleColors, userStatusColors } from "@/Data";
// import { Link } from "react-router-dom";
// import { ROUTES } from "@/Constants";
// import dayjs from "dayjs";

// const roleIcons: Record<string, React.ReactNode> = { 
//   admin: <CrownOutlined />, 
//   instructor: <UserOutlined />, 
//   student: <BookOutlined />,
//   user: <UserOutlined /> 
// };

// export const getUserColumns = ({ onEdit, onToggleStatus, onDelete }: HandlerProps): ColumnType<any>[] => [
//   {
//     title: "User", 
//     dataIndex: "fullName",
//     render: (_, r) => (
//       <div className="user-cell-profile">
//         <Avatar src={r.profilePhoto} size={40} />
//         <div className="user-cell-info">
//           <Link to={`${ROUTES.USERS.BASE}/${r._id}`} className="user-cell-name hover:!text-primary transition-colors">
//             {r.fullName}
//           </Link>
//           <div className="user-cell-date">Joined {r.createdAt ? dayjs(r.createdAt).format("DD-MM-YYYY") : "N/A"}</div>
//         </div>
//       </div>
//     ),
//   },
//   {
//     title: "Email", 
//     dataIndex: "email", 
//     render: (v) => <span className="user-cell-email">{v}</span> 
//   },
//   {
//     title: "Phone Number", 
//     dataIndex: "phoneNumber", 
//     render: (v) => <span className="user-cell-phoe">{v}</span> 
//   },
//   {
//     title: "Role", 
//     dataIndex: "role", 
//     render: (v) => <CommonTag className={roleColors[v] || roleColors.user} icon={roleIcons[v]}>{v}</CommonTag> 
//   },
//   {
//     title: "Status", 
//     dataIndex: "isBlocked", 
//     render: (v) => <CommonTag className={v ? userStatusColors.blocked : userStatusColors.active}>{v ? "Blocked" : "Active"}</CommonTag> 
//   },
//   {
//     title: "Actions", 
//     dataIndex: "actions",
//     render: (_, r) => (
//       <div className="user-cell-actions">
//         <Button type="text" size="small" icon={<EditOutlined />} onClick={() => onEdit(r)} className="user-action-btn" />
//         <Button 
//           type="text" 
//           size="small" 
//           icon={r.isBlocked ? <UnlockOutlined /> : <LockOutlined />} 
//           onClick={() => onToggleStatus(r)} 
//           className="user-action-btn" 
//         />
//         <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={() => onDelete(r)} />
//       </div>
//     ),
//   },
// ];