import { DashboardOutlined, BookOutlined, TeamOutlined, UserOutlined, LogoutOutlined , ReadOutlined, PictureOutlined, CalendarOutlined, InfoCircleOutlined, MessageOutlined, QuestionCircleOutlined, ContactsOutlined, IdcardOutlined, PercentageOutlined, FileProtectOutlined, FileImageOutlined, MailOutlined, StarOutlined, CreditCardOutlined, ShopOutlined } from '@ant-design/icons';
import type { NavItem, UserMenuItems } from "@/Types";
import { PAGE_TITLE, ROUTES } from "@/Constants";

export const NavItems: NavItem[] = [
  // 1. Core Operations
  { icon: <DashboardOutlined />, name: PAGE_TITLE.DASHBOARD, path: ROUTES.DASHBOARD },
  { icon: <TeamOutlined />, name: PAGE_TITLE.USERS.BASE, path: ROUTES.USERS.BASE },
  { icon: <BookOutlined />, name: PAGE_TITLE.COURSE.BASE, path: ROUTES.COURSE.BASE },
  { icon: <CalendarOutlined />, name: PAGE_TITLE.WORKSHOP.BASE, path: ROUTES.WORKSHOP.BASE },
  { icon: <CreditCardOutlined />, name: PAGE_TITLE.PAYMENTS, path: ROUTES.PAYMENTS },
  { icon: <PercentageOutlined />, name: PAGE_TITLE.COUPON_CODE, path: ROUTES.COUPON_CODE },

  // 2. Inquiries & Leads
  { icon: <ShopOutlined />, name: PAGE_TITLE.FRANCHISE_INQUIRY, path: ROUTES.FRANCHISE_INQUIRY },
  { icon: <ContactsOutlined />, name: PAGE_TITLE.CONTACT, path: ROUTES.CONTACT },
  { icon: <MailOutlined />, name: PAGE_TITLE.NEWSLETTER, path: ROUTES.NEWSLETTER },

  // 3. Website Content Management
  { icon: <PictureOutlined />, name: PAGE_TITLE.HERO_BANNER, path: ROUTES.HERO_BANNER.BASE },
  { icon: <InfoCircleOutlined />, name: PAGE_TITLE.ABOUT_US, path: ROUTES.ABOUT_US },
  { icon: <ReadOutlined />, name: PAGE_TITLE.BLOG, path: ROUTES.BLOG.BASE },
  { icon: <FileImageOutlined />, name: PAGE_TITLE.GALLERY, path: ROUTES.GALLERY },
  { icon: <StarOutlined />, name: PAGE_TITLE.TESTIMONIAL, path: ROUTES.TESTIMONIAL },
  { icon: <PictureOutlined />, name: PAGE_TITLE.TRUSTED_PARTNER, path: ROUTES.TRUSTED_PARTNER },
  { icon: <QuestionCircleOutlined />, name: PAGE_TITLE.FAQ, path: ROUTES.FAQ },
  { icon: <FileProtectOutlined />, name: PAGE_TITLE.LEGALITY, path: ROUTES.LEGALITY },

  // 4. Account & Support (Pinned to bottom)
  { icon: <MessageOutlined />, name: PAGE_TITLE.CHAT, path: ROUTES.CHAT },
  { icon: <IdcardOutlined />, name: PAGE_TITLE.PROFILE.BASE, path: ROUTES.PROFILE.BASE },
];

export const UserMenuData: UserMenuItems[] = [
  { key: 'profile', icon: <UserOutlined />, label: 'Profile' },
  { type: 'divider' as const },
  { key: 'logout', icon: <LogoutOutlined />, label: 'Logout', danger: true },
];
