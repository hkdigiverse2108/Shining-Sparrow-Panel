import { type FC } from "react";
import { LockOutlined, SafetyCertificateOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { motion } from "motion/react";
import { CommonBreadcrumbs, CommonPageWrapper } from "@/Components";
import { BREADCRUMBS } from "@/Data";
import { CommonValidationTextField, CommonButton } from "@/Attribute";
import { blurRevealUp, getFormItem, btnHoverTap } from "@/Utils/animations";
import { Formik, Form } from "formik";
import { message } from "antd";
import { ChangePasswordSchema } from "@/Utils";

const ChangePassword: FC = () => {
  const handleSubmit = (values: any, { setSubmitting }: any) => {
    setTimeout(() => {
      console.log("Password update:", values);
      setSubmitting(false);
      message.success("Password updated successfully!");
    }, 1000);
  };
  return (
    <>
      <CommonBreadcrumbs title="Change Password" breadcrumbs={BREADCRUMBS.PROFILE?.CHANGE_PASSWORD || [{ label: "Change Password" }]} />
      <CommonPageWrapper>
        <div className="auth-change-container">
          <motion.div className="auth-change-card" {...blurRevealUp}>
            <div className="auth-change-left">
              <div className="auth-change-pattern-overlay">
                <div className="auth-change-pattern-circle-1" />
                <div className="auth-change-pattern-circle-2" />
              </div>
              <div className="auth-change-content-wrapper">
                <div className="auth-change-icon-box">
                  <SafetyCertificateOutlined className="auth-change-list-icon" />
                </div>
                <h2 className="auth-change-left-title">Secure Your Account</h2>
                <p className="auth-change-left-desc">
                  Updating your password regularly is a great way to keep your account safe from unauthorized access.
                </p>
                <div className="auth-change-list-wrapper">
                  <div className="auth-change-list-item">
                    <CheckCircleOutlined className="auth-change-list-icon" />
                    <span className="auth-change-list-text">Use at least 6 characters</span>
                  </div>
                  <div className="auth-change-list-item">
                    <CheckCircleOutlined className="auth-change-list-icon" />
                    <span className="auth-change-list-text">Mix letters, numbers & symbols</span>
                  </div>
                  <div className="auth-change-list-item">
                    <CheckCircleOutlined className="auth-change-list-icon" />
                    <span className="auth-change-list-text">Avoid common dictionary words</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="auth-change-right">
              <h3 className="auth-change-right-title">Change Password</h3>
              <p className="auth-change-right-subtitle">Enter your current password and choose a strong new one.</p>
              <Formik initialValues={{ currentPassword: '', newPassword: '', confirmPassword: '' }} validationSchema={ChangePasswordSchema} onSubmit={handleSubmit} >
                {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
                  <Form>
                    <motion.div {...getFormItem(0)}>
                      <CommonValidationTextField name="currentPassword" label="Current Password" type="password" showPasswordToggle placeholder="Enter current password" startIcon={<LockOutlined className="auth-change-input-icon" />} value={values.currentPassword} onChange={handleChange} onBlur={handleBlur} error={errors.currentPassword} touched={touched.currentPassword} />
                    </motion.div>
                    <motion.div {...getFormItem(1)}>
                      <CommonValidationTextField name="newPassword" label="New Password" type="password" showPasswordToggle placeholder="Enter new password" startIcon={<LockOutlined className="auth-change-input-icon" />} value={values.newPassword} onChange={handleChange} onBlur={handleBlur} error={errors.newPassword} touched={touched.newPassword} />
                    </motion.div>
                    <motion.div {...getFormItem(2)}>
                      <CommonValidationTextField name="confirmPassword" label="Confirm Password" type="password" showPasswordToggle placeholder="Confirm new password" startIcon={<LockOutlined className="auth-change-input-icon" />} value={values.confirmPassword} onChange={handleChange} onBlur={handleBlur} error={errors.confirmPassword} touched={touched.confirmPassword} />
                    </motion.div>                    
                    <motion.div className="auth-change-submit-wrapper" {...getFormItem(3)}>
                      <motion.div {...btnHoverTap}>
                        <CommonButton htmlType="submit" type="primary" size="large" loading={isSubmitting} className="auth-change-submit" >
                          <LockOutlined /> Update Password
                        </CommonButton>
                      </motion.div>
                    </motion.div>
                  </Form>
                )}
              </Formik>
            </div>
          </motion.div>
        </div>
      </CommonPageWrapper>
    </>
  );
};

export default ChangePassword;