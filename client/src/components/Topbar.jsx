import React, { useContext } from 'react'
import { GoPersonFill } from "react-icons/go";
import { FaGear } from "react-icons/fa6";
import { AuthContext } from '../context/AuthContext';


const TopBar = () => {
    const { user } = useContext(AuthContext);

return (
    <div className="w-full h-16 bg-white shadow-md flex items-center px-6">
        <div className="w-full flex items-center justify-between">
            <div className="flex items-center relative z-10 ml-[56px] md:ml-0">
                <GoPersonFill className="text-4xl text-black"/>
                <div className="ml-4">
                    <h2 className="text-lg font-bold text-gray-800">
                        {user ? `${user.firstName} ${user.lastName}` : "Guest"}
                    </h2>
                    <span className="text-gray-800 font-medium">
                        {user ? user.role : ""}
                    </span>
                </div>
            </div>

            <FaGear className="text-2xl text-gray-600 cursor-pointer mr-4 md:mr-0"/>
        </div>
    </div>
)
}

export default TopBar