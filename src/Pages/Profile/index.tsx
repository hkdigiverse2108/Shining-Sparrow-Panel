import { useState, useMemo, useEffect, type FC } from "react";
import { EditOutlined, UserOutlined, SettingOutlined, LockOutlined, MailOutlined, PhoneOutlined, CalendarOutlined, SaveOutlined, CloseOutlined, KeyOutlined, CameraOutlined } from "@ant-design/icons";
import { Formik, Form } from "formik";
import { motion } from "motion/react";
import { Spin, Modal, Button } from "antd";
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
              <CommonFormSection title="Personal Information">
                <CommonValidationTextField name="fullName" label="Full Name" required startIcon={<UserOutlined />} className="col-span-1" />
                <CommonValidationTextField name="phone" label="Phone Number" startIcon={<PhoneOutlined />} className="col-span-1" />
                <CommonValidationTextField name="designation" label="Designation" startIcon={<EditOutlined />} className="col-span-1" />
                <CommonValidationTextField name="email" label="Email Address" value={values.email} disabled startIcon={<MailOutlined />} className="col-span-full" />
              </CommonFormSection>
            </div>
            <div className="profile-form-actions">
              <CommonButton type="default" icon={<CloseOutlined />} onClick={() => setIsEditing(false)} title="Cancel" className="course-button course-button--ghost" />
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
          <CommonButton type="default" icon={<EditOutlined />} onClick={() => setIsEditing(true)} title="Edit Profile" className="course-button course-button--ghost" />
        </div>
        <div className="profile-info-grid">
          {[
            { label: "Full Name", value: username, icon: <UserOutlined /> },
            { label: "Email Address", value: email, icon: <MailOutlined /> },
            { label: "Phone Number", value: phone, icon: <PhoneOutlined /> },
            { label: "Designation", value: designation, icon: <EditOutlined /> },
            { label: "Role", value: user?.role || "Admin", icon: <LockOutlined /> },
            { label: "Member Since", value: new Date(user?.createdAt || Date.now()).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }), icon: <CalendarOutlined /> },
          ].map((d, i) => (
            <div key={i} className="profile-info-item">
              <div className="profile-info-icon-wrapper">{d.icon}</div>
              <div className="profile-info-meta">
                <label className="profile-info-label">{d.label}</label>
                <p className="profile-info-value">{d.value || "Not provided"}</p>
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
    <motion.div variants={blurRevealUp}>
      <div className="profile-view-header">
        <h3 className="profile-section-title">Change Password</h3>
      </div>
      <Formik
        initialValues={{ oldPassword: "", newPassword: "", confirmPassword: "" }}
        validationSchema={PasswordSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form className="profile-tab-form">
            <div className="profile-form-section-card">
              <CommonFormSection title="Password Configuration">
                <CommonValidationTextField name="oldPassword" label="Old Password" type="password" showPasswordToggle required startIcon={<LockOutlined />} className="col-span-1" />
                <CommonValidationTextField name="newPassword" label="New Password" type="password" showPasswordToggle required startIcon={<LockOutlined />} className="col-span-1" />
                <CommonValidationTextField name="confirmPassword" label="Confirm New Password" type="password" showPasswordToggle required startIcon={<LockOutlined />} className="col-span-1" />
              </CommonFormSection>
            </div>
            <div className="profile-form-actions">
              <CommonButton htmlType="submit" type="primary" icon={<LockOutlined />} title="Update Password" loading={updatePasswordMutation.isPending} className="course-button course-button--primary" />
            </div>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
};

// ─── Settings Tab ─────────────────────────────────────────────────────────────

const SiteSettingsTab: FC = () => {
  const queryClient = useQueryClient();
  const { data: settingData, isLoading } = Queries.useGetSetting();
  const [isEditing, setIsEditing] = useState(false);

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
      setIsEditing(false);
    } catch {
      // handled globally
    }
  };

  if (isLoading) {
    return <div className="profile-loading"><Spin size="large" /></div>;
  }

  const isPending = addSettingMutation.isPending || updateSettingMutation.isPending;

  if (isEditing) {
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
                <CommonImageUpload name="logo" label="Site Logo" shape="circle" size={140} className="col-span-full" />
              </CommonFormSection>
            </div>

            <div className="profile-form-section-card">
              <CommonFormSection title="Stats & Metrics">
                <CommonValidationTextField name="enrolledLearners" label="Total Enrolled Learners" type="number" startIcon={<UserOutlined />} className="col-span-1" />
                <CommonValidationTextField name="classCompleted" label="Classes Completed" type="number" startIcon={<SettingOutlined />} className="col-span-1" />
                <CommonValidationTextField name="satisfactionRate" label="Satisfaction Rate (%)" type="number" startIcon={<SettingOutlined />} className="col-span-1" />
              </CommonFormSection>
            </div>

            <div className="profile-form-section-card">
              <CommonFormSection title="Payment Gateway (Razorpay)">
                <CommonValidationTextField 
                  name="razorpayKey" 
                  label="Razorpay Key ID" 
                  type="password" 
                  startIcon={<KeyOutlined />}
                  className="col-span-1"
                />
                <CommonValidationTextField 
                  name="razorpaySecret" 
                  label="Razorpay Secret (leave blank to keep existing)" 
                  type="password" 
                  startIcon={<KeyOutlined />}
                  className="col-span-1"
                />
              </CommonFormSection>
            </div>

            <div className="profile-form-actions">
              <CommonButton type="default" icon={<CloseOutlined />} onClick={() => setIsEditing(false)} title="Cancel" className="course-button course-button--ghost" />
              <CommonButton htmlType="submit" type="primary" icon={<SaveOutlined />} title={isExistingSetting ? "Update Settings" : "Save Settings"} loading={isPending} className="course-button course-button--primary" />
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
          <h3 className="profile-section-title">Site Settings & Config</h3>
          <CommonButton type="default" icon={<EditOutlined />} onClick={() => setIsEditing(true)} title="Edit Settings" className="course-button course-button--ghost" />
        </div>
        <div className="profile-info-grid">
          <div className="profile-info-item col-span-full">
            <div className="profile-info-icon-wrapper"><SettingOutlined /></div>
            <div className="profile-info-meta">
              <label className="profile-info-label">Site Logo</label>
              <div className="mt-2">
                {setting?.logo ? (
                  <img src={setting.logo} alt="Logo" className="h-10 object-contain rounded border border-border bg-surface-muted p-1" />
                ) : (
                  <p className="profile-info-value">No logo uploaded</p>
                )}
              </div>
            </div>
          </div>
          {[
            { label: "Total Enrolled Learners", value: setting?.enrolledLearners, icon: <UserOutlined /> },
            { label: "Classes Completed", value: setting?.classCompleted, icon: <SettingOutlined /> },
            { label: "Satisfaction Rate", value: setting?.satisfactionRate != null ? `${setting.satisfactionRate}%` : null, icon: <SettingOutlined /> },
            { label: "Razorpay Key ID", value: setting?.razorpayKey ? "••••••••••••••••" : null, icon: <KeyOutlined /> },
            { label: "Razorpay Secret", value: setting?.razorpaySecret ? "••••••••••••••••" : null, icon: <KeyOutlined /> },
          ].map((d, i) => (
            <div key={i} className="profile-info-item">
              <div className="profile-info-icon-wrapper">{d.icon}</div>
              <div className="profile-info-meta">
                <label className="profile-info-label">{d.label}</label>
                <p className="profile-info-value">{d.value ?? "Not configured"}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Main Profile Page ────────────────────────────────────────────────────────

const Profile: FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const updateProfileMutation = Mutations.useUpdateProfile();

  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

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

  const handleUpdateAvatar = async (profilePhoto: string) => {
    try {
      const response = await updateProfileMutation.mutateAsync({
        fullName: username,
        phone: phone,
        profilePhoto: profilePhoto,
        designation: designation,
      });
      dispatch(setUser({
        ...user,
        fullName: response.data.fullName,
        phone: response.data.phone || response.data.phoneNumber,
        phoneNumber: response.data.phone || response.data.phoneNumber,
        profilePhoto: response.data.profilePhoto,
        designation: response.data.designation,
      }));
      setIsAvatarModalOpen(false);
    } catch {
      // handled globally
    }
  };

  return (
    <>
      <CommonBreadcrumbs title="My Profile & Settings" breadcrumbs={BREADCRUMBS.PROFILE?.BASE || []} />
      <CommonPageWrapper noPadding className="h-full bg-transparent">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="profile-page-layout">
          {/* Header Card (Mockup style) */}
          <motion.div variants={blurRevealUp} className="profile-header-card">
            <div className="profile-avatar-wrapper" onClick={() => setIsAvatarModalOpen(true)}>
              {avatar ? (
                <img src={avatar} alt={username} className="profile-avatar-img" />
              ) : (
                <div className="profile-avatar-placeholder">
                  <UserOutlined />
                </div>
              )}
              <div className="profile-avatar-edit-overlay">
                <CameraOutlined />
              </div>
              <div className="profile-status-indicator" />
            </div>
            <div className="profile-meta-info">
              <h2 className="profile-meta-name">{username}</h2>
              <span className="profile-meta-role">{designation || "Administrator"}</span>
              <span className="profile-meta-email">{email}</span>
            </div>
          </motion.div>

          {/* Card 2: Personal Information */}
          <motion.div variants={blurRevealUp} className="profile-content-card">
            <PersonalInfoTab
              user={user}
              username={username}
              email={email}
              phone={phone}
              designation={designation}
              avatar={avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${username}`}
            />
          </motion.div>

          {/* Card 3: Site Settings */}
          <motion.div variants={blurRevealUp} className="profile-content-card">
            <SiteSettingsTab />
          </motion.div>

          {/* Card 4: Change Password */}
          <motion.div variants={blurRevealUp} className="profile-content-card">
            <ChangePasswordTab email={email} />
          </motion.div>
        </motion.div>
      </CommonPageWrapper>

      {/* Profile Photo Update Modal */}
      <Modal
        title="Update Profile Photo"
        open={isAvatarModalOpen}
        onCancel={() => setIsAvatarModalOpen(false)}
        footer={null}
        destroyOnClose
        width={420}
        className="avatar-update-modal"
      >
        <Formik
          initialValues={{ profilePhoto: avatar || "" }}
          onSubmit={async (values) => {
            await handleUpdateAvatar(values.profilePhoto);
          }}
        >
          {({ submitForm }) => (
            <Form className="flex flex-col items-center gap-4 py-4">
              <CommonImageUpload 
                name="profilePhoto" 
                label="Choose Profile Photo" 
                shape="circle" 
                size={140} 
                className="w-full" 
              />
              <div className="flex justify-end gap-2 w-full mt-4 border-t border-border pt-4">
                <Button onClick={() => setIsAvatarModalOpen(false)}>Cancel</Button>
                <Button 
                  type="primary" 
                  onClick={submitForm}
                  loading={updateProfileMutation.isPending}
                >
                  Save Photo
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
};

export default Profile;
