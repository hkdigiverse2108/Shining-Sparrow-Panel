import { type FC } from 'react';
import { message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, RocketOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { RegisterSchema } from '@/Utils';
import { ROUTES } from '@/Constants';
import { CommonButton, CommonValidationTextField } from '@/Attribute';

const Register: FC = () => {
  return (
    <>
      <div className="auth-header">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Start your journey with us today.</p>
      </div>
      <Formik
        initialValues={{ fullname: '', email: '', password: '', confirmPassword: '' }}
        validationSchema={RegisterSchema}
        onSubmit={(_, { setSubmitting }) => {
          setTimeout(() => {
            setSubmitting(false);
            message.success('Registration successful! Please check your email.');
          }, 1500);
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
          <Form>
            <CommonValidationTextField required name="fullname" placeholder="Enter Full Name" autoComplete="name" startIcon={<UserOutlined />} value={values.fullname} onChange={handleChange} onBlur={handleBlur} error={errors.fullname} touched={touched.fullname} className="mb-4" />
            <CommonValidationTextField required name="email" placeholder="Enter Email" autoComplete="email" startIcon={<MailOutlined />} value={values.email} onChange={handleChange} onBlur={handleBlur} error={errors.email} touched={touched.email} className="mb-4" />
            <CommonValidationTextField required name="password" type="password" showPasswordToggle placeholder="Enter Password" startIcon={<LockOutlined />} value={values.password} onChange={handleChange} onBlur={handleBlur} error={errors.password} touched={touched.password} className="mb-4" />
            <CommonValidationTextField required name="confirmPassword" type="password" showPasswordToggle placeholder="Enter Confirm Password" startIcon={<LockOutlined />} value={values.confirmPassword} onChange={handleChange} onBlur={handleBlur} error={errors.confirmPassword} touched={touched.confirmPassword} className="mb-4" />
            <CommonButton htmlType="submit" loading={isSubmitting} block size="large" icon={!isSubmitting && <RocketOutlined />}>
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
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