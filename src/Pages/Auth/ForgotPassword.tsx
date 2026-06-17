import { type FC } from 'react';
import { message } from 'antd';
import { MailOutlined, ArrowLeftOutlined, RocketOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { ROUTES } from '@/Constants';
import { CommonButton, CommonValidationTextField } from '@/Attribute';
import { ForgotPasswordSchema } from '@/Utils';

const ForgotPassword: FC = () => {
  return (
    <>
      <div className="auth-header">
        <h2 className="auth-title">Forgot Password?</h2>
        <p className="auth-subtitle">No worries, we'll send you reset instructions.</p>
      </div>
      <Formik
        initialValues={{ email: '' }}
        validationSchema={ForgotPasswordSchema}
        onSubmit={(_, { setSubmitting }) => {
          setTimeout(() => {
            setSubmitting(false);
            message.success('If an account exists with this email, a reset link has been sent.');
          }, 1500);
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
          <Form>
            <CommonValidationTextField required name="email" placeholder="Enter Email" autoComplete="email" startIcon={<MailOutlined />} value={values.email} onChange={handleChange} onBlur={handleBlur} error={errors.email} touched={touched.email} />
            <CommonButton htmlType="submit" loading={isSubmitting} block size="large" icon={!isSubmitting && <RocketOutlined />}>
              {isSubmitting ? 'Sending...' : 'Reset Password'}
            </CommonButton>
          </Form>
        )}
      </Formik>
      <div className="auth-footer">
        <Link to={ROUTES.AUTH.LOGIN} className="auth-link">
          <ArrowLeftOutlined /> Back to Sign In
        </Link>
      </div>
    </>
  );
};

export default ForgotPassword;