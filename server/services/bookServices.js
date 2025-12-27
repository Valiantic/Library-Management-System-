import Books from '../model/Book.js';
import { Op } from 'sequelize';
import Users from '../model/User.js';
import BorrowedBook from '../model/BorrowedBook.js';
import { sequelize } from '../config/sequelize.js';

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
export const getAllBooksService = async (searchQuery = '', showArchived = false) => {
    try {
        let whereClause = {
            status: showArchived ? 'archived' : 'active'
        };

        if (searchQuery && searchQuery.trim() !== '') {
            whereClause[Op.and] = [
                { status: showArchived ? 'archived' : 'active' },
                {
                    [Op.or]: [
                        { bookName: { [Op.like]: `%${searchQuery.trim()}%` } },
                        { author: { [Op.like]: `%${searchQuery.trim()}%` } },
                        { category: { [Op.like]: `%${searchQuery.trim()}%` } }
                    ]
                }
            ];
            delete whereClause.status;
        }

        const books = await Books.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']],
            attributes: ['bookId', 'bookName', 'author', 'category', 'quantity', 'status', 'createdAt', 'updatedAt']
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

// TOGGLE BOOK STATUS (Archive/Unarchive)
export const toggleBookStatusService = async (bookId) => {
    try {
        const book = await Books.findByPk(bookId);

        if (!book) {
            return {
                success: false,
                message: 'Book not found'
            };
        }

        const newStatus = book.status === 'active' ? 'archived' : 'active';
        await book.update({ status: newStatus });

        return {
            success: true,
            message: newStatus === 'archived' ? 'Book archived successfully' : 'Book unarchived successfully',
            status: newStatus
        };
    } catch (error) {
        console.error('Error in toggleBookStatusService:', error);
        return {
            success: false,
            message: 'Failed to update book status'
        };
    }
};

// GET ALL ACTIVE BOOKS SERVICE
export const getAllActiveBooksService = async (userId) => {
    try {
        const user = await Users.findByPk(userId);
        if (!user) {
            return { 
                success: false, 
                message: "Unauthorized user" 
            };
        }

        const activeBooks = await Books.findAll({
            where: {
                status: 'active', // or isActive: true
            },
            order: [['createdAt', 'DESC']],
        });

        return { success: true, activeBooks };
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
};


export const addBorrowBooksService = async (userId, books) => {
    const transaction = await sequelize.transaction();
    try {
        // Validate input
        if (!Array.isArray(books) || books.length === 0) {
            throw new Error("No books provided");
        }

        const user = await Users.findByPk(userId, { transaction });
        if (!user) {
            throw new Error("Unauthorized user");
        }

        for (const item of books) {
            const { bookId, amount, dueDate } = item;

            if (!bookId || !amount || amount <= 0) {
                throw new Error("Invalid book data");
            }

            const book = await Books.findByPk(bookId, { transaction });
            if (!book) {
                throw new Error(`Book ${bookId} not found`);
            }

            if (book.quantity < amount) {
                throw new Error(`Not enough quantity for ${book.bookName}`);
            }

            // 🔍 Check if user already borrowed this book (ACTIVE)
            const existingBorrow = await BorrowedBook.findOne({
                where: {
                userId,
                bookId,
                status: "borrowed",
                },
                transaction,
            });

            if (existingBorrow) {
                // ✅ Update existing record
                await existingBorrow.increment(
                { amount },
                { transaction }
                );

                // Optional: extend due date if later
                if (new Date(dueDate) > new Date(existingBorrow.dueDate)) {
                await existingBorrow.update(
                    { dueDate },
                    { transaction }
                );
                }
            } else {
                // ✅ Create new borrow record
                await BorrowedBook.create(
                {
                    userId,
                    bookId,
                    amount,
                    dueDate,
                    status: "borrowed",
                },
                { transaction }
                );
            }

            // 🔻 Reduce available books
            await book.decrement("quantity", {
                by: amount,
                transaction,
            });
        }

        await transaction.commit();

        return {
            success: true,
            message: "Books borrowed successfully"
        };

    } catch (error) {
        await transaction.rollback();
        console.error(error);
        throw new Error(error.message);
    }
};


// GET ALL ACTIVE BOOKS SERVICE
export const getAllBorrowedBooksService = async (userId) => {
    try {
        const user = await Users.findByPk(userId);
        if (!user) {
            return { 
                success: false, 
                message: "Unauthorized user" 
            };
        }

        const borrowedBooks = await BorrowedBook.findAll({});

        return { success: true, borrowedBooks };
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
};



