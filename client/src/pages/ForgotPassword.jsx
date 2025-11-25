import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm.jsx';
import ForgotPasswordVerification from '../components/auth/ForgotPasswordVerification.jsx';
import ForgotPasswordReset from '../components/auth/ForgotPasswordReset.jsx'

export default function ForgotPassword() {
  const { forgotPasswordStep } = useContext(AuthContext);

  return (
    <>
      {forgotPasswordStep === 1 && <ForgotPasswordForm />}
      {forgotPasswordStep === 2 && <ForgotPasswordVerification />}
      {forgotPasswordStep === 3 && <ForgotPasswordReset />}
    </>
  );
}
