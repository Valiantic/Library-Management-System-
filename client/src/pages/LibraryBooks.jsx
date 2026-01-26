import { useContext, useEffect, useState } from "react";
import { getAllActiveBooks, addBorrowBooks, getAllBorrowedBooks } from "../services/bookService.js";
import { AuthContext } from "../context/AuthContext";
import Loading from "../components/Loading";
import Sidebar from '../components/Student/Sidebar';
import Navbar from "../components/Student/Navbar";

const LibraryBooks = () => {
  const { token } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [cart, setCart] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  const formatDate = (date) =>
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const today = new Date();
  const dueDate = new Date();
  dueDate.setDate(today.getDate() + 3);
  const formattedDueDate = formatDate(dueDate);

  const getBorrowedInfo = (bookId) => {
    return borrowedBooks.find(
      (b) => b.bookId === bookId && b.status === "borrowed"
    );
  };


  /* ================= FETCH BOOKS ================= */
  useEffect(() => {
    const fetchBooks = async () => {
      const res = await getAllActiveBooks(token);
      if (res?.activeBooks) {
        setBooks(res.activeBooks);
      }
    };
    fetchBooks();
  }, [token]);

  /* ================= FETCH BORROWED BOOKS ================= */
  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        const res = await getAllBorrowedBooks(token);

        if (res?.borrowedBooks) {
          setBorrowedBooks(res.borrowedBooks);
        }
      } catch (error) {
        console.error("Failed to fetch borrowed books:", error);
      }
    };

    if (token) {
      fetchBorrowedBooks();
    }
  }, [token]);

  /* ================= FILTER ================= */
  const filteredBooks = books.filter(
    (b) =>
      b.bookName.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= CART HANDLERS ================= */
  const toggleBook = (book) => {
    setCart((prev) => {
      const exists = prev.find((b) => b.bookId === book.bookId);
      if (exists) {
        return prev.filter((b) => b.bookId !== book.bookId);
      }
      return [...prev, { ...book, borrowQty: 1 }];
    });
  };

  const updateQty = (bookId, value) => {
    setCart((prev) =>
      prev.map((b) =>
        b.bookId === bookId
          ? {
            ...b,
            borrowQty: Math.max(1, Math.min(value, b.quantity)),
          }
          : b
      )
    );
  };

  const removeFromCart = (bookId) => {
    setCart((prev) => prev.filter((b) => b.bookId !== bookId));
  };

  const cancelAcquire = () => {
    setShowModal(false);
    setCart([]);
  };

  const confirmAcquire = async () => {
    const payload = cart.map((book) => ({
      bookId: book.bookId,
      amount: book.borrowQty,
      dueDate: dueDate.toISOString().split("T")[0],
    }));

    setLoading(true);
    const created = await addBorrowBooks(token, payload)
    setLoading(false);

    if (created) {
      setShowModal(false);
      setShowSuccessNotification(true);

      setTimeout(() => {
        setShowSuccessNotification(false);
      }, 2000);

      setTimeout(() => {
        window.location.reload();
      }, 2500);
    }

  };

  useEffect(() => {
    if (showModal && cart.length === 0) {
      setShowModal(false);
    }
  }, [cart, showModal]);



  return (
    <>
      {loading && <Loading />}

      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="fixed top-4 right-4 z-[100] animate-slide-in">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <p className="font-semibold">Success!</p>
              <p className="text-sm">Books acquired successfully</p>
            </div>
          </div>
        </div>
      )}

      <Navbar />
      <Sidebar />
      <div className="flex min-h-screen bg-[#f5f5f5] flex-col md:flex-row">
        {/* ================= MAIN ================= */}
        <div className="flex-1 p-3 sm:p-6">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
            <h2 className="text-base sm:text-lg font-semibold">
              Library Lane Books
            </h2>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-auto group">
                <button
                  disabled={!cart.length}
                  onClick={() => setShowModal(true)}
                  className="bg-black text-black border-2 border-black px-4 py-2 rounded disabled:opacity-40 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed w-full"
                >
                  + Acquire
                </button>
                {!cart.length && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    Select a book record first
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                  </div>
                )}
              </div>

              {/* SEARCH BAR */}
              <div className="flex items-center bg-white border rounded px-3 py-2 w-full sm:w-56">
                <input
                  type="text"
                  placeholder="Search by ID or Type"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="outline-none text-sm w-full"
                />
              </div>
            </div>
          </div>

          {/* LIST OF BOOKS */}
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="min-w-[700px] w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-3 px-2">Name</th>
                  <th className="text-left py-3 px-2">Author</th>
                  <th className="text-left py-3 px-2">Category</th>
                  <th className="text-left py-3 px-2">Qty</th>
                  <th className="text-left py-3 px-2">Availability</th>
                  <th className="text-center py-3 px-2">Add</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((book) => (
                  <tr key={book.bookId} className="border-b">
                    <td className="py-3 px-2">{book.bookName}</td>
                    <td className="py-3 px-2">{book.author}</td>
                    <td className="py-3 px-2">{book.category}</td>
                    <td className="py-3 px-2">{book.quantity}</td>
                    <td className="py-3 px-2">
                      {(() => {
                        const borrowed = getBorrowedInfo(book.bookId);

                        if (borrowed) {
                          return `Borrowed (${borrowed.amount})`;
                        }

                        return "Available";
                      })()}
                    </td>
                    <td className="text-center px-2">
                      <input
                        type="checkbox"
                        checked={cart.some((b) => b.bookId === book.bookId)}
                        onChange={() => toggleBook(book)}
                        className="w-4 h-4"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= RIGHT SIDEBAR ================= */}
        <div className="hidden md:flex w-20 bg-black items-center justify-center">
          <span className="text-white text-2xl tracking-widest rotate-90">
            Aurevia Library Management System
          </span>
        </div>

        {/* ================= ACQUIRE MODAL ================= */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50">
            <div className="bg-white w-full sm:w-[900px] max-h-[90vh] overflow-y-auto rounded-t-xl sm:rounded-xl p-4 sm:p-6">
              <table className="w-full text-sm mb-6 min-w-[600px]">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-2">Name</th>
                    <th className="text-left py-2">Author</th>
                    <th className="text-left py-2">Category</th>
                    <th className="text-center py-2">Borrow</th>
                    <th className="text-center py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((book) => (
                    <tr key={book.bookId} className="border-b">
                      <td className="py-3">{book.bookName}</td>
                      <td className="py-3">{book.author}</td>
                      <td className="py-3">{book.category}</td>
                      <td className="py-3">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() =>
                              updateQty(book.bookId, book.borrowQty - 1)
                            }
                          >
                            −
                          </button>
                          <input
                            type="number"
                            value={book.borrowQty}
                            min={1}
                            max={book.quantity}
                            onChange={(e) =>
                              updateQty(book.bookId, Number(e.target.value))
                            }
                            className="w-14 border rounded text-center"
                          />
                          <button
                            onClick={() =>
                              updateQty(book.bookId, book.borrowQty + 1)
                            }
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="text-center">
                        <button onClick={() => removeFromCart(book.bookId)}>
                          🗑
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <p className="font-semibold">Total Books : {cart.length}</p>
                  <p className="text-sm text-gray-500">
                    Due Date : {formattedDueDate}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={cancelAcquire}
                    className="bg-gray-200 px-6 py-2 rounded w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmAcquire}
                    className="bg-black text-black px-6 py-2 rounded w-full sm:w-auto"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LibraryBooks;
