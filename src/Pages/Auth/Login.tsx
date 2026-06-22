import { type FC } from 'react';
import { UserOutlined, LockOutlined, RocketOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { ROUTES } from '@/Constants';
import { CommonValidationTextField, CommonButton, CommonCheckbox, showNotification } from '@/Attribute';
import { LoginSchema } from '@/Utils';
import { useAppDispatch } from '@/Store/hooks';
import { setSignin as setCredentials } from '@/Store';
import { Mutations } from '@/Api/Mutations'; 

const Login: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { mutateAsync: signin, isPending } = Mutations.useSignin();
  
  return (
    <>
      <div className="auth-header">
        <h2 className="auth-title">Admin Login</h2>
        <p className="auth-subtitle">Enter your credentials to access your account.</p>
      </div>
      <Formik
        initialValues={{ email: '', password: '', remember: true }}
        validationSchema={LoginSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const response = await signin({ 
              email: values.email, 
              password: values.password,
              userType: "admin"
            });
            
            dispatch(setCredentials(response.data));
            showNotification('success', 'Login Successful');
            navigate(ROUTES.DASHBOARD);
          } catch (error: any) {
            const msg = error?.response?.data?.message || "Login failed";
            showNotification('error', msg); 
          } finally {
            setSubmitting(false);
          }
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
            <CommonButton htmlType="submit" loading={isSubmitting || isPending} block size="large" icon={!isSubmitting && !isPending && <RocketOutlined />} > {isSubmitting || isPending ? 'Signing in...' : 'Sign In'} </CommonButton>
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