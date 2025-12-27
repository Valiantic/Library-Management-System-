import express from 'express';
import { addBookController, getAllBooksController, getBookByIdController, updateBookController, deleteBookController, toggleBookStatusController, getAllActiveBooksController, addBorrowBooksController, getAllBorrowedBooksController } from '../controllers/bookController.js';

import userAuth from '../middleware/userAuth.js';

const bookRouter = express.Router();


// ADD NEW BOOK
bookRouter.post('/add', addBookController);

// GET ALL BOOKS
bookRouter.get('/all', getAllBooksController);

// GET BOOK BY ID
bookRouter.get('/:bookId', getBookByIdController);

// UPDATE BOOK
bookRouter.put('/update/:bookId', updateBookController);

// DELETE BOOK
bookRouter.delete('/delete/:bookId', deleteBookController);

// TOGGLE BOOK STATUS (Archive/Unarchive)
bookRouter.put('/toggle-status/:bookId', toggleBookStatusController);

// GET ALL ACTIVE BOOKS
bookRouter.get('/all/active', userAuth, getAllActiveBooksController);

// ADD BORROWED BOOKS
bookRouter.post('/borrow/add', userAuth, addBorrowBooksController);


// GET BORROWED BOOKS
bookRouter.get('/borrow/get', userAuth, getAllBorrowedBooksController);

export default bookRouter;
