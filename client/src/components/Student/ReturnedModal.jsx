import { useEffect } from "react"
import { getBookById } from "../../services/bookService";
import { useState } from "react";
import { returnBorrowedBooks } from "../../services/borrowedBookService";

export default function ReturnedModal({ borrowedId, bookId, amount, onClose, fetchBorrowedBooks }) {

    const [data, setData] = useState({});

    useEffect(() => {
        const fetchBook = async () => {
            const { success, message, book } = await getBookById(bookId);
            if (success) setData(book);
            else console.log(message);
        };

        if (bookId) fetchBook();
    }, [bookId]);

    const handleSubmit = async () => {
        console.log('submit');
        const { success, message } = await returnBorrowedBooks(borrowedId);
        if (success) {
            console.log(message);
            fetchBorrowedBooks();
            onClose();

        } else {
            console.log(message);
        }
    }

    return (
        <div className="modal-bg">
            <div className="modal-style">
                <p className="text-lg font-semibold">{amount}X | {data.bookName}</p>
                <p className="text-sm text-gray-400">Category: {data.category}</p>
                <p className="text-sm text-gray-400">Author: {data.author}</p>
                <hr className="my-8 border-gray-400" />
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                    >
                        Return

                    </button>
                </div>
            </div>
        </div>
    )
}