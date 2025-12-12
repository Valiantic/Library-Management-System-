import React, { useState, useEffect } from 'react';
import { IoSettingsSharp } from 'react-icons/io5';
import { FaUser } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';

const Navbar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time (12:29 PM)
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Format date (Sep 02, 2023)
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCancel = () => {
    setShowCredentialsModal(false);
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleConfirm = () => {
    // Add your password change logic here
    console.log('Password change confirmed', formData);
    handleCancel();
  };

  return (
    <>
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-4 py-3 sm:px-6 lg:px-8 pl-6">
        <div className="flex items-center justify-between">
          {/* Left Section - User Info */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
              <FaUser className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-semibold truncate">Sample Name</h2>
              <p className="text-xs sm:text-sm text-gray-600 truncate">Student</p>
            </div>
          </div>

          {/* Right Section - Time/Date and Settings */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Time and Date */}
            <div className="text-right">
              <p className="text-sm sm:text-base font-semibold">{formatTime(currentTime)}</p>
              <p className="text-xs sm:text-sm text-gray-600">{formatDate(currentTime)}</p>
            </div>

            {/* Settings Icon */}
            <button
              onClick={() => setShowCredentialsModal(true)}
              className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              aria-label="Settings"
            >
                <span> <IoSettingsSharp className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900" /></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Change Credentials Modal */}
      {showCredentialsModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md sm:max-w-lg max-h-screen overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <IoSettingsSharp className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-semibold">Change Credentials</h2>
              </div>
              <button
                onClick={handleCancel}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close"
              >
                <span><IoMdClose className="w-5 h-5" /></span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Current Password */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label className="text-sm sm:text-base font-medium sm:w-48 flex-shrink-0">
                  Enter Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  placeholder="Enter Current Password"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm sm:text-base"
                />
              </div>

              {/* New Password */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label className="text-sm sm:text-base font-medium sm:w-48 flex-shrink-0">
                  Enter New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="Enter New Password"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm sm:text-base"
                />
              </div>

              {/* Confirm New Password */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label className="text-sm sm:text-base font-medium sm:w-48 flex-shrink-0">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm New Password"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 flex gap-3 sm:gap-4">
              <button
                onClick={handleCancel}
                className="flex-1 px-6 py-3 bg-gray-300 hover:bg-gray-400 text-black font-semibold rounded-lg transition-colors text-sm sm:text-base"
              >
                CANCEL
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-6 py-3 text-white font-semibold rounded-lg transition-colors text-sm sm:text-base"
                style={{ backgroundColor: '#000000' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1f2937'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000000'}
              >
                CONFIRM
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;