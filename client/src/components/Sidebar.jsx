import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import { MdDashboard, MdInventory, MdPeople, MdLogout, MdMenu, MdClose } from "react-icons/md";

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
          className="md:hidden fixed top-4 left-4 z-50 bg-black text-black rounded-lg p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          onClick={() => setIsOpen(true)}
          aria-label="Open sidebar"
        >
          <MdMenu className="text-2xl" />
        </button>
      )}

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar / Mobile Menu */}
      <div className={`
        fixed top-0 left-0 z-50
        w-72 md:w-64 lg:w-72
        h-full min-h-screen
        bg-gradient-to-b from-[#111827] to-[#030712]
        flex flex-col
        transform transition-transform duration-300 ease-in-out
        shadow-2xl border-r border-white/5
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Mobile Close Button */}
        {isOpen && (
          <button
            className="md:hidden absolute top-4 right-4 text-white/50 hover:text-white bg-white/5 rounded-lg p-2 transition-all duration-200 hover:bg-white/10"
            onClick={() => setIsOpen(false)}
            aria-label="Close sidebar"
          >
            <MdClose className="text-xl" />
          </button>
        )}

        {/* Logo Section */}
        <div className="flex flex-col items-center justify-center py-12 px-8 border-b border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-blue-500/5 blur-3xl rounded-full -translate-y-1/2"></div>
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all hover:scale-110 hover:rotate-3 duration-500 relative z-10">
            <span className="bg-gradient-to-br from-blue-600 to-indigo-700 bg-clip-text text-transparent font-black text-3xl">A</span>
          </div>
          <h1 className="text-white font-black text-2xl tracking-tight text-center leading-tight relative z-10">
            Aurevia
          </h1>
          <p className="text-blue-400/40 text-[10px] tracking-[0.3em] mt-2 uppercase font-black relative z-10">Management System</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-2 p-6 mt-8 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`
                  group relative flex items-center gap-4 py-3.5 px-6 rounded-2xl
                  transition-all duration-500 text-left w-full
                  ${active
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_10px_25px_-5px_rgba(59,130,246,0.4)] scale-[1.02]"
                    : "text-white/40 hover:bg-white/5 hover:text-white"
                  }
                `}
              >
                {/* Active Glow Effect */}
                {active && (
                  <div className="absolute inset-0 bg-blue-400 opacity-20 blur-xl rounded-2xl transform scale-90 group-hover:scale-110 transition-transform duration-700"></div>
                )}

                {/* Icon */}
                <span className={`
                  text-2xl transition-all duration-300 relative z-10
                  ${active ? "text-white drop-shadow-md" : "text-white/30 group-hover:text-white group-hover:scale-110"}
                `}>
                  {item.icon}
                </span>

                {/* Label */}
                <span className={`
                  text-[15px] font-black tracking-wide transition-all duration-300 relative z-10
                  ${active ? "text-white" : "text-white/40 group-hover:text-white"}
                `}>
                  {item.label}
                </span>

                {/* Active Indicator Dot */}
                {active && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white] relative z-10 animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-6 border-t border-white/5 bg-black/20 backdrop-blur-sm">
          <button
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
            className="group flex items-center gap-4 py-4 px-6 rounded-2xl text-white/30 hover:bg-red-500/10 hover:text-red-400 transition-all duration-500 w-full text-left"
          >
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center transition-all group-hover:bg-red-500/10">
              <MdLogout className="text-xl group-hover:-translate-x-1 transition-transform duration-300" />
            </div>
            <span className="text-[14px] font-black tracking-widest uppercase">Log Out</span>
          </button>
        </div>
      </div>
    </>
  );
}
