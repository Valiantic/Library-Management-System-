import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import LoginForm from '../components/auth/LoginForm.jsx'
import LoginVerification from "../components/auth/LoginVerification";

export default function Login() {
  const { loginStep } = useContext(AuthContext);

  return (
    <>
      {loginStep === 1 && <LoginForm />}
      {loginStep === 2 && <LoginVerification />}
    </>
  );
}
