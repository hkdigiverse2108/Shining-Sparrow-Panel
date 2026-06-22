import { type FC } from 'react';
import { UserOutlined, LockOutlined, MailOutlined, RocketOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { RegisterSchema } from '@/Utils';
import { ROUTES } from '@/Constants';
import { CommonButton, CommonValidationTextField, showNotification } from '@/Attribute';
import { Mutations } from '@/Api/Mutations';

const Register: FC = () => {
  const navigate = useNavigate();
  const { mutateAsync: signup, isPending } = Mutations.useSignup();
  return (
    <>
      <div className="auth-header">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Start your journey with us today.</p>
      </div>
      <Formik
        initialValues={{ fullname: '', email: '', password: '', confirmPassword: '' }}
        validationSchema={RegisterSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await signup({
              fullName: values.fullname, 
              email: values.email,
              password: values.password,
            });
            showNotification('success', 'Registration successful! Please check your email for OTP.');
            navigate(ROUTES.AUTH.VERIFY_OTP, { state: { email: values.email, type: 'signup' } });
          } catch (error) {
            console.log(error);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
          <Form>
            <CommonValidationTextField required name="fullname" placeholder="Enter Full Name" autoComplete="name" startIcon={<UserOutlined />} value={values.fullname} onChange={handleChange} onBlur={handleBlur} error={errors.fullname} touched={touched.fullname} className="mb-4" />
            <CommonValidationTextField required name="email" placeholder="Enter Email" autoComplete="email" startIcon={<MailOutlined />} value={values.email} onChange={handleChange} onBlur={handleBlur} error={errors.email} touched={touched.email} className="mb-4" />
            <CommonValidationTextField required name="password" type="password" showPasswordToggle placeholder="Enter Password" startIcon={<LockOutlined />} value={values.password} onChange={handleChange} onBlur={handleBlur} error={errors.password} touched={touched.password} className="mb-4" />
            <CommonValidationTextField required name="confirmPassword" type="password" showPasswordToggle placeholder="Enter Confirm Password" startIcon={<LockOutlined />} value={values.confirmPassword} onChange={handleChange} onBlur={handleBlur} error={errors.confirmPassword} touched={touched.confirmPassword} className="mb-4" />
            <CommonButton htmlType="submit" loading={isSubmitting || isPending} block size="large" icon={!isSubmitting && !isPending && <RocketOutlined />}>
              {isSubmitting || isPending ? 'Creating Account...' : 'Create Account'}
            </CommonButton>
          </Form>
        )}
      </Formik>
      <div className="auth-footer">
        Already have an account?{' '}
        <Link to={ROUTES.AUTH.LOGIN} className="auth-link">Sign In</Link>
      </div>
    </>
  );
};

export default Register;