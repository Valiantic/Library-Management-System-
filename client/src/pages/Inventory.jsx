/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import AddBookModal from "../components/AddBookModal";
import EditBookModal from "../components/EditBookModal";
import ArchiveBookModal from "../components/ArchiveBookModal";
import { MdAdd, MdEdit, MdBookmark, MdSearch } from "react-icons/md";
import { Archive } from "lucide-react";
import { getAllBooks, toggleBookStatus } from "../services/bookService";

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [isEditBookModalOpen, setIsEditBookModalOpen] = useState(false);
  const [isArchiveBookModalOpen, setIsArchiveBookModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);
  const { toastSuccess } = useContext(AuthContext);

  const fetchBooks = async () => {
    setLoading(true);
    const result = await getAllBooks(searchQuery, showArchived);
    if (result.success) {
      setBooks(result.books);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks();
  }, [showArchived]);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      fetchBooks();
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  const handleBookAdded = () => {
    fetchBooks();
  };

  const handleEditClick = (book) => {
    setSelectedBook(book);
    setIsEditBookModalOpen(true);
  };

  const handleArchiveClick = (book) => {
    setSelectedBook(book);
    setIsArchiveBookModalOpen(true);
  };

  const handleBookUpdated = () => {
    fetchBooks();
  };

  const handleBookStatusToggled = async () => {
    if (!selectedBook) return;
    const result = await toggleBookStatus(selectedBook.bookId);
    if (result.success) {
      toast.success(result.message, { ...toastSuccess });
      fetchBooks();
    }
  };



return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
        <Sidebar />

        <div className="flex-1 flex flex-col">
            <TopBar />

            <div className="p-2 md:p-4">
                <div className="flex flex-col md:flex-row md:flex-wrap gap-4 md:gap-8 items-start md:items-center justify-between mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                        {showArchived ? 'Archived Books' : 'Book Management'}
                    </h2>

                    <div className="w-full md:w-auto grow flex flex-col md:flex-row flex-wrap gap-2 md:gap-4 items-stretch md:items-center md:space-x-3">
                        <div className="flex grow relative">
                            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search books..."
                                className="grow pl-10 pr-4 py-2 text-black rounded-md border border-gray-400 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Toggle Archived View */}
                        <button
                            type="button"
                            onClick={() => setShowArchived(!showArchived)}
                            className={`inline-flex text-white items-center justify-center px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 w-full md:w-auto ${
                                showArchived 
                                    ? 'bg-orange-600 text-white hover:bg-orange-700' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            <Archive className="mr-2 w-4 h-4" />
                            {showArchived ? 'View Active' : 'View Archived'}
                        </button>

                        {!showArchived && (
                            <button
                                type="button"
                                onClick={() => setIsAddBookModalOpen(true)}
                                className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
                            >
                                <MdAdd className="mr-2" />
                                Add Book
                            </button>
                        )}
                    </div>
                </div>

                {/* Books Table */}
                <div className="bg-white rounded-lg shadow overflow-x-auto">
                    <table className="min-w-[600px] w-full text-sm md:text-base">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Book Name
                                </th>
                                <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Author
                                </th>
                                <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Quantity
                                </th>
                                <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-2 md:px-6 py-8 text-center text-gray-500">
                                        Loading books...
                                    </td>
                                </tr>
                            ) : books.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-2 md:px-6 py-8 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <MdBookmark className="w-12 h-12 text-gray-300" />
                                            <p>{showArchived ? 'No archived books' : 'No books found'}</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                books.map((book) => (
                                    <tr key={book.bookId} className="hover:bg-gray-50">
                                        <td className="px-2 md:px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{book.bookName}</div>
                                        </td>
                                        <td className="px-2 md:px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{book.author}</div>
                                        </td>
                                        <td className="px-2 md:px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{book.category}</div>
                                        </td>
                                        <td className="px-2 md:px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 md:px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {book.quantity}
                                            </span>
                                        </td>
                                        <td className="px-2 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    onClick={() => handleEditClick(book)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                    title="Edit"
                                                >
                                                    <MdEdit className="w-5 h-5" />
                                                </button>
                                                <button 
                                                    onClick={() => handleArchiveClick(book)}
                                                    className={`${showArchived ? 'text-green-600 hover:text-green-900' : 'text-orange-600 hover:text-orange-900'}`}
                                                    title={showArchived ? 'Unarchive' : 'Archive'}
                                                >
                                                    <Archive className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>

        {/* Add Book Modal */}
        <AddBookModal
            isOpen={isAddBookModalOpen}
            onClose={() => setIsAddBookModalOpen(false)}
            onBookAdded={handleBookAdded}
        />

        {/* Edit Book Modal */}
        <EditBookModal
            isOpen={isEditBookModalOpen}
            onClose={() => {
                setIsEditBookModalOpen(false);
                setSelectedBook(null);
            }}
            book={selectedBook}
            onBookUpdated={handleBookUpdated}
        />

        {/* Archive Book Modal */}
        <ArchiveBookModal
            isOpen={isArchiveBookModalOpen}
            onClose={() => {
                setIsArchiveBookModalOpen(false);
                setSelectedBook(null);
            }}
            book={selectedBook}
            onToggleStatus={handleBookStatusToggled}
            isArchived={showArchived}
        />
    </div>
);
}