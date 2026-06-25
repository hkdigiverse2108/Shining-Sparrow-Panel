import { DashboardOutlined, BookOutlined, TeamOutlined, UserOutlined, LogoutOutlined , ReadOutlined, PictureOutlined, CalendarOutlined, InfoCircleOutlined, MessageOutlined, QuestionCircleOutlined, ContactsOutlined, IdcardOutlined, PercentageOutlined, FileProtectOutlined, FileImageOutlined, MailOutlined, StarOutlined, CreditCardOutlined } from '@ant-design/icons';
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
  { icon: <PercentageOutlined />, name: PAGE_TITLE.COUPON_CODE, path: ROUTES.COUPON_CODE },
  { icon: <InfoCircleOutlined />, name: PAGE_TITLE.ABOUT_US, path: ROUTES.ABOUT_US },
  { icon: <ContactsOutlined />, name: PAGE_TITLE.CONTACT, path: ROUTES.CONTACT },
  { icon: <IdcardOutlined />, name: PAGE_TITLE.PROFILE.BASE, path: ROUTES.PROFILE.BASE },
  { icon: <FileProtectOutlined />, name: PAGE_TITLE.LEGALITY, path: ROUTES.LEGALITY },
  { icon: <FileImageOutlined />, name: PAGE_TITLE.GALLERY, path: ROUTES.GALLERY },
  { icon: <MailOutlined />, name: PAGE_TITLE.NEWSLETTER, path: ROUTES.NEWSLETTER },
  { icon: <StarOutlined />, name: PAGE_TITLE.TRUSTED_PARTNER, path: ROUTES.TRUSTED_PARTNER },
  { icon: <CreditCardOutlined />, name: PAGE_TITLE.PAYMENTS, path: ROUTES.PAYMENTS },
  { icon: <MessageOutlined />, name: PAGE_TITLE.CHAT, path: ROUTES.CHAT },
];

export const UserMenuData: UserMenuItems[] = [
  { key: 'profile', icon: <UserOutlined />, label: 'Profile' },
  { type: 'divider' as const },
  { key: 'logout', icon: <LogoutOutlined />, label: 'Logout', danger: true },
];
