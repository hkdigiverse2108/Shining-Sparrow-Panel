import React from "react";
import { Avatar, Dropdown, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { UserOutlined, LogoutOutlined, SettingOutlined, } from "@ant-design/icons";
import { ROUTES } from "@/Constants";

const HeaderActions: React.FC = () => {
  const navigate = useNavigate();
  const handleMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case "profile":
        navigate(ROUTES.PROFILE.BASE);
        break;
      case "change-password":
        navigate(ROUTES.PROFILE.CHANGE_PASSWORD );
        break;
      case "logout":
        localStorage.removeItem("token");
        navigate(ROUTES.AUTH.LOGIN);
        break;
      default:
        break;
    }
  };
  const userMenuItems = [
    { key: "profile", icon: <UserOutlined />, label: "Profile", },
    { key: "change-password", icon: <SettingOutlined />, label: "Chnage Password", },
    { type: "divider" as const, },
    { key: "logout", icon: <LogoutOutlined />, label: "Logout", danger: true, },
  ];
  return (
    <Dropdown menu={{ items: userMenuItems, onClick: handleMenuClick }} trigger={["click"]}>
      <Space style={{ cursor: "pointer", color: "var(--foreground)" }}>
        <Avatar
          icon={<UserOutlined />}
          style={{ backgroundColor: "var(--primary)" }}
        />
      </Space>
    </Dropdown>
  );
};

export default HeaderActions;