
import './App.css'
import {Routes, Route, Navigate} from 'react-router-dom'
import { ToastContainer} from 'react-toastify';
import SignUp from './pages/SignUp.jsx'
import SignUpVerification from './components/auth/SignUpVerification.jsx';
import Home from './pages/Home.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext.jsx';

function App() {
  const { token } = useContext(AuthContext);

  return (
    <div>
      <ToastContainer/>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />}/>
        {/* Public Routes */}
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/signup/verification" element={<SignUpVerification/>}/>
        {/* Protected Route */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>}/>
      </Routes>
    </div>
  )
}

export default App


