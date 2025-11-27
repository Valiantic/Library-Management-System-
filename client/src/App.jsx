
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import SignUp from './pages/SignUp.jsx'
import SignUpVerification from './components/auth/SignUpVerification.jsx';
import Home from './pages/Home.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext.jsx';
import Login from './pages/Login.jsx'
import LoginVerification from './components/auth/LoginVerification.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx'
import ForgotPasswordVerification from './components/auth/ForgotPasswordVerification.jsx'
import ForgotPasswordReset from './components/auth/ForgotPasswordReset.jsx'
import Dashboard from './pages/Dashboard.jsx';
import Inventory from './pages/Inventory.jsx';
import Membership from './pages/Membership.jsx';

function App() {
  const { token, loginSessionToken, passwordResetSessionToken } = useContext(AuthContext);
  const cannotResetPassword = token || !passwordResetSessionToken;

  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />


        {/* Public Routes */}
        <Route path="/login" element={token ? <Navigate to="/home" replace /> : <Login />} />
        <Route path="/login/verification" element={token ? <Navigate to="/home" replace /> : !loginSessionToken ? <Navigate to="/login" replace /> : <LoginVerification />} />
        <Route path="/signup" element={token ? <Navigate to="/home" replace /> : <SignUp />} />
        <Route path="/signup/verification" element={token ? <Navigate to="/home" replace /> : <SignUpVerification />} />
        <Route path="/forgot-password" element={token ? <Navigate to="/home" replace /> : <ForgotPassword />} />
        <Route path="/forgot-password/verification" element={token ? <Navigate to="/home" replace /> : <ForgotPasswordVerification />} />
        <Route path="/forgot-password/reset-password" element={cannotResetPassword ? <Navigate to="/login" replace /> : <ForgotPasswordReset />} />

        {/* Protected Route */}
        {/* <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>}/> */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="membership" element={<Membership />} />
          <Route path="*" element={<h1>404 not found</h1>} />
        </Route>

        <Route path="*" element={token ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />} />


      </Routes>
    </div>
  )
}

export default App


