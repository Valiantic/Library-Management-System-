import Books from '../model/Book.js';
import { Op } from 'sequelize';

// ADD NEW BOOK
export const addBookService = async (bookName, author, category, quantity) => {
    try {
        // Validate input
        if (!bookName || !author || !category || quantity === undefined) {
            return {
                success: false,
                message: 'All fields are required'
            };
        }

        // Validate quantity is a positive number
        if (quantity < 0 || !Number.isInteger(Number(quantity))) {
            return {
                success: false,
                message: 'Quantity must be a positive integer'
            };
        }

        // Create new book
        const newBook = await Books.create({
            bookName: bookName.trim(),
            author: author.trim(),
            category: category.trim(),
            quantity: Number(quantity)
        });

        return {
            success: true,
            message: 'Book added successfully',
            book: {
                bookId: newBook.bookId,
                bookName: newBook.bookName,
                author: newBook.author,
                category: newBook.category,
                quantity: newBook.quantity,
                createdAt: newBook.createdAt
            }
        };
    } catch (error) {
        console.error('Error in addBookService:', error);
        return {
            success: false,
            message: 'Failed to add book'
        };
    }
};

// GET ALL BOOKS
export const getAllBooksService = async (searchQuery = '') => {
    try {
        let whereClause = {};

        if (searchQuery && searchQuery.trim() !== '') {
            whereClause = {
                [Op.or]: [
                    { bookName: { [Op.like]: `%${searchQuery.trim()}%` } },
                    { author: { [Op.like]: `%${searchQuery.trim()}%` } },
                    { category: { [Op.like]: `%${searchQuery.trim()}%` } }
                ]
            };
        }

        const books = await Books.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']],
            attributes: ['bookId', 'bookName', 'author', 'category', 'quantity', 'createdAt', 'updatedAt']
        });

        return {
            success: true,
            books: books,
            count: books.length
        };
    } catch (error) {
        console.error('Error in getAllBooksService:', error);
        return {
            success: false,
            message: 'Failed to fetch books',
            books: []
        };
    }
};

// GET BOOK BY ID
export const getBookByIdService = async (bookId) => {
    try {
        const book = await Books.findByPk(bookId);

        if (!book) {
            return {
                success: false,
                message: 'Book not found'
            };
        }

        return {
            success: true,
            book: book
        };
    } catch (error) {
        console.error('Error in getBookByIdService:', error);
        return {
            success: false,
            message: 'Failed to fetch book'
        };
    }
};

// UPDATE BOOK
export const updateBookService = async (bookId, bookName, author, category, quantity) => {
    try {
        const book = await Books.findByPk(bookId);

        if (!book) {
            return {
                success: false,
                message: 'Book not found'
            };
        }

        // Validate quantity if provided
        if (quantity !== undefined && (quantity < 0 || !Number.isInteger(Number(quantity)))) {
            return {
                success: false,
                message: 'Quantity must be a positive integer'
            };
        }

        // Update book
        await book.update({
            bookName: bookName?.trim() || book.bookName,
            author: author?.trim() || book.author,
            category: category?.trim() || book.category,
            quantity: quantity !== undefined ? Number(quantity) : book.quantity
        });

        return {
            success: true,
            message: 'Book updated successfully',
            book: book
        };
    } catch (error) {
        console.error('Error in updateBookService:', error);
        return {
            success: false,
            message: 'Failed to update book'
        };
    }
};

// DELETE BOOK
export const deleteBookService = async (bookId) => {
    try {
        const book = await Books.findByPk(bookId);

        if (!book) {
            return {
                success: false,
                message: 'Book not found'
            };
        }

        await book.destroy();

        return {
            success: true,
            message: 'Book deleted successfully'
        };
    } catch (error) {
        console.error('Error in deleteBookService:', error);
        return {
            success: false,
            message: 'Failed to delete book'
        };
    }
};
