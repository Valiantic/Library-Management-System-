import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// ADD NEW BOOK
export const addBook = async (bookData) => {
    try {
        const response = await axios.post(`${API_URL}/api/book/add`, bookData);
        return response.data;
    } catch (error) {
        console.error('Error adding book:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to add book'
        };
    }
};

// GET ALL BOOKS
export const getAllBooks = async (searchQuery = '', showArchived = false) => {
    try {
        const response = await axios.get(`${API_URL}/api/book/all`, {
            params: { search: searchQuery, showArchived: showArchived }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching books:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch books',
            books: []
        };
    }
};

// GET BOOK BY ID
export const getBookById = async (bookId) => {
    try {
        const response = await axios.get(`${API_URL}/api/book/${bookId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching book:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch book'
        };
    }
};

// UPDATE BOOK
export const updateBook = async (bookId, bookData) => {
    try {
        const response = await axios.put(`${API_URL}/api/book/update/${bookId}`, bookData);
        return response.data;
    } catch (error) {
        console.error('Error updating book:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to update book'
        };
    }
};

// DELETE BOOK
export const deleteBook = async (bookId) => {
    try {
        const response = await axios.delete(`${API_URL}/api/book/delete/${bookId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting book:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to delete book'
        };
    }
};

// TOGGLE BOOK STATUS (Archive/Unarchive)
export const toggleBookStatus = async (bookId) => {
    try {
        const response = await axios.put(`${API_URL}/api/book/toggle-status/${bookId}`);
        return response.data;
    } catch (error) {
        console.error('Error toggling book status:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to update book status'
        };
    }
};


// GET ALL ACTIVE BOOKS
export const getAllActiveBooks = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/api/book/all/active`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching books:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch books',
            activeBooks: []
        };
    }
};


// ADD BORROW BOOK
export const addBorrowBooks = async (token, booksBorrow) => {
    try {
        const response = await axios.post(`${API_URL}/api/book/borrow/add`, booksBorrow, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error borrowing book:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to borrow book'
        };
    }
};


// GET ALL ACTIVE BOOKS
export const getAllBorrowedBooks = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/api/book/borrow/get`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching books:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch books',
            borrowedBooks: []
        };
    }
};

