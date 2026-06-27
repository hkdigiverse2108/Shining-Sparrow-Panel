import { type FC } from 'react';
import { LockOutlined, RocketOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { ROUTES } from '@/Constants';
import { CommonButton, CommonValidationTextField } from '@/Attribute';
import { Mutations } from '@/Api/Mutations';
import { ResetPasswordSchema } from '@/Utils';

const ResetPassword: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = ((location.state as any)?.email || '').trim().toLowerCase();

  const { mutateAsync: resetPassword, isPending } = Mutations.useResetPassword();

  return (
    <>
      <div className="auth-header">
        <h2 className="auth-title">Reset Password</h2>
        <p className="auth-subtitle">Enter your new password below.</p>
      </div>
      <Formik
        initialValues={{ newPassword: '', confirmPassword: '' }}
        validationSchema={ResetPasswordSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await resetPassword({ 
              email, 
              newPassword: values.newPassword
            });
            navigate(ROUTES.AUTH.LOGIN);
          } catch (error) {
              console.log(error);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
          <Form>
            <CommonValidationTextField required name="newPassword" type="password" showPasswordToggle placeholder="Enter New Password" startIcon={<LockOutlined />} value={values.newPassword} onChange={handleChange} onBlur={handleBlur} error={errors.newPassword} touched={touched.newPassword} className="mb-4" />
            <CommonValidationTextField required name="confirmPassword" type="password" showPasswordToggle placeholder="Confirm New Password" startIcon={<LockOutlined />} value={values.confirmPassword} onChange={handleChange} onBlur={handleBlur} error={errors.confirmPassword} touched={touched.confirmPassword} className="mb-4" />
            <CommonButton htmlType="submit" loading={isSubmitting || isPending} block size="large" icon={!isSubmitting && !isPending && <RocketOutlined />} > {isSubmitting || isPending ? 'Resetting...' : 'Reset Password'} </CommonButton>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default ResetPassword;
