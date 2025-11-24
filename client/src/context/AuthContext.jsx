import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import axios from 'axios'

export const AuthContext = createContext();

export function AuthProvider({children}) {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [token, setToken] = useState(() => localStorage.getItem('authToken') || '');
  const [loginSessionToken, setLoginSessionToken] = useState(() => localStorage.getItem('loginSessionToken') || '');
  const [passwordResetSessionToken, setPasswordResetSessionToken] = useState(() => localStorage.getItem('passwordResetSessionToken') || '');

  const [forgotPasswordStep, setForgotPasswordStep] = useState(1);

  const [loginStep, setLoginStep] = useState(1);
  const [loginData, setLoginData] = useState({
    userName: "",
    password: "",
  });
  const [signUpStep, setSignUpStep] = useState(1);
  const [signUpData, setSignUpData] = useState({
      // STEP #1 
      firstName: "",
      lastName: "",
      emailAddress: "",
      userName: "",
      password: "",

      // STEP #2
      registerKey: ''
  })

  // STEP #1: SIGN UP
  const handleSignUpStepOne = async (firstName, lastName, emailAddress, userName, password) => {
    try {
      // CREATE ACCOUNT
      const formData = {
        firstName, 
        lastName, 
        emailAddress, 
        userName, 
        password
      };

      const response = await axios.post(backendUrl + "/api/user/register", formData);
      if (response.data.success) {
        toast.success(response.data.message, {...toastSuccess});
        setSignUpData(prev => ({
          ...prev,
          firstName,
          lastName,
          emailAddress,
          userName,
          password,
          registerKey: response.data.registerKey,
        }));

        setSignUpStep(2);
      } else {
        toast.error(response.data.message, {...toastError});
      }
    } catch (error) {
        console.log(error);
        toast.error(error.message, {...toastError});
    }
  };

  // STEP #2: SIGN UP
  const handleSignUpStepTwo = async (registerKey, verificationCode) => {
    try {
      // CREATE ACCOUNT
      const formData = {
        registerKey, 
        verificationCode
      };

      const response = await axios.post(backendUrl + "/api/user/register/verification", formData);
      if (response.data.success) {
        toast.success(response.data.message, {...toastSuccess});
          setSignUpData({
            firstName: "",
            lastName: "",
            emailAddress: "",
            userName: "",
            password: "",
            registerKey: "",
          });

          localStorage.setItem("authToken", response.data.token);
          setToken(response.data.token);

          return true;   
        
      } else {
        toast.error(response.data.message, {...toastError});
        return false;   
      }
    } catch (error) {
        console.log(error);
        toast.error(error.message, {...toastError});
        return false;
    }
  };


  // STEP #1: LOGIN PROCESS
  const handleLoginStepOne = async (userName, password) => {
    try {
      const formData = {
        userName, 
        password
      };

      const response = await axios.post(backendUrl + "/api/user/login", formData);
      if (response.data.success) {
        setLoginSessionToken(response.data.loginSessionToken);
        if (loginSessionToken) {
          localStorage.setItem("loginSessionToken", loginSessionToken);
        }

        toast.success(response.data.message, {...toastSuccess});
        navigate('/login/verification')

        setLoginStep(2);
      } else {
        toast.error(response.data.message, {...toastError});
      }
    } catch (error) {
        console.log(error);
        toast.error(error.message, {...toastError});
    }
  };


  // STEP #2: LOGIN PROCESS
  const handleLoginStepTwo = async (loginSessionToken, verificationCode) => {
    try {
      const formData = {
        loginSessionToken, 
        verificationCode
      };

      const response = await axios.post(backendUrl + "/api/user/login/verification", formData);
      if (response.data.success) {
        setLoginData({ userName: "", password: "" });
        setLoginSessionToken('');
        localStorage.removeItem('loginSessionToken');

        setToken(response.data.token);
        localStorage.setItem("authToken", response.data.token);
        
        toast.success(response.data.message, {...toastSuccess});
        navigate('/home')

      } else {
        toast.error(response.data.message, {...toastError});
      }
    } catch (error) {
        console.log(error);
        toast.error(error.message, {...toastError});
    }
  };


  // STEP #1: FORGOT PASSWORD
  const handleForgotPasswordStepOne = async (emailAddress) => {
    try {

      const response = await axios.post(backendUrl + "/api/user/forgot-password", {emailAddress});
      if (response.data.success) {
        toast.success(response.data.message, {...toastSuccess});

        setForgotPasswordStep(2);
        navigate("/forgot-password/verification");

      } else {
        toast.error(response.data.message, {...toastError});
      }
    } catch (error) {
        console.log(error);
        toast.error(error.message, {...toastError});
    }
  };

  // STEP #2: FORGOT PASSWORD
  const handleForgotPasswordStepTwo = async (verificationCode) => {
    try {

      const response = await axios.post(backendUrl + "/api/user/forgot-password/verification", {verificationCode});
      if (response.data.success) {
        toast.success(response.data.message, {...toastSuccess});

        setPasswordResetSessionToken(response.data.passwordResetSessionToken);
        if (passwordResetSessionToken) {
          localStorage.setItem("passwordResetSessionToken", passwordResetSessionToken);
        }

        setForgotPasswordStep(3);
        navigate("/forgot-password/reset-password");

      } else {
        toast.error(response.data.message, {...toastError});
      }
    } catch (error) {
        console.log(error);
        toast.error(error.message, {...toastError});
    }
  };

  // STEP #3: FORGOT PASSWORD
  const handleForgotPasswordStepThree = async (newPassword, passwordResetSessionToken) => {
    try {
      const response = await axios.post(backendUrl + "/api/user/forgot-password/reset", {newPassword, passwordResetSessionToken});
      if (response.data.success) {
        toast.success(response.data.message, {...toastSuccess});

        setPasswordResetSessionToken('');
        localStorage.removeItem('passwordResetSessionToken');

        setForgotPasswordStep(1);
        navigate("/login");

      } else {
        toast.error(response.data.message, {...toastError});
      }
    } catch (error) {
        console.log(error);
        toast.error(error.message, {...toastError});
    }
  };



  // USER TOKEN
  useEffect(() => {
      if (token) {
        localStorage.setItem('authToken', token);
      } else {
        localStorage.removeItem('authToken');
      }

      if (loginSessionToken) {
        localStorage.setItem('loginSessionToken', loginSessionToken);
      } else {
        localStorage.removeItem('loginSessionToken');
      }

      if (passwordResetSessionToken) {
        localStorage.setItem('passwordResetSessionToken', passwordResetSessionToken);
      } else {
        localStorage.removeItem('passwordResetSessionToken');
      }
  }, [token, loginSessionToken, passwordResetSessionToken]);


  /*-----------------------TOAST---------------------*/
  const toastSuccess = {
      position: "top-center", autoClose: 3000, hideProgressBar: true, closeOnClick: false, pauseOnHover: false, draggable: true, progress: 0, theme: "light", transition: Bounce
  }
  const toastError = {
      position: "top-center", autoClose: 3000, hideProgressBar: true, closeOnClick: false, pauseOnHover: false, draggable: true, progress: 0, theme: "light", transition: Bounce
  }

  const value = {
    navigate, toastSuccess, toastError, signUpStep, setSignUpStep, signUpData, setSignUpData, handleSignUpStepOne, handleSignUpStepTwo, token, setToken, loginStep, setLoginStep, loginData, setLoginData, handleLoginStepOne, loginSessionToken, setLoginSessionToken, handleLoginStepTwo, forgotPasswordStep, setForgotPasswordStep, handleForgotPasswordStepOne, handleForgotPasswordStepTwo, handleForgotPasswordStepThree, passwordResetSessionToken
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
