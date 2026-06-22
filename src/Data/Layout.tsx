
import { DashboardOutlined, BookOutlined, TeamOutlined, UserOutlined, LogoutOutlined, KeyOutlined, ReadOutlined, PictureOutlined, CalendarOutlined, InfoCircleOutlined, MessageOutlined  } from '@ant-design/icons';
import type { NavItem, UserMenuItems } from "@/Types";
import { PAGE_TITLE, ROUTES } from "@/Constants";

export const NavItems: NavItem[] = [
  { icon: <DashboardOutlined />, name: PAGE_TITLE.DASHBOARD, path: ROUTES.DASHBOARD },
  { icon: <TeamOutlined />, name: PAGE_TITLE.USERS.BASE, path: ROUTES.USERS.BASE },
  { icon: <BookOutlined />, name: PAGE_TITLE.COURSE.BASE, path: ROUTES.COURSE.BASE },
  { icon: <CalendarOutlined />, name: PAGE_TITLE.WORKSHOP.BASE, path: ROUTES.WORKSHOP.BASE },
  { icon: <ReadOutlined />, name: PAGE_TITLE.BLOG, path: ROUTES.BLOG.BASE },
  { icon: <PictureOutlined />, name: PAGE_TITLE.HERO_BANNER, path: ROUTES.HERO_BANNER.BASE },
  { icon: <InfoCircleOutlined />, name: PAGE_TITLE.ABOUT_US, path: ROUTES.ABOUT_US },
  { icon: <MessageOutlined />, name: PAGE_TITLE.CHAT, path: ROUTES.CHAT },
  // { icon: <CalendarOutlined />, name: PAGE_TITLE.CALENDAR, path: ROUTES.CALENDAR },
  // { icon: <ContactsOutlined />, name: PAGE_TITLE.CONTACT, path: ROUTES.CONTACT },
  // { icon: <DatabaseOutlined />, name: PAGE_TITLE.CONTENT, path: ROUTES.CONTENT},
  // { icon: <QuestionCircleOutlined />, name: PAGE_TITLE.ACTIONCENTER, path: ROUTES.ACTIONCENTER },
  
];

export const UserMenuData: UserMenuItems[] = [
  { key: 'profile', icon: <UserOutlined />, label: 'Profile' },
  { key: 'change-password', icon: <KeyOutlined />, label: 'Change Password ' },
  { type: 'divider' as const },
  { key: 'logout', icon: <LogoutOutlined />, label: 'Logout', danger: true },
];
