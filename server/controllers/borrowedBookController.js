import { fetchAllBorrowedBooksService, returnBorrowedBooksService } from "../services/borrowedBooksServices.js";

// GET ALL BOOKS
export const getAllBorrowedBooksController = async (req, res) => {
    try {
        const userId = req.user.ID;
        const { bookType, search } = req.query;
        const result = await fetchAllBorrowedBooksService(userId, bookType, search);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// RETURN BORROWED BOOKS
export const returnBorrowedBooksController = async (req, res) => {
    try {
        const { borrowedBookId } = req.params;
        const result = await returnBorrowedBooksService(borrowedBookId);
        res.json(result);
    } catch (error) {

    }
}
