import type { BlogApiResponse, CurriculumApiResponse, ExamApiResponse, LessonApiResponse, Params, QuestionApiResponse, UserApiResponse, ChatRoomsApiResponse, ChatMessagesApiResponse, SettingApiResponse } from "@/Types";
import { useQueries } from "./ReactQuery";
import { KEYS, URL_KEYS } from "@/Constants";
import { Get } from "./Methods";
import type { CourseApiResponse } from "@/Types/Course";
import type { WorkshopApiResponse } from "@/Types/Workshop";

export const Queries = {

  // ************ User ***********
  useGetUser: (params?: Params) => useQueries<UserApiResponse>([KEYS.USER.BASE, params], () => Get(URL_KEYS.USER.GET, params)),
  useGetUserById: (id: string, options?: any) => useQueries<any>([KEYS.USER.BASE, "DETAIL", id], () => Get(`${URL_KEYS.USER.BASE}/${id}`), options),

  // ************ Course ***********
  useGetCourses: (params?: Params) => useQueries<CourseApiResponse>([KEYS.COURSE.BASE, params], () => Get(URL_KEYS.COURSE.GET, params)),

  // ************ Curriculums ***********
  useGetCurriculums: (params?: Params) => useQueries<CurriculumApiResponse>([KEYS.CURRICULUM.BASE, params], () => Get(URL_KEYS.CURRICULUM.GET, params)),

  // ************ Lesson ***********
  useGetLessons: (params?: Params) => useQueries<LessonApiResponse>([KEYS.LESSON.BASE, params], () => Get(URL_KEYS.LESSON.GET, params)),
  useGetLessonById: (id: string, options?: any) => useQueries<any>([KEYS.LESSON.BASE, "DETAIL", id], () => Get(`${URL_KEYS.LESSON.BASE}/${id}`), options),

  // ************ Exam ***********
  useGetExams: (params?: Params) => useQueries<ExamApiResponse>([KEYS.EXAM.BASE, params], () => Get(URL_KEYS.EXAM.GET, params)),

  // ************ Question ***********
  useGetQuestions: (params?: Params) => useQueries<QuestionApiResponse>([KEYS.QUESTION.BASE, params], () => Get(URL_KEYS.QUESTION.GET, params)),


  // ************ Workshop ***********
  useGetWorkshops: (params?: Params) => useQueries<WorkshopApiResponse>([KEYS.WORKSHOP.BASE, params], () => Get(URL_KEYS.WORKSHOP.GET, params)),

  useGetWorkshopById: (id: string) => useQueries<any>([KEYS.WORKSHOP.BASE, "DETAIL", id], () => Get(`${URL_KEYS.WORKSHOP.BASE}/${id}`)),

  // ************ Workshop Curriculum ***********
  useGetWorkshopCurriculums: (params?: Params) => useQueries<any>([KEYS.WORKSHOP_CURRICULUM.BASE, params], () => Get(URL_KEYS.WORKSHOP_CURRICULUM.GET, params)),

  // ************ Workshop Testimonial ***********
  useGetTestimonials: (params?: Params) => useQueries<any>([KEYS.TESTIMONIAL.BASE, params], () => Get(URL_KEYS.TESTIMONIAL.GET, params)),

  // ************ Workshop FAQ ***********
  useGetFAQs: (params?: Params) => useQueries<any>([KEYS.FAQ.BASE, params], () => Get(URL_KEYS.FAQ.GET, params)),

  // ************ Workshop FAQ ***********
  useGetBlog: (params?: Params) => useQueries<BlogApiResponse>([KEYS.BLOG.BASE, params], () => Get(URL_KEYS.BLOG.GET, params)),

  // ************ Hero Banner ***********
  useGetHeroBanners: (params?: Params) => useQueries<any>([KEYS.HERO_BANNER.BASE, params], () => Get(URL_KEYS.HERO_BANNER.GET, params)),

  // ************ About Us ***********
  useGetAboutUs: () => useQueries<any>([KEYS.ABOUT_US.BASE], () => Get(URL_KEYS.ABOUT_US.BASE)),

  // ************ Dashboard ***********
  useGetDashboard: () => useQueries<any>([KEYS.DASHBOARD.BASE], () => Get(URL_KEYS.DASHBOARD.GET)),

  // ************ Chat ***********
  useGetRooms: (params?: Params) => useQueries<ChatRoomsApiResponse>([KEYS.CHAT.ROOMS, params], () => Get(URL_KEYS.CHAT.ROOMS, params)),
  useGetMessages: (roomId: string, params?: Params) => useQueries<ChatMessagesApiResponse>([KEYS.CHAT.MESSAGES, roomId, params], () => Get(`${URL_KEYS.CHAT.MESSAGES}/${roomId}`, params), { enabled: !!roomId }),

  // ************ Settings ***********
  useGetSetting: (params?: Params) => useQueries<SettingApiResponse>([KEYS.SETTING.BASE, params], () => Get(URL_KEYS.SETTING.ALL, params)),

  // ************ Contact / Get In Touch ***********
  useGetContactMessages: (params?: Params) => useQueries<any>([KEYS.GET_IN_TOUCH.BASE, params], () => Get(URL_KEYS.GET_IN_TOUCH.GET, params)),

  // ************ Coupon Code ***********
  useGetCouponCodes: (params?: Params) => useQueries<any>([KEYS.COUPON_CODE.BASE, params], () => Get(URL_KEYS.COUPON_CODE.GET, params)),

  // ************ Contact Us details ***********
  useGetContactUs: (options?: any) => useQueries<any>([KEYS.CONTACT_US.BASE], () => Get(URL_KEYS.CONTACT_US.GET), options),

  // ************ Legality ***********
  useGetLegalities: (params?: Params) => useQueries<any>([KEYS.LEGALITY.BASE, params], () => Get(URL_KEYS.LEGALITY.GET, params)),
  useGetLegalityByType: (type: string, options?: any) => useQueries<any>([KEYS.LEGALITY.BASE, "TYPE", type], () => Get(URL_KEYS.LEGALITY.GET, { typeFilter: type }), options),

  // ************ Gallery ***********
  useGetGalleries: (params?: Params) => useQueries<any>([KEYS.GALLERY.BASE, params], () => Get(URL_KEYS.GALLERY.GET, params)),

  // ************ Newsletter ***********
  useGetNewsletters: (params?: Params) => useQueries<any>([KEYS.NEWSLETTER.BASE, params], () => Get(URL_KEYS.NEWSLETTER.GET, params)),

  // ************ Trusted Partner ***********
  useGetTrustedPartners: (params?: Params) => useQueries<any>([KEYS.TRUSTED_PARTNER.BASE, params], () => Get(URL_KEYS.TRUSTED_PARTNER.GET, params)),

  // ************ Payments / Purchases ***********
  useGetMyCourses: (params?: Params, options?: any) => useQueries<any>([KEYS.COURSE.MY_COURSES, params], () => Get(URL_KEYS.COURSE.MY_COURSES, params), options),
  useGetMyWorkshops: (params?: Params, options?: any) => useQueries<any>([KEYS.WORKSHOP.MY_COURSES, params], () => Get(URL_KEYS.WORKSHOP.MY_WORKSHOPS, params), options),
};

