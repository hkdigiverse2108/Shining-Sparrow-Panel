import type { ForgotPasswordPayload, LoginPayload, LoginResponse, ResendOtpPayload, ResetPasswordPayload, UpdatePasswordPayload, VerifyOtpPayload, UpdateProfilePayload } from "@/Types/Auth";
import { useMutations } from "./ReactQuery";
import { KEYS, URL_KEYS } from "@/Constants";
import { Delete, Post } from "./Methods";
import type { AddUserPayload, MessageStatus, UpdateUserPayload, AddCoursePayload, UpdateCoursePayload, AddCurriculumPayload, UpdateCurriculumPayload, AddExamPayload, UpdateExamPayload, AddQuestionPayload, UpdateQuestionPayload, AddLessonPayload, UpdateLessonPayload, AddBlogPayload, UpdateBlogPayload, SendMessagePayload, CreateRoomPayload, AddSettingPayload, UpdateSettingPayload } from "@/Types";
import type { AddWorkshopPayload, UpdateWorkshopPayload } from "@/Types/Workshop";

export const Mutations = {
  // ************ Auth ***********
  useSignin: () => useMutations<LoginPayload, LoginResponse>([KEYS.AUTH.LOGIN], (input) => Post(URL_KEYS.AUTH.LOGIN, input, false)),

  useForgotPassword: () => useMutations<ForgotPasswordPayload, MessageStatus>([KEYS.AUTH.FORGOT_PASSWORD], (input) => Post(URL_KEYS.AUTH.FORGOT_PASSWORD, input, false)),

  useVerifyOtp: () => useMutations<VerifyOtpPayload, LoginResponse>([KEYS.AUTH.VERIFY_OTP], (input) => Post(URL_KEYS.AUTH.VERIFY_OTP, input, false)),

  useUpdatePassword: () => useMutations<UpdatePasswordPayload, MessageStatus>([KEYS.AUTH.RESET_PASSWORD], (input) => Post(URL_KEYS.AUTH.CHANGE_PASSWORD, input)),

  useResetPassword: () => useMutations<ResetPasswordPayload, MessageStatus>([KEYS.AUTH.RESET_PASSWORD], (input) => Post(URL_KEYS.AUTH.RESET_PASSWORD, input)),

  useResendOtp: () => useMutations<ResendOtpPayload, MessageStatus>([KEYS.AUTH.RESEND_OTP], (input) => Post(URL_KEYS.AUTH.RESEND_OTP, input, false)),

  useUpdateProfile: () => useMutations<UpdateProfilePayload, any>( [KEYS.AUTH.UPDATE_PROFILE], (input) => Post(URL_KEYS.AUTH.UPDATE_PROFILE, input) ),

  // ************ User ***********
  useAddUser: () => useMutations<AddUserPayload, MessageStatus>([KEYS.USER.BASE, "ADD"], (input) => Post(URL_KEYS.USER.ADD, input)),
  
  useUpdateUser: () => useMutations<UpdateUserPayload, MessageStatus>( [KEYS.USER.BASE, "UPDATE"], (input) => Post(URL_KEYS.USER.UPDATE, input) ),

  useDeleteUser: () => useMutations<string, void>([KEYS.USER.DELETE, KEYS.USER.BASE], (id) => Delete(`${URL_KEYS.USER.DELETE}/${id}`)),

  // ************ Course  ***********
  useAddCourse: () => useMutations<AddCoursePayload, MessageStatus>([KEYS.COURSE.BASE, "ADD"], (input) => Post(URL_KEYS.COURSE.ADD, input)),

  useUpdateCourse: () => useMutations<UpdateCoursePayload, MessageStatus>([KEYS.COURSE.BASE, "UPDATE"], (input) => Post(URL_KEYS.COURSE.EDIT, input)),

  useDeleteCourse: () => useMutations<string, void>([KEYS.COURSE.DELETE, KEYS.COURSE.BASE], (id) => Delete(`${URL_KEYS.COURSE.DELETE}/${id}`)),

  // ************ Curriculum  ***********
  useAddCurriculum: () => useMutations<AddCurriculumPayload, MessageStatus>([KEYS.CURRICULUM.BASE, "ADD"], (input) => Post(URL_KEYS.CURRICULUM.ADD, input)),

  useUpdateCurriculum: () => useMutations<UpdateCurriculumPayload, MessageStatus>([KEYS.CURRICULUM.BASE, "UPDATE"], (input) => Post(URL_KEYS.CURRICULUM.EDIT, input)),

  useDeleteCurriculum: () => useMutations<string, void>([KEYS.CURRICULUM.DELETE, KEYS.CURRICULUM.BASE], (id) => Delete(`${URL_KEYS.CURRICULUM.DELETE}/${id}`)),


  // ************ Lesson ***********
  useAddLesson: () => useMutations<AddLessonPayload, MessageStatus>([KEYS.LESSON.BASE, "ADD"], (input) => Post(URL_KEYS.LESSON.ADD, input)),

  useUpdateLesson: () => useMutations<UpdateLessonPayload, MessageStatus>([KEYS.LESSON.BASE, "UPDATE"], (input) => Post(URL_KEYS.LESSON.EDIT, input)),

  useDeleteLesson: () => useMutations<string, void>([KEYS.LESSON.DELETE, KEYS.LESSON.BASE], (id) => Delete(`${URL_KEYS.LESSON.DELETE}/${id}`)),

  // ************ Exam ***********
  useAddExam: () => useMutations<AddExamPayload, MessageStatus>([KEYS.EXAM.BASE, "ADD"], (input) => Post(URL_KEYS.EXAM.ADD, input)),

  useUpdateExam: () => useMutations<UpdateExamPayload, MessageStatus>([KEYS.EXAM.BASE, "UPDATE"], (input) => Post(URL_KEYS.EXAM.EDIT, input)),

  useDeleteExam: () => useMutations<string, void>([KEYS.EXAM.DELETE, KEYS.EXAM.BASE], (id) => Delete(`${URL_KEYS.EXAM.DELETE}/${id}`)),

  // ************ Question ***********
  useAddQuestion: () => useMutations<AddQuestionPayload, MessageStatus>([KEYS.QUESTION.BASE, "ADD"], (input) => Post(URL_KEYS.QUESTION.ADD, input)),

  useUpdateQuestion: () => useMutations<UpdateQuestionPayload, MessageStatus>([KEYS.QUESTION.BASE, "UPDATE"], (input) => Post(URL_KEYS.QUESTION.EDIT, input)),

  useDeleteQuestion: () => useMutations<string, void>([KEYS.QUESTION.DELETE, KEYS.QUESTION.BASE], (id) => Delete(`${URL_KEYS.QUESTION.BASE}/${id}`)),


  // ************ Workshop ***********
  useAddWorkshop: () => useMutations<AddWorkshopPayload, MessageStatus>([KEYS.WORKSHOP.BASE, "ADD"], (input) => Post(URL_KEYS.WORKSHOP.ADD, input)),

  useUpdateWorkshop: () => useMutations<UpdateWorkshopPayload, MessageStatus>([KEYS.WORKSHOP.BASE, "UPDATE"], (input) => Post(URL_KEYS.WORKSHOP.EDIT, input)),

  useDeleteWorkshop: () => useMutations<string, void>([KEYS.WORKSHOP.DELETE, KEYS.WORKSHOP.BASE], (id) => Delete(`${URL_KEYS.WORKSHOP.DELETE}/${id}`)),

  // Add to your Mutations object
  useAddWorkshopCurriculum: () => useMutations<any, MessageStatus>([KEYS.WORKSHOP_CURRICULUM.BASE, "ADD"], (input) => Post(URL_KEYS.WORKSHOP_CURRICULUM.ADD, input)),
  useUpdateWorkshopCurriculum: () => useMutations<any, MessageStatus>([KEYS.WORKSHOP_CURRICULUM.BASE, "UPDATE"], (input) => Post(URL_KEYS.WORKSHOP_CURRICULUM.EDIT, input)),
  useDeleteWorkshopCurriculum: () => useMutations<string, void>([KEYS.WORKSHOP_CURRICULUM.DELETE, KEYS.WORKSHOP_CURRICULUM.BASE], (id) => Delete(`${URL_KEYS.WORKSHOP_CURRICULUM.DELETE}/${id}`)),

  // ************ Testimonial ***********
  useAddTestimonial: () => useMutations<any, MessageStatus>([KEYS.TESTIMONIAL.BASE, "ADD"], (input) => Post(URL_KEYS.TESTIMONIAL.ADD, input)),
  useUpdateTestimonial: () => useMutations<any, MessageStatus>([KEYS.TESTIMONIAL.BASE, "UPDATE"], (input) => Post(URL_KEYS.TESTIMONIAL.EDIT, input)),
  useDeleteTestimonial: () => useMutations<string, void>([KEYS.TESTIMONIAL.DELETE, KEYS.TESTIMONIAL.BASE], (id) => Delete(`${URL_KEYS.TESTIMONIAL.DELETE}/${id}`)),

  // ************ FAQ ***********
  useAddFAQ: () => useMutations<any, MessageStatus>([KEYS.FAQ.ADD, KEYS.FAQ.BASE], (input) => Post(URL_KEYS.FAQ.ADD, input)),
  useUpdateFAQ: () => useMutations<any, MessageStatus>([KEYS.FAQ.EDIT, KEYS.FAQ.BASE], (input) => Post(URL_KEYS.FAQ.EDIT, input)),
  useDeleteFAQ: () => useMutations<string, void>([KEYS.FAQ.DELETE, KEYS.FAQ.BASE], (id) => Delete(`${URL_KEYS.FAQ.DELETE}/${id}`)),

  // ************ Blog ***********
  useAddBlog: () => useMutations<AddBlogPayload, MessageStatus>([KEYS.BLOG.BASE, KEYS.BLOG.BASE], (input) => Post(URL_KEYS.BLOG.ADD, input)),
  useUpdateBlog: () => useMutations<UpdateBlogPayload, MessageStatus>([KEYS.BLOG.BASE, KEYS.BLOG.BASE], (input) => Post(URL_KEYS.BLOG.EDIT, input)),
  useDeleteBlog: () => useMutations<string, void>([KEYS.BLOG.DELETE, KEYS.BLOG.BASE], (id) => Delete(`${URL_KEYS.BLOG.DELETE}/${id}`)),

  // ************ Hero Banner ***********
  useAddHeroBanner: () => useMutations<any, MessageStatus>([KEYS.HERO_BANNER.BASE, "ADD"], (input) => Post(URL_KEYS.HERO_BANNER.ADD, input)),
  useUpdateHeroBanner: () => useMutations<any, MessageStatus>([KEYS.HERO_BANNER.BASE, "UPDATE"], (input) => Post(URL_KEYS.HERO_BANNER.EDIT, input)),
  useDeleteHeroBanner: () => useMutations<string, void>([KEYS.HERO_BANNER.DELETE, KEYS.HERO_BANNER.BASE], (id) => Delete(`${URL_KEYS.HERO_BANNER.DELETE}/${id}`)),

  // ************ About Us ***********
  useUpdateAboutUs: () => useMutations<any, MessageStatus>([KEYS.ABOUT_US.BASE], (input) => Post(URL_KEYS.ABOUT_US.EDIT, input)),

  // ************ Chat ***********
  useSendMessage: () => useMutations<SendMessagePayload, any>([KEYS.CHAT.BASE, "SEND"], (input) => Post(URL_KEYS.CHAT.SEND, input)),
  useCreateRoom: () => useMutations<CreateRoomPayload, any>([KEYS.CHAT.BASE, "CREATE_ROOM"], (input) => Post(URL_KEYS.CHAT.CREATE_ROOM, input, true, false)),

  // ************ Setting ************

  useAddSetting: () => useMutations<AddSettingPayload, MessageStatus>([KEYS.SETTING.ADD_EDIT, KEYS.SETTING.BASE ], (input) => Post(URL_KEYS.SETTING.ADD_EDIT, input)),

  useUpdateSetting: () => useMutations<UpdateSettingPayload, MessageStatus>([KEYS.SETTING.ADD_EDIT, KEYS.SETTING.BASE], (input) => Post(URL_KEYS.SETTING.ADD_EDIT, input)),

  // ************ Contact / Get In Touch ***********
  useDeleteContactMessage: () => useMutations<string, void>([KEYS.GET_IN_TOUCH.DELETE, KEYS.GET_IN_TOUCH.BASE], (id) => Delete(`${URL_KEYS.GET_IN_TOUCH.DELETE}/${id}`)),

  useMarkContactRead: () => useMutations<any, any>([KEYS.GET_IN_TOUCH.BASE, "mark-read"], (input) => Post(URL_KEYS.GET_IN_TOUCH.EDIT, input)),

  // ************ Coupon Code ***********
  useAddCouponCode: () => useMutations<any, MessageStatus>([KEYS.COUPON_CODE.BASE, "ADD"], (input) => Post(URL_KEYS.COUPON_CODE.ADD, input)),
  useUpdateCouponCode: () => useMutations<any, MessageStatus>([KEYS.COUPON_CODE.BASE, "UPDATE"], (input) => Post(URL_KEYS.COUPON_CODE.EDIT, input)),
  useDeleteCouponCode: () => useMutations<string, void>([KEYS.COUPON_CODE.DELETE, KEYS.COUPON_CODE.BASE], (id) => Delete(`${URL_KEYS.COUPON_CODE.DELETE}/${id}`)),

  // ************ Contact Us details ***********
  useUpdateContactUs: () => useMutations<any, MessageStatus>([KEYS.CONTACT_US.BASE], (input) => Post(URL_KEYS.CONTACT_US.ADD_EDIT, input)),

  // ************ Legality ***********
  useAddLegality: () => useMutations<any, MessageStatus>([KEYS.LEGALITY.BASE, "ADD"], (input) => Post(URL_KEYS.LEGALITY.ADD, input)),
  useUpdateLegality: () => useMutations<any, MessageStatus>([KEYS.LEGALITY.BASE, "UPDATE"], (input) => Post(URL_KEYS.LEGALITY.EDIT, input)),

  // ************ Gallery ***********
  useAddGallery: () => useMutations<any, MessageStatus>([KEYS.GALLERY.BASE, "ADD"], (input) => Post(URL_KEYS.GALLERY.ADD, input)),
  useUpdateGallery: () => useMutations<any, MessageStatus>([KEYS.GALLERY.BASE, "UPDATE"], (input) => Post(URL_KEYS.GALLERY.EDIT, input)),
  useDeleteGallery: () => useMutations<string, void>([KEYS.GALLERY.DELETE, KEYS.GALLERY.BASE], (id) => Delete(`${URL_KEYS.GALLERY.DELETE}/${id}`)),

  // ************ Newsletter ***********
  useAddNewsletter: () => useMutations<any, MessageStatus>([KEYS.NEWSLETTER.BASE, "ADD"], (input) => Post(URL_KEYS.NEWSLETTER.ADD, input)),
  useDeleteNewsletter: () => useMutations<string, void>([KEYS.NEWSLETTER.DELETE, KEYS.NEWSLETTER.BASE], (id) => Delete(`${URL_KEYS.NEWSLETTER.DELETE}/${id}`)),
  useSendNewsletter: () => useMutations<any, MessageStatus>([KEYS.NEWSLETTER.BASE, "SEND"], (input) => Post(URL_KEYS.NEWSLETTER.SEND, input)),

  // ************ Trusted Partner ***********
  useAddTrustedPartner: () => useMutations<any, MessageStatus>([KEYS.TRUSTED_PARTNER.BASE, "ADD"], (input) => Post(URL_KEYS.TRUSTED_PARTNER.ADD, input)),
  useUpdateTrustedPartner: () => useMutations<any, MessageStatus>([KEYS.TRUSTED_PARTNER.BASE, "UPDATE"], (input) => Post(URL_KEYS.TRUSTED_PARTNER.EDIT, input)),
  useDeleteTrustedPartner: () => useMutations<string, void>([KEYS.TRUSTED_PARTNER.DELETE, KEYS.TRUSTED_PARTNER.BASE], (id) => Delete(`${URL_KEYS.TRUSTED_PARTNER.DELETE}/${id}`)),

  // ************ Notifications ***********
  useMarkNotificationRead: () => useMutations<{ id: string }, any>([KEYS.NOTIFICATION.READ, KEYS.NOTIFICATION.BASE], (payload) => Post(URL_KEYS.NOTIFICATION.READ, payload, true, false)),
  useDeleteNotification: () => useMutations<{ id: string }, any>([KEYS.NOTIFICATION.DELETE, KEYS.NOTIFICATION.BASE], (payload) => Post(URL_KEYS.NOTIFICATION.DELETE, payload, true, false)),

  // ************ Franchise Inquiry ***********
  useDeleteFranchiseInquiry: () => useMutations<string, void>([KEYS.FRANCHISE_INQUIRY.DELETE, KEYS.FRANCHISE_INQUIRY.BASE], (id) => Delete(`${URL_KEYS.FRANCHISE_INQUIRY.DELETE}/${id}`)),
  useMarkFranchiseRead: () => useMutations<{ franchiseInquiryId: string; isRead: boolean }, any>([KEYS.FRANCHISE_INQUIRY.BASE, "mark-read"], (input) => Post(URL_KEYS.FRANCHISE_INQUIRY.EDIT, input)),
  useUpdateFranchiseInquiry: () => useMutations<any, any>([KEYS.FRANCHISE_INQUIRY.BASE, "update"], (input) => Post(URL_KEYS.FRANCHISE_INQUIRY.EDIT, input)),

  // ************ Login History (Dashboard) ***********
  useDeleteLoginHistory: () => useMutations<string, void>([KEYS.DASHBOARD.LOGIN_HISTORY], (id) => Delete(`${URL_KEYS.DASHBOARD.DELETE_LOGIN_HISTORY}/${id}`)),
  useBlockDevice: () => useMutations<string, void>([KEYS.DASHBOARD.LOGIN_HISTORY], (id) => Post(`${URL_KEYS.DASHBOARD.BLOCK_DEVICE}/${id}`, {})),
  useUnblockDevice: () => useMutations<string, void>([KEYS.DASHBOARD.LOGIN_HISTORY], (id) => Post(`${URL_KEYS.DASHBOARD.UNBLOCK_DEVICE}/${id}`, {})),
};



