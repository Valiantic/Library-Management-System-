import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import { MdDashboard, MdInventory, MdPeople, MdLogout, MdMenu, MdArrowBack } from "react-icons/md";

export default function Sidebar() {
  const { handleLogout, navigate } = useContext(AuthContext);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: <MdDashboard /> },
    { path: "/inventory", label: "Inventory", icon: <MdInventory /> },
    { path: "/membership", label: "Membership", icon: <MdPeople /> },
  ];

  const isActive = (path) => location.pathname === path;

  const handleNavClick = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Button (Mobile, when sidebar is closed) */}
      {!isOpen && (
        <button
          className="md:hidden fixed top-4 left-4 z-50 text-white bg-black bg-opacity-80 rounded-md p-2 flex items-center justify-center focus:outline-none"
          onClick={() => setIsOpen(true)}
          aria-label="Open sidebar"
        >
          <MdMenu className="text-2xl" />
        </button>
      )}

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/70 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar / Mobile Menu */}
      <div className={`
        fixed md:static top-0 left-0 z-40
        w-64 md:w-52 lg:w-60
        h-screen
        bg-black flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Mobile Back Button (Inside Sidebar, before logo) */}
        {isOpen && (
          <button 
            className="md:hidden mt-4 ml-4 mr-4 mb-2 text-white flex items-center justify-start focus:outline-none"
            onClick={() => setIsOpen(false)}
            aria-label="Close sidebar"
          >
            <MdArrowBack className="text-xl" />
          </button>
        )}

        {/* Logo */}
        <div className="flex flex-col items-center justify-center py-10 px-6 border-b border-gray-800 mt-2">
          <h1 className="text-white font-bold">CHIGGAS</h1>
          <p className="text-gray-500 text-xs tracking-widest mt-2 uppercase">Library</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-1 p-4 mt-12 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              className={`
                flex items-center gap-4 py-4 px-5 rounded-lg
                transition-all duration-200 text-left w-full
                ${isActive(item.path)
                  ? "bg-white text-white"
                  : "text-white hover:bg-transparent"
                }
              `}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm lg:text-base font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 mb-8">
          <button
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
            className="flex items-center gap-4 py-4 px-5 rounded-lg text-white hover:bg-transparent transition-all duration-200 w-full text-left"
          >
            <MdLogout className="text-xl" />
            <span className="text-sm lg:text-base font-medium">Log Out</span>
          </button>
        </div>
      </div>
    </>
  );
}
