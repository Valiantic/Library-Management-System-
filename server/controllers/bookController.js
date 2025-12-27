import { addBookService, getAllBooksService, getBookByIdService, updateBookService, deleteBookService, toggleBookStatusService, getAllActiveBooksService, addBorrowBooksService, getAllBorrowedBooksService } from '../services/bookServices.js';

// ADD BOOK
export const addBookController = async (req, res) => {
    try {
        const { bookName, author, category, quantity } = req.body;
        const result = await addBookService(bookName, author, category, quantity);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// GET ALL BOOKS
export const getAllBooksController = async (req, res) => {
    try {
        const { search, showArchived } = req.query;
        const result = await getAllBooksService(search, showArchived === 'true');
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// GET BOOK BY ID
export const getBookByIdController = async (req, res) => {
    try {
        const { bookId } = req.params;
        const result = await getBookByIdService(bookId);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE BOOK
export const updateBookController = async (req, res) => {
    try {
        const { bookId } = req.params;
        const { bookName, author, category, quantity } = req.body;
        const result = await updateBookService(bookId, bookName, author, category, quantity);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// DELETE BOOK
export const deleteBookController = async (req, res) => {
    try {
        const { bookId } = req.params;
        const result = await deleteBookService(bookId);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// TOGGLE BOOK STATUS (Archive/Unarchive)
export const toggleBookStatusController = async (req, res) => {
    try {
        const { bookId } = req.params;
        const result = await toggleBookStatusService(bookId);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

export const getAllActiveBooksController = async (req, res) => {
    try {
        const { ID } = req.user;
        const result = await getAllActiveBooksService(ID);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
    }
}

// ADD BORROWED BOOK
export const addBorrowBooksController = async (req, res) => {
    try {
        const { ID } = req.user;
        const books = req.body;
        const result = await addBorrowBooksService(ID, books);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};


export const getAllBorrowedBooksController = async (req, res) => {
    try {
        const { ID } = req.user;
        const result = await getAllBorrowedBooksService(ID);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
    }
}
