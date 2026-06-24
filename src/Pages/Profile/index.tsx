import { useState, useMemo, useEffect, type FC } from "react";
import { EditOutlined, UserOutlined, SettingOutlined, LockOutlined, MailOutlined, PhoneOutlined, CalendarOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import { Formik, Form } from "formik";
import { motion } from "motion/react";
import { Avatar, Spin, Tabs } from "antd";
import { CommonBreadcrumbs, CommonPageWrapper, CommonFormSection, CommonImageUpload } from "@/Components";
import { blurRevealUp, staggerContainer } from "@/Utils/animations";
import { CommonButton, CommonValidationTextField } from "@/Attribute";
import { BREADCRUMBS } from "@/Data";
import * as Yup from "yup";
import { useAppSelector, useAppDispatch } from "@/Store/hooks";
import { setUser } from "@/Store";
import { Mutations, Queries } from "@/Api";
import { useQueryClient } from "@tanstack/react-query";
import { KEYS } from "@/Constants";

// ─── Validation schemas ──────────────────────────────────────────────────────

const ProfileSchema = Yup.object().shape({
  fullName: Yup.string().required("Full name is required"),
  phone: Yup.string().optional(),
  designation: Yup.string().optional(),
  profilePhoto: Yup.string().nullable().optional(),
});

const PasswordSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .required("Old password is required"),
  newPassword: Yup.string()
    .required("New password is required")
    .min(6, "Minimum 6 characters"),
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("newPassword")], "Passwords do not match"),
});

const SettingsSchema = Yup.object().shape({
  logo: Yup.string().nullable().optional(),
  enrolledLearners: Yup.number().optional(),
  classCompleted: Yup.number().optional(),
  satisfactionRate: Yup.number().min(0).max(100).optional(),
  razorpayKey: Yup.string().optional(),
  razorpaySecret: Yup.string().optional(),
});

// ─── Profile detail row component ────────────────────────────────────────────

const DetailRow: FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="profile-detail-row">
    <span className="profile-detail-icon">{icon}</span>
    <div className="profile-detail-text">
      <span className="profile-detail-label">{label}</span>
      <span className="profile-detail-value">{value || "Not provided"}</span>
    </div>
  </div>
);

// ─── Personal Info Tab ────────────────────────────────────────────────────────

