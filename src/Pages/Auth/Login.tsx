import { type FC } from 'react';
import { UserOutlined, LockOutlined, RocketOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { ROUTES } from '@/Constants';
import { CommonValidationTextField, CommonButton, CommonCheckbox, showNotification } from '@/Attribute';
import { LoginSchema } from '@/Utils';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/Store/hooks';
import { setCredentials } from '@/Store';

const Login: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  return (
    <>
      <div className="auth-header">
        <h2 className="auth-title">Admin Login</h2>
        <p className="auth-subtitle">Enter your credentials to access your account.</p>
      </div>
      <Formik
        initialValues={{ email: '', password: '', remember: true }}
        validationSchema={LoginSchema}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            setSubmitting(false);
            if (values.email === 'admin@gmail.com' && values.password === 'Admin@123') {
              dispatch(setCredentials({ name: 'Admin User', email: values.email }));
              showNotification('success', 'Login Successful');
              navigate(ROUTES.DASHBOARD);
            } else {
              showNotification('error', 'Login Failed', 'Invalid admin credentials.');
            }
          }, 1500);
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
          <Form>
            <CommonValidationTextField required name="email" placeholder="Enter Username or Email" autoComplete="username" startIcon={<UserOutlined />} value={values.email} onChange={handleChange} onBlur={handleBlur} error={errors.email} touched={touched.email} className="mb-4" />
            <CommonValidationTextField required name="password" type="password" showPasswordToggle placeholder="Enter Password" autoComplete="current-password" startIcon={<LockOutlined />} value={values.password} onChange={handleChange} onBlur={handleBlur} error={errors.password} touched={touched.password} className="mb-4" />
            
            <div className="auth-form-actions">
              <CommonCheckbox label="Remember me" name="remember" checked={values.remember} />
              <Link to={ROUTES.FORGOT_PASSWORD.BASE} className="universal-forgot">Forgot password?</Link>
            </div>

            <CommonButton htmlType="submit" loading={isSubmitting} block size="large" icon={!isSubmitting && <RocketOutlined />}>
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </CommonButton>
          </Form>
        )}
      </Formik>
      
       <div style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)' }}>
        Don't have an account? <Link to={ROUTES.AUTH.REGISTER} className="universal-forgot">Sign Up</Link>
      </div>
    </>
  );
};

export default Login;