import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export const getAllUsers = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/api/user/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to fetch users' };
  }
};

export const addMember = async (form, token) => {
  try {
    const response = await axios.post(`${API_URL}/api/user/add`, form, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to add user' };
  }
};

export const editMember = async (userId, form, token) => {
  try {
    const response = await axios.put(`${API_URL}/api/user/update/${userId}`, form, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to update user' };
  }
};

export const toggleUserStatus = async (userId, token) => {
  try {
    const response = await axios.put(`${API_URL}/api/user/toggle-status/${userId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to update user status' };
  }
};

export const updateStudentPassword = async (form, token) => {
    try {
      const response = await axios.patch(`${API_URL}/api/user/update/students/password`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;

    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update password"
      };
    }
};
