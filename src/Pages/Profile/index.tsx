import { useState, type FC } from "react";
import { message, Switch } from "antd";
import { EditOutlined, LockOutlined, IeOutlined } from "@ant-design/icons";
import { Formik, Form } from "formik";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { CommonBreadcrumbs, CommonPageWrapper, CommonFormSection, CommonImageUpload, CommonCard, CommonTag, CommonDrawer } from "@/Components";
import { blurRevealUp, staggerContainer } from "@/Utils/animations";
import { CommonButton, CommonValidationTextField } from "@/Attribute";
import { BREADCRUMBS } from "@/Data";
import * as Yup from "yup";
import { ROUTES } from "@/Constants";

const adminUser = {
  id: 1, username: "Alex Morgan", email: "alex.morgan@lms-platform.com", phone: "+1 (555) 123-4567",
  role: "Super Admin", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Alex", lastLogin: "Today at 10:30 AM",
  memberSince: "Jan 2023", twoFactorEnabled: true, emailNotifications: true,
};

const ProfileSchema = Yup.object().shape({
  username: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
});

const Profile: FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [user, setUser] = useState(adminUser);
  const handleSave = (values: any) => {
    setUser(prev => ({ ...prev, ...values }));
    setIsDrawerOpen(false);
    message.success("Profile updated!");
  };
  return (
    <>
      <CommonBreadcrumbs title="My Profile" breadcrumbs={BREADCRUMBS.PROFILE?.BASE || []} />
      <CommonPageWrapper>
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <motion.div variants={blurRevealUp} className="profile-header">
            <div className="profileheaderblur" />
            <div className="avatarcontainer group" onClick={() => setIsDrawerOpen(true)}>
              <img src={user.avatar} alt={user.username} className="avatarimg" />
              <div className="avataroverlay">
                <EditOutlined className="avatarediticon" />
              </div>
            </div>

            <div className="profileinfo">
              <h2 className="profileusername">{user.username}</h2>
              <CommonTag color="blue" className="mt-1">{user.role}</CommonTag>
              <div className="profilemeta">
                <span>✉️ {user.email}</span>
                <span>🕐 Last login: {user.lastLogin}</span>
                <span>📅 Member since {user.memberSince}</span>
              </div>
            </div>

            <CommonButton type="default" icon={<EditOutlined />} onClick={() => setIsDrawerOpen(true)} className="profileeditbtn">
              Edit
            </CommonButton>
          </motion.div>
          <div className="bento-grid">
            <div className="bento-maincol">
              <motion.div variants={blurRevealUp}>
                <CommonCard title="Personal Details" cardProps={{ className: "border-border rounded-2xl overflow-hidden" }}>
                  <div className="details-grid">
                    {[
                      { l: "Full Name", v: user.username }, { l: "Email Address", v: user.email },
                      { l: "Phone Number", v: user.phone || 'Not provided' }, { l: "Role", v: user.role }
                    ].map((d, i) => (
                      <div key={i}>
                        <label className="detaillabel">{d.l}</label>
                        <p className="detailvalue">{d.v}</p>
                      </div>
                    ))}
                  </div>
                </CommonCard>
              </motion.div>
              <motion.div variants={blurRevealUp}>
                <CommonCard title="Preferences" cardProps={{ className: "border-border rounded-2xl overflow-hidden" }}>
                  <div className="preferencesrow">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">Email Notifications</p>
                      <p className="text-xs text-muted">Receive system alerts and updates</p>
                    </div>
                    <Switch checked={user.emailNotifications} onChange={(c) => { setUser(prev => ({...prev, emailNotifications: c})); message.info(`Notifications ${c ? 'enabled' : 'disabled'}`); }} />
                  </div>
                </CommonCard>
              </motion.div>

              <motion.div variants={blurRevealUp}>
                <CommonCard title="Danger Zone" cardProps={{ className: "border-danger/20 bg-danger/5 rounded-2xl overflow-hidden" }}>
                  <p className="text-xs text-muted mb-4">Once you delete your account, there is no going back.</p>
                  <CommonButton danger size="small" onClick={() => message.warning("Disabled in demo")}>Delete Account</CommonButton>
                </CommonCard>
              </motion.div>
            </div>
            <div className="lg:col-span-2 flex flex-col gap-5 md:gap-6">
              <motion.div variants={blurRevealUp}>
                <CommonCard title="Security" cardProps={{ className: "border-border rounded-2xl overflow-hidden" }}>
                  <div className="space-y-3">
                    <div className="security-item">
                      <div className="security-iteminner">
                        <LockOutlined className="security-itemicon" />
                        <div className="min-w-0">
                          <p className="securityitem-title">Password</p>
                          <p className="securityitem-subtitle">Changed 30 days ago</p>
                        </div>
                      </div>
                      <Link to={ROUTES.PROFILE.CHANGE_PASSWORD}>
                        <CommonButton size="small" type="default" className="shrink-0">Change</CommonButton>
                      </Link>
                    </div>
                    
                    <div className="security-item">
                      <div className="security-iteminner">
                        <IeOutlined className={user.twoFactorEnabled ? "text-success" : "text-muted"} />
                        <div className="min-w-0">
                          <p className="securityitem-title">Two-Factor Auth</p>
                          <p className="securityitem-subtitle">Extra security layer</p>
                        </div>
                      </div>
                      <Switch checked={user.twoFactorEnabled} onChange={(c) => { setUser(prev => ({...prev, twoFactorEnabled: c})); message.success(`2FA ${c ? 'enabled' : 'disabled'}`); }} />
                    </div>
                  </div>
                </CommonCard>
              </motion.div>

              <motion.div variants={blurRevealUp}>
                <CommonCard title="Activity Status" cardProps={{ className: "border-border rounded-2xl overflow-hidden" }}>
                  <div className="activitybox">
                    <span className="activitydot" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">
                        Currently Active <CommonTag color="success" className="ml-2">Online</CommonTag>
                      </p>
                      <p className="text-[10px] text-muted">Logged in from Chrome on macOS</p>
                    </div>
                  </div>
                </CommonCard>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </CommonPageWrapper>

      {/* Edit Profile Drawer */}
      <CommonDrawer title="Edit Profile" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <Formik enableReinitialize initialValues={{ username: user.username, email: user.email, phone: user.phone, profileImage: user.avatar }} validationSchema={ProfileSchema} onSubmit={handleSave}>
          {() => (
            <Form>
              <CommonImageUpload name="profileImage" label="Profile Photo" shape="circle" size={100} />
              <CommonFormSection title="Account Details">
                <CommonValidationTextField name="username" label="Full Name" required />
                <CommonValidationTextField name="email" label="Email Address" required />
                <CommonValidationTextField name="phone" label="Phone Number" />
              </CommonFormSection>
              <div className="drawerfooter">
                <CommonButton htmlType="submit" type="primary" title="Save Changes" block />
              </div>
            </Form>
          )}
        </Formik>
      </CommonDrawer>
    </>
  );
};

export default Profile;