const PersonalInfoTab: FC<{
  user: any;
  username: string;
  email: string;
  phone: string;
  designation: string;
  avatar: string;
}> = ({ user, username, email, phone, designation, avatar }) => {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useAppDispatch();
  const updateProfileMutation = Mutations.useUpdateProfile();

  const handleSave = async (values: any) => {
    try {
      const response = await updateProfileMutation.mutateAsync({
        fullName: values.fullName,
        phone: values.phone,
        profilePhoto: values.profilePhoto,
        designation: values.designation,
      });
      dispatch(setUser({
        ...user,
        fullName: response.data.fullName,
        phone: response.data.phone || response.data.phoneNumber,
        phoneNumber: response.data.phone || response.data.phoneNumber,
        profilePhoto: response.data.profilePhoto,
        designation: response.data.designation,
      }));
      setIsEditing(false);
    } catch {
    }
  };

  if (isEditing) {
    return (
      <Formik
        enableReinitialize
        initialValues={{ fullName: username, phone, designation, email, profilePhoto: avatar }}
        validationSchema={ProfileSchema}
        onSubmit={handleSave}
      >
        {({ values }) => (
          <Form className="profile-tab-form">
            <div className="profile-form-section-card">
              <CommonFormSection title="Profile Picture">
                <CommonImageUpload name="profilePhoto" label="Photo" shape="circle" size={120} className="col-span-full" />
              </CommonFormSection>
            </div>
            <div className="profile-form-section-card">
              <CommonFormSection title="Personal Information">
                <CommonValidationTextField name="fullName" label="Full Name" required />
                <CommonValidationTextField name="phone" label="Phone Number" />
                <CommonValidationTextField name="designation" label="Designation" />
                <CommonValidationTextField name="email" label="Email Address" value={values.email} disabled />
              </CommonFormSection>
            </div>
            <div className="profile-form-actions">
              <CommonButton type="default" icon={<CloseOutlined />} onClick={() => setIsEditing(false)} title="Cancel" />
              <CommonButton htmlType="submit" type="primary" icon={<SaveOutlined />} title="Save Changes" loading={updateProfileMutation.isPending} className="course-button course-button--primary" />
            </div>
          </Form>
        )}
      </Formik>
    );
  }

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible">
      <motion.div variants={blurRevealUp}>
        <div className="profile-view-header">
          <h3 className="profile-section-title">Personal Details</h3>
          <CommonButton type="default" icon={<EditOutlined />} onClick={() => setIsEditing(true)} title="Edit Profile" />
        </div>
        <div className="profile-details-grid">
          {[
            { label: "Full Name", value: username, icon: <UserOutlined /> },
            { label: "Email Address", value: email, icon: <MailOutlined /> },
            { label: "Phone Number", value: phone, icon: <PhoneOutlined /> },
            { label: "Designation", value: designation, icon: <EditOutlined /> },
            { label: "Role", value: user?.role || "Admin", icon: <LockOutlined /> },
            { label: "Member Since", value: new Date(user?.createdAt || Date.now()).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }), icon: <CalendarOutlined /> },
          ].map((d, i) => (
            <div key={i} className="profile-detail-card">
              <div className="profile-detail-card-icon">{d.icon}</div>
              <div className="profile-detail-card-content">
                <label className="detaillabel">{d.label}</label>
                <p className="detailvalue">{d.value || "Not provided"}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Change Password Tab ──────────────────────────────────────────────────────

const ChangePasswordTab: FC<{ email: string }> = ({ email }) => {
  const updatePasswordMutation = Mutations.useUpdatePassword();

  const handleSubmit = async (values: any, { resetForm }: any) => {
    try {
      await updatePasswordMutation.mutateAsync({ 
        email, 
        oldPassword: values.oldPassword, 
        newPassword: values.newPassword 
      });
      resetForm();
    } catch {
      // handled globally
    }
  };

  return (
    <Formik
      initialValues={{ oldPassword: "", newPassword: "", confirmPassword: "" }}
      validationSchema={PasswordSchema}
      onSubmit={handleSubmit}
    >
      {() => (
        <Form className="profile-tab-form">
          <div className="profile-form-section-card">
            <CommonFormSection title="Change Password">
              <CommonValidationTextField name="oldPassword" label="Old Password" type="password" showPasswordToggle required />
              <CommonValidationTextField name="newPassword" label="New Password" type="password" showPasswordToggle required />
              <CommonValidationTextField name="confirmPassword" label="Confirm New Password" type="password" showPasswordToggle required />
            </CommonFormSection>
          </div>
          <div className="profile-form-actions">
            <CommonButton htmlType="submit" type="primary" icon={<LockOutlined />} title="Update Password" loading={updatePasswordMutation.isPending} className="course-button course-button--primary" />
          </div>
        </Form>
      )}
    </Formik>
  );
};

// ─── Copy Button Helper ───────────────────────────────────────────────────────


// ─── Settings Tab ─────────────────────────────────────────────────────────────

const SiteSettingsTab: FC = () => {
  const queryClient = useQueryClient();
  const { data: settingData, isLoading } = Queries.useGetSetting();

  const addSettingMutation = Mutations.useAddSetting();
  const updateSettingMutation = Mutations.useUpdateSetting();

  const setting = settingData?.data;
  const isExistingSetting = !!setting?._id;

  const initialValues = useMemo(() => {
    return {
      logo: setting?.logo || "",
      enrolledLearners: setting?.enrolledLearners ?? "",
      classCompleted: setting?.classCompleted ?? "",
      satisfactionRate: setting?.satisfactionRate ?? "",
      razorpayKey: setting?.razorpayKey || "",
      razorpaySecret: setting?.razorpayKey ? "••••••••••••••••" : "",
    };
  }, [setting]);

  const handleSubmit = async (values: any) => {
    const settingsPayload = {
      logo: values.logo,
      enrolledLearners: Number(values.enrolledLearners) || 0,
      classCompleted: Number(values.classCompleted) || 0,
      satisfactionRate: Number(values.satisfactionRate) || 0,
      razorpayKey: values.razorpayKey,
      ...(values.razorpaySecret && values.razorpaySecret !== "••••••••••••••••" ? { razorpaySecret: values.razorpaySecret } : {}),
    };

    try {
      if (isExistingSetting) {
        await updateSettingMutation.mutateAsync(settingsPayload);
      } else {
        await addSettingMutation.mutateAsync(settingsPayload);
      }

      queryClient.invalidateQueries({ queryKey: [KEYS.SETTING.BASE] });
    } catch {
      // handled globally
    }
  };

  if (isLoading) {
    return <div className="profile-loading"><Spin size="large" /></div>;
  }

  const isPending = addSettingMutation.isPending || updateSettingMutation.isPending;

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={SettingsSchema}
      onSubmit={handleSubmit}
    >
      {() => (
        <Form className="profile-tab-form">
          <div className="profile-form-section-card">
            <CommonFormSection title="Branding">
              <CommonImageUpload name="logo" label="Site Logo" shape="square" size={80} className="col-span-full" />
            </CommonFormSection>
          </div>

          <div className="profile-form-section-card">
            <CommonFormSection title="Stats & Metrics">
              <CommonValidationTextField name="enrolledLearners" label="Total Enrolled Learners" type="number" />
              <CommonValidationTextField name="classCompleted" label="Classes Completed" type="number" />
              <CommonValidationTextField name="satisfactionRate" label="Satisfaction Rate (%)" type="number" />
            </CommonFormSection>
          </div>

          <div className="profile-form-section-card">
            <CommonFormSection title="Payment Gateway (Razorpay)">
              <CommonValidationTextField 
                name="razorpayKey" 
                label="Razorpay Key ID" 
                type="password" 
              />
              <CommonValidationTextField 
                name="razorpaySecret" 
                label="Razorpay Secret (leave blank to keep existing)" 
                type="password" 
              />
            </CommonFormSection>
          </div>

          <div className="profile-form-actions">
            <CommonButton htmlType="submit" type="primary" icon={<SaveOutlined />} title={isExistingSetting ? "Update Settings" : "Save Settings"} loading={isPending} className="course-button course-button--primary" />
          </div>
        </Form>
      )}
    </Formik>
  );
};

// ─── Main Profile Page ────────────────────────────────────────────────────────

const Profile: FC = () => {
  const user = useAppSelector((state) => state.auth.user);

  // Manage layout container height and scrolling for profile page
  useEffect(() => {
    const contentEl = document.querySelector('.ant-layout-content');
    if (contentEl) {
      contentEl.classList.add('profile-page-layout-content');
    }
    return () => {
      if (contentEl) {
        contentEl.classList.remove('profile-page-layout-content');
      }
    };
  }, []);

  const username = user?.fullName || "Admin User";
  const email = user?.email || "admin@example.com";
  const phone = user?.phone || user?.phoneNumber || "";
  const designation = user?.designation || "";
  const avatar = user?.profilePhoto || user?.profileImage;
  const role = user?.role || "Admin";
  const createdAt = user?.createdAt;

  const tabItems = [
    {
      key: "personal",
      label: (
        <span className="profile-tab-label">
          <UserOutlined /> Personal Info
        </span>
      ),
      children: (
        <PersonalInfoTab
          user={user}
          username={username}
          email={email}
          phone={phone}
          designation={designation}
          avatar={avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${username}`}
        />
      ),
    },
    {
      key: "settings",
      label: (
        <span className="profile-tab-label">
          <SettingOutlined /> Site Settings
        </span>
      ),
      children: <SiteSettingsTab />,
    },
    {
      key: "password",
      label: (
        <span className="profile-tab-label">
          <LockOutlined /> Change Password
        </span>
      ),
      children: <ChangePasswordTab email={email} />,
    },
  ];

  return (
    <>
      <CommonBreadcrumbs title="My Profile & Settings" breadcrumbs={BREADCRUMBS.PROFILE?.BASE || []} />
      <CommonPageWrapper noPadding className="h-full bg-transparent">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="profile-page-layout">
          {/* Left Sidebar */}
          <motion.div variants={blurRevealUp} className="profile-sidebar-card">
            {/* Header Banner Background */}
            <div className="profile-sidebar-cover-banner" />

            <div className="profile-sidebar-avatar-wrap">
              {avatar ? (
                <img src={avatar} alt={username} className="profile-sidebar-avatar" />
              ) : (
                <Avatar size={100} icon={<UserOutlined />} className="profile-sidebar-avatar-placeholder" />
              )}
              <div className="profile-sidebar-status-dot" />
            </div>

            <div className="profile-sidebar-info">
              <h2 className="profile-sidebar-name">{username}</h2>
              <span className="profile-sidebar-role">{designation || role}</span>
              <span className={`profile-sidebar-badge ${role === "admin" ? "badge-admin" : "badge-user"}`}>
                {role.toUpperCase()}
              </span>
            </div>

            <div className="profile-sidebar-details">
              <DetailRow icon={<MailOutlined />} label="Email" value={email} />
              <DetailRow icon={<PhoneOutlined />} label="Phone" value={phone} />
              {designation && <DetailRow icon={<UserOutlined />} label="Designation" value={designation} />}
              {createdAt && (
                <DetailRow
                  icon={<CalendarOutlined />}
                  label="Member Since"
                  value={new Date(createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                />
              )}
            </div>
          </motion.div>

          {/* Right Tabbed Content */}
          <motion.div variants={blurRevealUp} className="profile-content-card">
            <Tabs
              defaultActiveKey="personal"
              items={tabItems}
              className="profile-tabs"
              size="large"
            />
          </motion.div>
        </motion.div>
      </CommonPageWrapper>
    </>
  );
};

export default Profile;
