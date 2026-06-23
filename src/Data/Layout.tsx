
import {
  DashboardOutlined, BookOutlined, TeamOutlined, UserOutlined, LogoutOutlined
  
  , ReadOutlined, PictureOutlined, CalendarOutlined, InfoCircleOutlined, MessageOutlined, QuestionCircleOutlined
} from '@ant-design/icons';
import type { NavItem, UserMenuItems } from "@/Types";
import { PAGE_TITLE, ROUTES } from "@/Constants";

export const NavItems: NavItem[] = [
  { icon: <DashboardOutlined />, name: PAGE_TITLE.DASHBOARD, path: ROUTES.DASHBOARD },
  { icon: <TeamOutlined />, name: PAGE_TITLE.USERS.BASE, path: ROUTES.USERS.BASE },
  { icon: <BookOutlined />, name: PAGE_TITLE.COURSE.BASE, path: ROUTES.COURSE.BASE },
  { icon: <CalendarOutlined />, name: PAGE_TITLE.WORKSHOP.BASE, path: ROUTES.WORKSHOP.BASE },
  { icon: <ReadOutlined />, name: PAGE_TITLE.BLOG, path: ROUTES.BLOG.BASE },
  { icon: <PictureOutlined />, name: PAGE_TITLE.HERO_BANNER, path: ROUTES.HERO_BANNER.BASE },
  { icon: <QuestionCircleOutlined />, name: PAGE_TITLE.FAQ, path: ROUTES.FAQ },
  { icon: <InfoCircleOutlined />, name: PAGE_TITLE.ABOUT_US, path: ROUTES.ABOUT_US },
  { icon: <MessageOutlined />, name: PAGE_TITLE.CHAT, path: ROUTES.CHAT },
  
];

export const UserMenuData: UserMenuItems[] = [
  { key: 'profile', icon: <UserOutlined />, label: 'Profile' },
  { type: 'divider' as const },
  { key: 'logout', icon: <LogoutOutlined />, label: 'Logout', danger: true },
];
