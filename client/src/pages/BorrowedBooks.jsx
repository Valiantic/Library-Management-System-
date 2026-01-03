/* eslint-disable react-hooks/exhaustive-deps */
import { Eye, Undo2 } from "lucide-react";
import Navbar from "../components/Student/Navbar";
import Sidebar from "../components/Student/Sidebar";
import { getAllBorrowedBooks } from "../services/borrowedBookService";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import ReturnedModal from "../components/Student/ReturnedModal";
import BorrowedModal from "../components/Student/BorrowedModal";
import { formatDateTime } from "../utils/format";

export default function BorrowedBooks() {
    const { token } = useContext(AuthContext);

    const [data, setData] = useState([]);
    const [bookType, setBookType] = useState('borrowed');
    const [search, setSearch] = useState('');

    const [borrowedId, setBorrowedId] = useState(null);
    const [bookId, setBookId] = useState(null);
    const [amount, setAmount] = useState(null);

    const [openReturnedModal, setOpenReturnedModal] = useState(false);
    const [openBorrowedModal, setOpenBorrowedModal] = useState(false);

    const fetchBorrowedBooks = async () => {
        const { success, message, borrowedBooks } = await getAllBorrowedBooks(token, { bookType: bookType, search: search });
        if (success) {
            setData(borrowedBooks);
        } else {
            console.log(message);
        }
    }
    useEffect(() => {
        fetchBorrowedBooks();
    }, [bookType, search]);

    const handleReturned = (borrowedId, id, amount) => {
        setBorrowedId(borrowedId);
        setBookId(id);
        setAmount(amount);
        setOpenReturnedModal(true);
    }

    const handleBorrowed = (id, amount) => {
        setBookId(id);
        setAmount(amount);
        setOpenBorrowedModal(true);
    }

    return (
        <div className="bg-white min-h-screen">
            <Navbar />
            <Sidebar />
            <div className="px-8">
                <div className="flex justify-between py-4">
                    <div className="flex gap-4">
                        <button
                            onClick={() => setBookType('borrowed')}
                        >
                            Borrowed books
                        </button>
                        <button
                            onClick={() => setBookType('returned')}
                        >
                            Return books
                        </button>
                    </div>
                    <input
                        type="text"
                        placeholder="Search by ID"
                        className="border border-gray-400 px-4"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="table-style">
                    <table>
                        <thead>
                            <tr>
                                <td>ID</td>
                                <td>User ID</td>
                                <td>Amount</td>
                                <td>Due Date</td>
                                <td>Date & Time</td>
                                <td>Action</td>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length > 0 ? (
                                data.map((borrowedBook) => (
                                    <tr key={borrowedBook.borrowedId}>
                                        <td>{borrowedBook.borrowedId}</td>
                                        <td>{borrowedBook.userId}</td>
                                        <td>{borrowedBook.amount}</td>
                                        <td>{formatDateTime(borrowedBook.dueDate)}</td>
                                        <td>{formatDateTime(borrowedBook.dateAndTimeAdded)}</td>
                                        <td className="flex justify-center">
                                            {bookType !== 'borrowed' ?
                                                (
                                                    <button
                                                        className="flex gap-2 items-center"
                                                        onClick={() => handleBorrowed(borrowedBook.bookId, borrowedBook.amount)}
                                                    >
                                                        View
                                                        <Eye size={16} />
                                                    </button>
                                                )
                                                :
                                                (
                                                    <button
                                                        className="flex gap-2 items-center"
                                                        onClick={() => handleReturned(borrowedBook.borrowedId, borrowedBook.bookId, borrowedBook.amount)}
                                                    >
                                                        Return
                                                        <Undo2 size={16} />
                                                    </button>
                                                )
                                            }
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="text-center p-4">
                                        No Book found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {
                openReturnedModal &&
                <ReturnedModal
                    borrowedId={borrowedId}
                    bookId={bookId}
                    amount={amount}
                    onClose={() => setOpenReturnedModal(false)}
                    fetchBorrowedBooks={fetchBorrowedBooks}
                />
            }
            {
                openBorrowedModal &&
                <BorrowedModal
                    bookId={bookId}
                    amount={amount}
                    onClose={() => setOpenBorrowedModal(false)}
                />
            }

        </div>
    )
}