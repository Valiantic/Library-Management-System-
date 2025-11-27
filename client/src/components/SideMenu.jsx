import { Link } from 'react-router-dom';
import logout_icon from '../assets/logout.svg';
import dashboard_icon from '../assets/dashboard-icon.svg'
import inventory_icon from '../assets/inventory-icon.svg'
import membership_icon from '../assets/membership-icon.svg'
import logo from '../assets/logo.png'

export default function SideMenu({ handleLogout }) {

    return (
        <div className="flex flex-col bg-black text-white md:w-[200px] min-w-fit">
            <Link to='dashboard' className='text-2xl text-center px-2 py-8 font-semibold'>
                <span className='max-md:hidden'>CHIGGAS</span>
                <img className='md:hidden h-6 aspect-square' src={logo} alt="" />
            </Link>
            <nav className='flex flex-col grow'>
                <Link
                    to="dashboard"
                    className="group flex gap-2 p-2 cursor-pointer duration-250 hover:bg-white hover:text-black"
                >
                    <img src={dashboard_icon} alt="" className="duration-250 group-hover:invert" />
                    <p className='max-md:hidden'>Dashboard</p>
                </Link>
                <Link
                    to="inventory"
                    className="group flex gap-2 p-2 cursor-pointer duration-250 hover:bg-white hover:text-black"
                >
                    <img src={inventory_icon} alt="" className="duration-250 group-hover:invert" />
                    <p className='max-md:hidden'>Inventory</p>
                </Link>
                <Link
                    to="membership"
                    className="group flex gap-2 p-2 cursor-pointer duration-250 hover:bg-white hover:text-black"
                >
                    <img src={membership_icon} alt="" className="duration-250 group-hover:invert" />
                    <p className='max-md:hidden'>Membership</p>
                </Link>
            </nav>
            <button
                onClick={handleLogout}
                className="flex gap-2 cursor-pointer w-fit mx-auto mb-8"
            >
                <img src={logout_icon} alt="" />
                <p className='max-md:hidden'>Logout</p>
            </button>
        </div>
    );
} 