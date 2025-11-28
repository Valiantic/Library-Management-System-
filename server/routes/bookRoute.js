import express from 'express';
import { addBookController, getAllBooksController, getBookByIdController, updateBookController, deleteBookController } from '../controllers/bookController.js';

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

export default bookRouter;
