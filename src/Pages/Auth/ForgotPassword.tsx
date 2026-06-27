import { type FC } from 'react';
import { MailOutlined, ArrowLeftOutlined, RocketOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { ROUTES } from '@/Constants';
import { CommonButton, CommonValidationTextField } from '@/Attribute';
import { ForgotPasswordSchema } from '@/Utils';
import { Mutations } from '@/Api/Mutations';

const ForgotPassword: FC = () => {
  const navigate = useNavigate();
  const { mutateAsync: forgotPassword, isPending } = Mutations.useForgotPassword();
  return (
    <>
      <div className="auth-header">
        <h2 className="auth-title">Forgot Password?</h2>
        <p className="auth-subtitle">No worries, we'll send you reset instructions.</p>
      </div>
      <Formik
        initialValues={{ email: '' }}
        validationSchema={ForgotPasswordSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const email = values.email.trim().toLowerCase();
            await forgotPassword({ email });
            navigate(ROUTES.AUTH.VERIFY_OTP, { state: { email, type: 'forgot' } });
          } catch (error) {
            console.log(error);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
          <Form>
            <CommonValidationTextField required name="email" placeholder="Enter Email" autoComplete="email" startIcon={<MailOutlined />} value={values.email} onChange={handleChange} onBlur={handleBlur} error={errors.email} touched={touched.email} />
            <CommonButton htmlType="submit" loading={isSubmitting || isPending} block size="large" icon={!isSubmitting && !isPending && <RocketOutlined />}>
              {isSubmitting || isPending ? 'Sending...' : 'Send OTP'}
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
