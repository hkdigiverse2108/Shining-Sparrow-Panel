import { PAGE_TITLE, ROUTES } from "../Constants";

export const BREADCRUMBS = {
  DASHBOARD: [{label: PAGE_TITLE.DASHBOARD }],
  COURSE: {
    BASE: [{ label: PAGE_TITLE.COURSE.BASE }],
    DETAILS: [{ label: PAGE_TITLE.COURSE.BASE, href: ROUTES.COURSE.BASE }, { label: PAGE_TITLE.COURSE.DETAILS}]
  },
  WORKSHOP: {
    BASE: [{ label: PAGE_TITLE.WORKSHOP.BASE }],
    DETAILS: [{ label: PAGE_TITLE.WORKSHOP.BASE, href: ROUTES.WORKSHOP.BASE }, { label: PAGE_TITLE.WORKSHOP.DETAILS }],
  },
  PROFILE: {
    BASE: [{ label: PAGE_TITLE.PROFILE.BASE }],
    CHANGE_PASSWORD: [{ label: PAGE_TITLE.PROFILE.CHANGE_PASSWORD }]
  },
  CONTACT: [{label: PAGE_TITLE.CONTACT }],
  USERS: {
    BASE: [{ label: PAGE_TITLE.USERS.BASE }],
    DETAILS: [{ label: PAGE_TITLE.USERS.BASE, href: ROUTES.USERS.BASE }, { label: PAGE_TITLE.USERS.DETAILS }]
  },
  BLOG: {
    BASE: [{ label: PAGE_TITLE.BLOG }],
  },
  HERO_BANNER: {
    BASE: [{ label: PAGE_TITLE.HERO_BANNER }],
  },
  ABOUT_US: {
    BASE: [{ label: PAGE_TITLE.ABOUT_US }],
  },
  CHAT: [{ label: PAGE_TITLE.CHAT }],
  FAQ: { BASE: [{ label: PAGE_TITLE.FAQ }] },
  COUPON_CODE: { BASE: [{ label: PAGE_TITLE.COUPON_CODE }] },
}
