import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import axios from 'axios'

export const AuthContext = createContext();

export function AuthProvider({children}) {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [token, setToken] = useState(() => localStorage.getItem('authToken') || '');
  const [passwordResetSessionToken, setPasswordResetSessionToken] = useState(() => localStorage.getItem('passwordResetSessionToken') || '');

  const [openSideBar, setOpenSideBar] = useState(false);

  // User state for session management
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [studentInfo, setStudentInfo] = useState(null);

  const [forgotPasswordStep, setForgotPasswordStep] = useState(1);

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
        console.error(error);
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
        console.error(error);
        toast.error(error.message, {...toastError});
        return false;
    }
  };


  // STEP #1: LOGIN PROCESS
  const handleLogin = async (userName, password) => {
    try {
      const formData = {
        userName, 
        password
      };

      const response = await axios.post(backendUrl + "/api/user/login", formData);
      if (response.data.success) {
        toast.success(response.data.message, {...toastSuccess});
        setToken(response.data.token);
        localStorage.setItem("authToken", response.data.token);

      } else {
        toast.error(response.data.message, {...toastError});
      }
    } catch (error) {
        console.error(error);
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
        console.error(error);
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
        console.error(error);
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
        console.error(error);
        toast.error(error.message, {...toastError});
    }
  };


  const handleFetchStudentInfo = async() => {
    try {
        const response = await axios.get(`${backendUrl}/api/user/student`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          setStudentInfo(response.data.user);
        }
    } catch (error) {
        console.log(error);
    }
  }
  useEffect(() => {
      if (token) {
          handleFetchStudentInfo();
      }
  }, [token]);



  // USER TOKEN
  useEffect(() => {
      if (token) {
        localStorage.setItem('authToken', token);
      } else {
        localStorage.removeItem('authToken');
      }

      if (passwordResetSessionToken) {
        localStorage.setItem('passwordResetSessionToken', passwordResetSessionToken);
      } else {
        localStorage.removeItem('passwordResetSessionToken');
      }
  }, [token, passwordResetSessionToken]);

  // Fetch user info when token changes
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!token) {
        setUser(null);
        setUserLoading(false);
        return;
      }
      
      try {
        setUserLoading(true);
        const response = await axios.get(backendUrl + "/api/user/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success && response.data.user) {
          setUser(response.data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        setUser(null);
      } finally {
        setUserLoading(false);
      }
    };

    fetchUserInfo();
  }, [token, backendUrl]);

  // Logout function
  const handleLogout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('loginSessionToken');
    localStorage.removeItem('passwordResetSessionToken');
    toast.success("Logged out successfully", {...toastSuccess});
    navigate('/login');
  };


  /*-----------------------TOAST---------------------*/
  const toastSuccess = {
      position: "top-center", autoClose: 3000, hideProgressBar: true, closeOnClick: false, pauseOnHover: false, draggable: true, progress: 0, theme: "light", transition: Bounce
  }
  const toastError = {
      position: "top-center", autoClose: 3000, hideProgressBar: true, closeOnClick: false, pauseOnHover: false, draggable: true, progress: 0, theme: "light", transition: Bounce
  }

  const value = {
    navigate, toastSuccess, toastError, signUpStep, setSignUpStep, signUpData, setSignUpData, handleSignUpStepOne, handleSignUpStepTwo, token, setToken, loginData, setLoginData, handleLogin, forgotPasswordStep, setForgotPasswordStep, handleForgotPasswordStepOne, handleForgotPasswordStepTwo, handleForgotPasswordStepThree, passwordResetSessionToken, user, setUser, userLoading, handleLogout, openSideBar, setOpenSideBar, studentInfo, setStudentInfo
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
