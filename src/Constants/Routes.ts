export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  ACCESS_DENIED: "/access-denied",
  AUTH: {
    LOGIN: "/auth/login",
    VERIFY_OTP: "/auth/otp/verify",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    RESEND_OTP: "/auth/resend-otp",
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
  BLOG: {
    BASE: "/blog",
  },
  HERO_BANNER: {
    BASE: "/hero-banner",
  },
  SETTING: {
    BASE: "/setting",
  },
  ABOUT_US: "/about-us",
  CONTACT: "/contact",
  ADMIN: "/admin",
  SEARCH: "/search",
  CHAT: "/chat",
  FAQ: "/faq",
  COUPON_CODE: "/coupon-code",
  LEGALITY: "/legality",
  GALLERY: "/gallery",
  GALLERY_DETAILS: "/gallery/:id",
  NEWSLETTER: "/newsletter",
  TRUSTED_PARTNER: "/trusted-partner",
  PAYMENTS: "/payments",
  PAYMENT_DETAILS: "/payments/:type/:id",
  FRANCHISE_INQUIRY: "/franchise-inquiry",
  FRANCHISE_INQUIRY_DETAILS: "/franchise-inquiry/:id",
  TESTIMONIAL: "/testimonials",
} as const;
