import React, { useContext } from 'react'
import { GoPersonFill } from "react-icons/go";
import { FaGear } from "react-icons/fa6";
import { AuthContext } from '../context/AuthContext';


const TopBar = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="w-full h-18 bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 flex items-center px-8">
            <div className="w-full flex items-center justify-between">
                <div className="flex items-center relative z-10 ml-[48px] md:ml-0">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                        <GoPersonFill className="text-2xl" />
                    </div>
                    <div className="ml-3.5">
                        <h2 className="text-sm font-bold text-slate-900 leading-none">
                            {user ? `${user.firstName} ${user.lastName}` : "Guest"}
                        </h2>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1 block">
                            {user ? user.role : "Library Member"}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="p-2 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors">
                        <FaGear className="text-xl" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TopBar