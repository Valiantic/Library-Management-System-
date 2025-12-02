import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// Get dashboard statistics
export const getDashboardStats = async () => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${API_URL}/api/dashboard/stats`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch dashboard stats'
        };
    }
};
