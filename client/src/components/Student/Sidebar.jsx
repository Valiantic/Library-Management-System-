import React, { useContext, useState } from "react";
import { AiFillHome } from "react-icons/ai";
import { MdOutlineMenuBook } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import { FaCompass } from "react-icons/fa";
import { FaRegArrowAltCircleRight, FaRegArrowAltCircleLeft } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

const Sidebar = () => {
  const { setToken, toastSuccess, openSideBar, setOpenSideBar } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState("home");

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setToken('');
    navigate('/login');
    setSignUpStep(1)
    toast.success("Logged out successfully", {...toastSuccess});
  }

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-black text-white z-50
        transition-all duration-300
        ${openSideBar ? "w-16" : "w-0 overflow-hidden"}`}
    >

      {/* CLOSE ARROW (ONLY WHEN OPEN) */}
      {openSideBar && (
        <button
          onClick={() => setOpenSideBar(false)}
          className="absolute -right-3 top-90 bg-white text-black w-6 h-10
          border border-black rounded-full flex items-center justify-center cursor-pointer"
          aria-label="Close sidebar"
        >
          <span><FaRegArrowAltCircleLeft className="w-5 h-5" /></span>
        </button>
      )}

      {/* NAVIGATION */}
      {openSideBar && (
        <div className="flex flex-col items-center mt-6 space-y-6">

          <button
            onClick={() => setActiveTab("home")}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-black"
          >
            <span><AiFillHome className="w-6 h-6" /></span>
          </button>

          <button
            onClick={() => setActiveTab("returned")}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-black"
          >
            <span><FaCompass className="w-6 h-6" /></span>
          </button>

          <button
            onClick={() => setActiveTab("borrow")}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-black"
          >
            <span><MdOutlineMenuBook className="w-6 h-6" /></span>
          </button>
        </div>
      )}

      {/* LOGOUT */}
      {openSideBar && (
        <div className="absolute bottom-6 w-full flex justify-center">
          <button
            onClick={handleLogout}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-black"
          >
            <span><IoLogOut className="w-5 h-5" /></span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;