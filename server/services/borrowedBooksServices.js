import { Op } from "sequelize";
import BorrowedBook from "../model/BorrowedBook.js";
import Users from "../model/User.js";
import Books from "../model/Book.js";

export const fetchAllBorrowedBooksService = async (userId, bookType = 'borrowed', search = '') => {
    try {

        const user = await Users.findByPk(userId);

        if (!user) {
            return {
                success: false,
                message: 'User not found'
            }
        }

        const where = { userId: userId };

        if (bookType) {
            where.status = bookType === 'borrowed' ? bookType : 'returned';
        }

        if (search) {
            where[Op.or] = [
                { borrowedId: search }
            ];
        }

        const borrowedBooks = await BorrowedBook.findAll({ where });

        return {
            success: true,
            borrowedBooks
        };

    } catch (error) {
        return {
            success: false,
            message: `Error on fetchAllBorrowedBooks: ${error.message}`
        };
    }
};

// RETURN BORROWED BOOKS
export const returnBorrowedBooksService = async (borrowedBookId) => {
    try {
        const borrowed = await BorrowedBook.findByPk(borrowedBookId);

        if (!borrowed) {
            return { success: false, message: "Borrowed book not found" };
        }

        if (borrowed.status === "returned") {
            return { success: false, message: "This book is already returned" };
        }

        borrowed.status = "returned";
        await borrowed.save();

        const book = await Books.findByPk(borrowed.bookId);
        if (book) {
            book.quantity += borrowed.amount;
            await book.save();
        }

        return {
            success: true,
            message: "Returned books successfully",
        };

    } catch (error) {
        return {
            success: false,
            message: `Error on returnBorrowedBooksService: ${error.message}`,
        };
    }
};
