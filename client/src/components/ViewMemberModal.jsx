import React from "react";
import { MdClose } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";

export default function ViewMemberModal({ open, onClose, member }) {
  if (!open || !member) return null;

  // Close modal if click on backdrop
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 bg-opacity-40" onMouseDown={handleBackdropClick}>
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative animate-fadeIn" onMouseDown={e => e.stopPropagation()}>
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl focus:outline-none"
          onClick={onClose}
        >
          <MdClose />
        </button>
        <div className="flex flex-col items-center gap-2 mb-6">
          <FaUserCircle className="text-7xl text-blue-500 mb-2" />
          <h3 className="text-xl font-semibold text-gray-800">
            {member.firstName} {member.lastName}
          </h3>
          <span className="text-sm text-gray-500 capitalize">
            {member.role === "admin" || member.role === "superadmin" ? "Admin" : "User"}
          </span>
        </div>
        <div className="space-y-4">
          <div>
            <span className="block text-xs text-gray-400">Email</span>
            <span className="block text-base text-gray-800 font-medium">{member.emailAddress}</span>
          </div>
          <div>
            <span className="block text-xs text-gray-400">Username</span>
            <span className="block text-base text-gray-800 font-medium">{member.userName}</span>
          </div>
          <div>
            <span className="block text-xs text-gray-400">Status</span>
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${member.status === 'archived' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
              {member.status === 'archived' ? 'Archived' : 'Active'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
