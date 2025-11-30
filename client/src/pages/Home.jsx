import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
const Home = () => {
  const { setSignUpStep, setToken, navigate, toastSuccess } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setToken('');
    navigate('/login');
    setSignUpStep(1)
    toast.success("Logged out successfully", {...toastSuccess});
  }
  return (
    <div>
      <h1 className='home-title'>Home Page</h1>
      <button type='button' onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Home
