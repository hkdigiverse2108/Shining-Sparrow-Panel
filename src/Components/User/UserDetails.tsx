import { useMemo, type FC } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { Avatar } from "antd";
import { CommonBreadcrumbs, CommonPageWrapper, CommonCard, CommonTag } from "@/Components";
import { blurRevealUp, staggerContainer } from "@/Utils/animations";
import { useAppSelector } from "@/Store/hooks";
import { ROUTES } from "@/Constants";
import { BREADCRUMBS, roleColors, userStatusColors } from "@/Data";
import { CommonButton } from "@/Attribute";

const wsStatusColors: Record<string, string> = {
  registered: "processing", attended: "success", absent: "error", cancelled: "default",
};

const UserDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const user = useAppSelector((s) => s.users.data.find((u) => u.id === Number(id)));
  const courses = useAppSelector((s) => s.courses.data);
  const workshops = useAppSelector((s) => s.workshops.data);

  const isInstructor = user?.role === "instructor";

  const coursesData = useMemo(() => {
    if (!user) return [];
    return isInstructor 
      ? courses.filter((c) => c.instructorId === user.id)
      : courses.filter((c) => c.enrolledStudents.includes(user.id));
  }, [user, courses, isInstructor]);

  const workshopsData = useMemo(() => {
    if (!user) return [];
    const filtered = isInstructor 
      ? workshops.filter((w) => w.speakerId === user.id)
      : workshops.filter((w) => w.registrations?.some((r) => r.userId === user.id))
          .map((w) => ({ ...w, ...w.registrations.find((r) => r.userId === user.id) }));
    return filtered;
  }, [user, workshops, isInstructor]);

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
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          
          {/* Clean Profile Header */}
          <motion.div variants={blurRevealUp} className="mb-6">
            <CommonCard cardProps={{ className: "border-border" }}>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <Avatar src={user.profileImage} size={88} className="shadow-lg shrink-0" />
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold text-foreground">{user.username}</h2>
                  <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                    <CommonTag className={roleColors[user.role] || roleColors.student}>{user.role}</CommonTag>
                    <CommonTag className={userStatusColors[user.status] || userStatusColors.inactive}>{user.status}</CommonTag>
                  </div>
                  <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-sm text-muted-foreground justify-center md:justify-start">
                    <span>✉️ {user.email}</span>
                    <span>📞 {user.phone || "Not provided"}</span>
                    <span>📅 Joined {user.createdAt}</span>
                  </div>
                </div>
              </div>
            </CommonCard>
          </motion.div>

          {/* Data Lists Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Courses Card */}
            <motion.div variants={blurRevealUp}>
              <CommonCard 
                title={`${isInstructor ? "Courses Teaching" : "Enrolled Courses"} (${coursesData.length})`} 
                cardProps={{ className: "border-border h-full" }}
              >
                {coursesData.length === 0 ? (
                  <p className="text-sm text-muted text-center py-4">No records found.</p>
                ) : (
                  <div className="divide-y divide-border">
                    {coursesData.map((c: any) => (
                      <div key={c.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                        {/* Replaced div with Link */}
                        <Link to={`${ROUTES.COURSE.BASE}/${c.id}`} className="mr-3 hover:!text-primary transition-colors">
                          <p className="font-medium text-foreground">{c.title}</p>
                          <p className="text-xs text-muted">
                            {isInstructor ? `${c.category} • ${c.enrollmentsCount} Students` : `${c.instructor} • ${c.category}`}
                          </p>
                        </Link>
                        <CommonTag color={c.status === "published" ? "success" : "default"} className="shrink-0">{c.status}</CommonTag>
                      </div>
                    ))}
                  </div>
                )}
              </CommonCard>
            </motion.div>

            {/* Workshops Card */}
            <motion.div variants={blurRevealUp}>
              <CommonCard 
                title={`${isInstructor ? "Workshops Hosting" : "Workshop Registrations"} (${workshopsData.length})`} 
                cardProps={{ className: "border-border h-full" }}
              >
                {workshopsData.length === 0 ? (
                  <p className="text-sm text-muted text-center py-4">No records found.</p>
                ) : (
                  <div className="divide-y divide-border">
                    {workshopsData.map((w: any) => (
                      <div key={w.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                        {/* Replaced div with Link */}
                        <Link to={`${ROUTES.WORKSHOP.BASE}/${w.id}`} className="mr-3 hover:!text-primary transition-colors">
                          <p className="font-medium text-foreground">{w.title}</p>
                          <p className="text-xs text-muted">
                            {isInstructor ? `${w.date} • ${w.registrations?.length || 0} Attendees` : `${w.date} • Registered: ${w.registeredAt || 'N/A'}`}
                          </p>
                        </Link>
                        {isInstructor ? (
                          <CommonTag color="processing" className="shrink-0">{w.tag || "Upcoming"}</CommonTag>
                        ) : (
                          <CommonTag color={wsStatusColors[w.status || '']} className="shrink-0">{w.status}</CommonTag>
                        )}
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