import { useState, type FC } from "react";
import { EditOutlined } from "@ant-design/icons";
import { Formik, Form } from "formik";
import { motion } from "motion/react";
import { CommonBreadcrumbs, CommonPageWrapper, CommonFormSection, CommonImageUpload, CommonCard, CommonTag, CommonDrawer } from "@/Components";
import { blurRevealUp, staggerContainer } from "@/Utils/animations";
import { CommonButton, CommonValidationTextField } from "@/Attribute";
import { BREADCRUMBS } from "@/Data";
import * as Yup from "yup";
import { useAppSelector, useAppDispatch } from "@/Store/hooks";
import { setUser } from "@/Store";
import { Mutations } from "@/Api";

const ProfileSchema = Yup.object().shape({
  fullName: Yup.string().required("Required"),
  phone: Yup.string().optional(),
  profilePhoto: Yup.string().nullable().optional(),
});

const Profile: FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const dispatch = useAppDispatch();
  
  const user = useAppSelector((state) => state.auth.user);
  const updateProfileMutation = Mutations.useUpdateProfile();

  const username = user?.fullName || "Admin User";
  const email = user?.email || "admin@example.com";
  const phone = user?.phone || user?.phoneNumber || "Not provided";
  const avatar = user?.profilePhoto || user?.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${username}`;
  const role = user?.role || "Admin";

  const handleSave = async (values: any) => {
    try {
      const response = await updateProfileMutation.mutateAsync({
        fullName: values.fullName,
        phone: values.phone,
        profilePhoto: values.profilePhoto,
      });

      dispatch(setUser({
        ...user,
        fullName: response.data.fullName,
        phone: response.data.phone,
        profilePhoto: response.data.profilePhoto,
      }));

      setIsDrawerOpen(false);
    } catch (error) {
      // Error is handled globally
    }
  };

  return (
    <>
      <CommonBreadcrumbs title="My Profile" breadcrumbs={BREADCRUMBS.PROFILE?.BASE || []} />
      <CommonPageWrapper>
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <motion.div variants={blurRevealUp} className="profile-header">
            <div className="profileheaderblur" />
            <div className="avatarcontainer group" onClick={() => setIsDrawerOpen(true)}>
              <img src={avatar} alt={username} className="avatarimg" />
              <div className="avataroverlay">
                <EditOutlined className="avatarediticon" />
              </div>
            </div>

            <div className="profileinfo">
              <h2 className="profileusername">{username}</h2>
              <CommonTag color="blue" className="mt-1">{role}</CommonTag>
              <div className="profilemeta">
                <span>✉️ {email}</span>
                <span>📅 Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>

            <CommonButton type="default" icon={<EditOutlined />} onClick={() => setIsDrawerOpen(true)} className="profileeditbtn">
              Edit
            </CommonButton>
          </motion.div>

          {/* Removed the bento-grid and only kept the Personal Details card */}
          <motion.div variants={blurRevealUp} className="mt-6">
            <CommonCard title="Personal Details" cardProps={{ className: "border-border rounded-2xl overflow-hidden" }}>
              <div className="details-grid">
                {[
                  { l: "Full Name", v: username }, 
                  { l: "Email Address", v: email },
                  { l: "Phone Number", v: phone }, 
                  { l: "Role", v: role }
                ].map((d, i) => (
                  <div key={i}>
                    <label className="detaillabel">{d.l}</label>
                    <p className="detailvalue">{d.v}</p>
                  </div>
                ))}
              </div>
            </CommonCard>
          </motion.div>
        </motion.div>
      </CommonPageWrapper>

      {/* Edit Profile Drawer */}
      <CommonDrawer title="Edit Profile" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <Formik 
          enableReinitialize 
          initialValues={{ 
            fullName: username, 
            phone: phone !== "Not provided" ? phone : "", 
            profilePhoto: avatar 
          }} 
          validationSchema={ProfileSchema} 
          onSubmit={handleSave}
        >
          {() => (
            <Form>
              <CommonImageUpload name="profilePhoto" label="Profile Photo" shape="circle" size={100} />
              <CommonFormSection title="Account Details">
                <CommonValidationTextField name="fullName" label="Full Name" required />
                <CommonValidationTextField name="phone" label="Phone Number" />
                <CommonValidationTextField name="email" label="Email Address" value={email} disabled />
              </CommonFormSection>
              <div className="drawerfooter">
                <CommonButton 
                  htmlType="submit" 
                  type="primary" 
                  title="Save Changes" 
                  block 
                  loading={updateProfileMutation.isPending} 
                />
              </div>
            </Form>
          )}
        </Formik>
      </CommonDrawer>
    </>
  );
};

export default Profile;