import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Home = () => {
  const { setToken, navigate, toastSuccess } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    navigate('/login');
    toast.success("Logged out successfully", {...toastSuccess});
  }
  return (
    <div>
      <h1>Home Page ng mga niggers</h1>
      <button type='button' onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Home
