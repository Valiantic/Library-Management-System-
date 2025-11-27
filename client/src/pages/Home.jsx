import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Outlet } from 'react-router-dom';
import SideMenu from '../components/SideMenu';
import Navigation from '../components/Navigation';

const Home = () => {
  const { setLoginStep, setSignUpStep, setToken, navigate, toastSuccess } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    navigate('/login');
    setLoginStep(1);
    setSignUpStep(1)
    toast.success("Logged out successfully", { ...toastSuccess });
  }
  return (
    <div className='flex min-h-[700px] h-screen'>
      <SideMenu handleLogout={handleLogout} />
      <div className='flex flex-col grow'>
        <Navigation />
        <Outlet />
      </div>
    </div>
  )
}

export default Home
