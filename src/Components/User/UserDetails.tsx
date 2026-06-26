import { useMemo, type FC } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Avatar, Spin } from "antd";
import { 
  MailOutlined, 
  PhoneOutlined, 
  CalendarOutlined, 
  UserOutlined,
  BookOutlined,
  CalendarOutlined as WorkshopIcon,
  CommentOutlined
} from '@ant-design/icons';
import { CommonBreadcrumbs, CommonPageWrapper, CommonCard, CommonTag } from "@/Components";
import { blurRevealUp, staggerContainer } from "@/Utils/animations";
import { ROUTES } from "@/Constants";
import { BREADCRUMBS, roleColors, userStatusColors } from "@/Data";
import { CommonButton } from "@/Attribute";
import { Queries } from "@/Api";

const wsStatusColors: Record<string, string> = {
  registered: "processing", 
  attended: "success", 
  absent: "error", 
  cancelled: "default",
  success: "success",
  pending: "processing",
  failed: "error"
};

const UserDetails: FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // Fetch user by ID
  const { data: userResponse, isLoading: isUserLoading } = Queries.useGetUserById(id!);
  const user = userResponse?.data;
  
  // Fetch courses and workshops using React Query hooks
  const { data: coursesRes, isLoading: isCoursesLoading } = Queries.useGetMyCourses({ userId: id });
  const { data: workshopsRes, isLoading: isWorkshopsLoading } = Queries.useGetMyWorkshops({ userId: id });

  const coursesData = useMemo(() => {
    return (coursesRes?.data?.purchased_course_data || []).map((item: any) => {
      const course = item.courseId;
      return {
        id: course?._id || item._id,
        title: course?.name || 'Deleted Course',
        instructor: 'Sparky',
        category: 'Finger Math',
        status: course?.isBlocked ? 'blocked' : 'active',
      };
    });
  }, [coursesRes]);

  const workshopsData = useMemo(() => {
    return (workshopsRes?.data?.purchased_workshop_data || []).map((item: any) => {
      const workshop = item.workshopId;
      return {
        id: workshop?._id || item._id,
        title: workshop?.title || 'Deleted Workshop',
        date: workshop?.duration || '1 Hour',
        registeredAt: item.purchaseDate 
          ? new Date(item.purchaseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
          : new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: item.status || 'success',
      };
    });
  }, [workshopsRes]);

  const initials = useMemo(() => {
    if (!user) return "";
    const name = user.fullName || user.username || "";
    return name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
  }, [user]);

  if (isUserLoading || isCoursesLoading || isWorkshopsLoading) return (
    <CommonPageWrapper>
      <div className="flex justify-center items-center py-20"><Spin size="large" /></div>
    </CommonPageWrapper>
  );

  if (!user || user.role === "admin") return (
    <CommonPageWrapper>
      <div className="text-center py-20">
        <p className="text-lg font-semibold text-foreground mb-4">User not found</p>
        <Link to={ROUTES.USERS.BASE}><CommonButton type="primary">Back to Users</CommonButton></Link>
      </div>
    </CommonPageWrapper>
  );

  return (
    <>
      <CommonBreadcrumbs title="User Details" breadcrumbs={BREADCRUMBS.USERS.DETAILS} />
      <CommonPageWrapper>
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col gap-6 max-w-6xl mx-auto">
          
          {/* Clean Profile Header */}
          <motion.div variants={blurRevealUp}>
            <CommonCard cardProps={{ className: "border-border shadow-sm bg-surface p-6 rounded-2xl" }}>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <Avatar 
                  src={user.profilePhoto || user.profileImage || undefined} 
                  icon={!user.profilePhoto && !user.profileImage && <UserOutlined />}
                  size={96} 
                  className="shadow-md shrink-0 bg-primary/10 border border-primary/20 text-primary font-bold text-2xl flex items-center justify-center"
                >
                  {initials}
                </Avatar>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold text-foreground tracking-tight">{user.fullName || user.username}</h2>
                  <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                    <CommonTag className={`${roleColors[user.role] || roleColors.student} px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize`}>
                      {user.role}
                    </CommonTag>
                    <CommonTag className={`${userStatusColors[user.isBlocked ? "blocked" : "active"] || userStatusColors.inactive} px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize`}>
                      {user.isBlocked ? "Blocked" : "Active"}
                    </CommonTag>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-text-muted justify-center md:justify-start">
                    <span className="flex items-center gap-2">
                      <MailOutlined className="text-primary text-xs" />
                      {user.email}
                    </span>
                    <span className="flex items-center gap-2">
                      <PhoneOutlined className="text-primary text-xs" />
                      {user.phoneNumber || user.phone || "Not provided"}
                    </span>
                    <span className="flex items-center gap-2">
                      <CalendarOutlined className="text-primary text-xs" />
                      Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "N/A"}
                    </span>
                  </div>
                </div>
                <div className="shrink-0 flex items-center justify-center">
                  <CommonButton
                    type="primary"
                    icon={<CommentOutlined />}
                    onClick={() => navigate(ROUTES.CHAT, { state: { userId: user._id } })}
                    className="flex items-center gap-2"
                  >
                    Start Chat
                  </CommonButton>
                </div>
              </div>
            </CommonCard>
          </motion.div>
 
          {/* Data Lists Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Courses Card */}
            <motion.div variants={blurRevealUp}>
              <CommonCard 
                title={
                  <div className="flex items-center gap-2">
                    <BookOutlined className="text-primary" />
                    <span>Enrolled Courses</span>
                    <span className="text-xs font-semibold text-text-muted bg-surface-muted px-2 py-0.5 rounded-full">
                      {coursesData.length}
                    </span>
                  </div>
                } 
                cardProps={{ className: "border-border shadow-sm rounded-2xl h-full" }}
              >
                {coursesData.length === 0 ? (
                  <p className="text-sm text-text-muted text-center py-8">No records found.</p>
                ) : (
                  <div className="divide-y divide-border/60">
                    {coursesData.map((c: any) => (
                      <div key={c.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0 hover:bg-surface-muted/20 transition-all duration-200 rounded-lg px-2 -mx-2">
                        <Link to={`${ROUTES.COURSE.BASE}/${c.id}/manage`} className="mr-3 hover:!text-primary transition-colors flex-1 min-w-0">
                          <p className="font-semibold text-foreground text-sm truncate">{c.title}</p>
                          <p className="text-xs text-text-muted mt-1 truncate">
                            {c.instructor} • {c.category}
                          </p>
                        </Link>
                        <CommonTag color={c.status === "published" || c.status === "active" ? "success" : "default"} className="shrink-0 rounded-full font-medium">
                          {c.status}
                        </CommonTag>
                      </div>
                    ))}
                  </div>
                )}
              </CommonCard>
            </motion.div>

            {/* Workshops Card */}
            <motion.div variants={blurRevealUp}>
              <CommonCard 
                title={
                  <div className="flex items-center gap-2">
                    <WorkshopIcon className="text-primary" />
                    <span>Workshop Registrations</span>
                    <span className="text-xs font-semibold text-text-muted bg-surface-muted px-2 py-0.5 rounded-full">
                      {workshopsData.length}
                    </span>
                  </div>
                } 
                cardProps={{ className: "border-border shadow-sm rounded-2xl h-full" }}
              >
                {workshopsData.length === 0 ? (
                  <p className="text-sm text-text-muted text-center py-8">No records found.</p>
                ) : (
                  <div className="divide-y divide-border/60">
                    {workshopsData.map((w: any) => (
                      <div key={w.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0 hover:bg-surface-muted/20 transition-all duration-200 rounded-lg px-2 -mx-2">
                        <Link to={`${ROUTES.WORKSHOP.BASE}/${w.id}/manage`} className="mr-3 hover:!text-primary transition-colors flex-1 min-w-0">
                          <p className="font-semibold text-foreground text-sm truncate">{w.title}</p>
                          <p className="text-xs text-text-muted mt-1 truncate">
                            {w.date} • Registered: {w.registeredAt || 'N/A'}
                          </p>
                        </Link>
                        <CommonTag color={wsStatusColors[String(w.status).toLowerCase()] || "default"} className="shrink-0 rounded-full font-medium capitalize">
                          {w.status}
                        </CommonTag>
                      </div>
                    ))}
                  </div>
                )}
              </CommonCard>
            </motion.div>

          </div>
        </motion.div>
      </CommonPageWrapper>
    </>
  );
};

export default UserDetails;