import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// GET ALL BOOKS
export const getAllBorrowedBooks = async (token, payload) => {
    try {
        const response = await axios.get(
            `${API_URL}/api/borrowedbook/all`,
            {
                params: payload,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching borrowed books:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch borrowed books',
            books: []
        };
    }
};

// RETURN BORROWED BOOKS
export const returnBorrowedBooks = async (borrowedBookId) => {
    try {
        const response = await axios.put(`${API_URL}/api/borrowedbook/return/${borrowedBookId}`);
        return response.data;
    } catch (error) {
        console.error('Error returning borrowed books:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to return borrowed books',
        };
    }
}