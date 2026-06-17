
import { DashboardOutlined, BookOutlined, TeamOutlined, UserOutlined, LogoutOutlined, QuestionCircleOutlined, ContactsOutlined, KeyOutlined, CalendarOutlined, DatabaseOutlined } from '@ant-design/icons';
import type { NavItem, UserMenuItems } from "@/Types";
import { PAGE_TITLE, ROUTES } from "@/Constants";

export const NavItems: NavItem[] = [
  { icon: <DashboardOutlined />, name: PAGE_TITLE.DASHBOARD, path: ROUTES.DASHBOARD },
  { icon: <TeamOutlined />, name: PAGE_TITLE.USERS.BASE, path: ROUTES.USERS.BASE },
  { icon: <BookOutlined />, name: PAGE_TITLE.COURSE.BASE, path: ROUTES.COURSE.BASE },
  { icon: <TeamOutlined />, name: PAGE_TITLE.WORKSHOP.BASE, path: ROUTES.WORKSHOP.BASE },
  { icon: <CalendarOutlined />, name: PAGE_TITLE.CALENDAR, path: ROUTES.CALENDAR },
  { icon: <ContactsOutlined />, name: PAGE_TITLE.CONTACT, path: ROUTES.CONTACT },
  { icon: <DatabaseOutlined />, name: PAGE_TITLE.CONTENT, path: ROUTES.CONTENT},
  { icon: <QuestionCircleOutlined />, name: PAGE_TITLE.ACTIONCENTER, path: ROUTES.ACTIONCENTER },
  
];

export const UserMenuData: UserMenuItems[] = [
  { key: 'profile', icon: <UserOutlined />, label: 'Profile' },
  { key: 'change-password', icon: <KeyOutlined />, label: 'Change Password ' },
  { type: 'divider' as const },
  { key: 'logout', icon: <LogoutOutlined />, label: 'Logout', danger: true },
];
