import { type FC } from 'react';
import { LockOutlined, RocketOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { ROUTES } from '@/Constants';
import { CommonButton, CommonValidationTextField } from '@/Attribute';
import { Mutations } from '@/Api/Mutations';
import { useAppDispatch } from '@/Store/hooks';
import { setSignin as setCredentials } from '@/Store';
import { VerifyOtpSchema } from '@/Utils';

const VerifyOtp: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const email = ((location.state as any)?.email || '').trim().toLowerCase();
  const type = (location.state as any)?.type || 'forgot';
  const { mutateAsync: verifyOtp, isPending } = Mutations.useVerifyOtp();
  const { mutateAsync: resendOtp, isPending: isResending } = Mutations.useResendOtp();

  return (
    <>
      <div className="auth-header">
        <h2 className="auth-title">Verify OTP</h2>
        <p className="auth-subtitle">Enter the 4-digit code sent to {email}</p>
      </div>
      <Formik
        initialValues={{ otp: '' }}
        validationSchema={VerifyOtpSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const response = await verifyOtp({ email, otp: values.otp });

            if (type === 'forgot') {
              navigate(ROUTES.AUTH.RESET_PASSWORD, { state: { email } });
            } else {
              dispatch(setCredentials(response.data));
              navigate(ROUTES.DASHBOARD);
            }
          } catch (error) {
              console.log(error);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
          <Form>
            <CommonValidationTextField required name="otp" placeholder="Enter OTP" startIcon={<LockOutlined />} value={values.otp} onChange={handleChange} onBlur={handleBlur} error={errors.otp} touched={touched.otp} className="mb-4" />
            <CommonButton htmlType="submit" loading={isSubmitting || isPending} block size="large" icon={!isSubmitting && !isPending && <RocketOutlined />} >
              {isSubmitting || isPending ? 'Verifying...' : 'Verify OTP'}
            </CommonButton>
          </Form>
        )}
      </Formik>
      <div className="auth-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Link to={ROUTES.AUTH.LOGIN} className="auth-link">Back to Sign In</Link>
        <button type="button" className="auth-link" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-color)' }} onClick={async () => { try { await resendOtp({ email }); } catch (error) { console.log(error); } }} disabled={isResending || !email} >
          {isResending ? 'Resending...' : 'Resend OTP'}
        </button>
      </div>
    </>
  );
};

export default VerifyOtp;
