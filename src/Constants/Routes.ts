export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  ACCESS_DENIED: "/access-denied",
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    VERIFY_OTP: "/auth/verify-otp",
  },
  FORGOT_PASSWORD: {
    BASE: "/auth/forgot-password",
  },
  COURSE: {
    BASE: "/courses",
    DETAIL: "/courses/:id",
  },
  WORKSHOP: {
    BASE: "/workshops",
    DETAIL: "/workshops/:id",
  },
  PROFILE: {
    BASE: "/profile",
    CHANGE_PASSWORD: "/change-password",
  },
  USERS: {
    BASE: "/users",
    DETAIL: "/users/:id",
  },
  ACTIONCENTER: "/actioncenter",
  CONTACT: "/contact",
  ADMIN: "/admin",
  CALENDAR: "/calendar",
  SEARCH: "/search",
  CONTENT: "/content",
} as const;
