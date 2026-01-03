import express from 'express';
import { getAllBorrowedBooksController, returnBorrowedBooksController } from '../controllers/borrowedBookController.js';
import userAuth from '../middleware/userAuth.js';

const BorrowedbookRouter = express.Router();

// GET ALL BOOKS
BorrowedbookRouter.get('/all', userAuth, getAllBorrowedBooksController);

// RETURN BORROWED BOOKS
BorrowedbookRouter.put('/return/:borrowedBookId', returnBorrowedBooksController);



export default BorrowedbookRouter;