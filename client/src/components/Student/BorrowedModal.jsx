import { useEffect } from "react"
import { getBookById } from "../../services/bookService";
import { useState } from "react";

export default function BorrowedModal({ bookId, amount, onClose }) {

    const [data, setData] = useState({});

    useEffect(() => {
        const fetchBook = async () => {
            const { success, message, book } = await getBookById(bookId);
            if (success) setData(book);
            else console.log(message);
        };

        if (bookId) fetchBook();
    }, [bookId]);

    return (
        <div className="modal-bg">
            <div className="modal-style">
                <p className="text-lg font-semibold">{amount}X | {data.bookName}</p>
                <p className="text-sm text-gray-400">Category: {data.category}</p>
                <p className="text-sm text-gray-400">Author: {data.author}</p>
                <hr className="my-8 border-gray-400" />
                <div className="grid">
                    <button
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}