import type { BlogApiResponse, CurriculumApiResponse, ExamApiResponse, LessonApiResponse, Params, QuestionApiResponse, UserApiResponse, ChatRoomsApiResponse, ChatMessagesApiResponse } from "@/Types";
import { useQueries } from "./ReactQuery";
import { KEYS, URL_KEYS } from "@/Constants";
import { Get } from "./Methods";
import type { CourseApiResponse } from "@/Types/Course";
import type { WorkshopApiResponse } from "@/Types/Workshop";

export const Queries = {

  // ************ User ***********
  useGetUser: (params?: Params) => useQueries<UserApiResponse>([KEYS.USER.BASE, params], () => Get(URL_KEYS.USER.GET, params)),

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

  useGetWorkshopById: (id: string) => useQueries<WorkshopApiResponse>([KEYS.WORKSHOP.BASE, "DETAIL", id], () => Get(`${URL_KEYS.WORKSHOP.BASE}/${id}`)),

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
};
