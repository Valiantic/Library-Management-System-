import React, { useContext, useState } from "react";
import { AiFillHome } from "react-icons/ai";
import { MdOutlineMenuBook } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import { FaCompass } from "react-icons/fa";
import { FaRegArrowAltCircleRight, FaRegArrowAltCircleLeft } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

const Sidebar = () => {
  const { setToken, toastSuccess } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState("home");
  const [isOpen, setIsOpen] = useState(true); 

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setToken('');
    navigate('/login');
    setSignUpStep(1)
    toast.success("Logged out successfully", {...toastSuccess});
  }

  return (
    <div
      className={`fixed left-0 top-0 h-screen 
      ${isOpen ? "w-16" : "w-6"} 
      bg-black text-white flex flex-col justify-between z-50 transition-all duration-300`}
    >

      {/* TOGGLE ARROW */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-80 bg-white text-black w-6 h-10 border border-black rounded-full flex items-center justify-center cursor-pointer"
      >
        <span>{isOpen ? <FaRegArrowAltCircleLeft className="w-6 h-6"/> : <FaRegArrowAltCircleRight className="w-6 h-6"/>}</span>
      </button>

      {/* NAVIGATION (Show only when open) */}
      {isOpen && (
        <div className="flex flex-col items-center mt-4 space-y-6">

          {/* Home */}
          <button
            onClick={() => setActiveTab("home")}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-black"
          >
            <span><AiFillHome className="w-6 h-6" /></span>
          </button>

          {/* Returned */}
          <button
            onClick={() => setActiveTab("returned")}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-black"
          >
            <span><FaCompass className="w-6 h-6" /></span>
          </button>

          {/* Borrow */}
          <button
            onClick={() => setActiveTab("borrow")}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-black"
          >
            <span><MdOutlineMenuBook className="w-6 h-6" /></span>
          </button>

        </div>
      )}

      {/* LOGOUT (Hidden when closed) */}
      {isOpen && (
        <div className="flex items-center justify-center mb-6">
          <button onClick={handleLogout} className="w-10 h-10 flex items-center justify-center rounded-xl text-black bg-white">
            <span><IoLogOut className="w-5 h-5" /></span>
          </button>
        </div>
      )}

    </div>
  );
};

export default Sidebar;