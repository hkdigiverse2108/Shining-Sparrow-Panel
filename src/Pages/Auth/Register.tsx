import { type FC } from 'react';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '@/Constants';

const Register: FC = () => {
  return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
};

export default Register;
