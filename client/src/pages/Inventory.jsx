import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import AddBookModal from "../components/AddBookModal";
import EditBookModal from "../components/EditBookModal";
import DeleteBookModal from "../components/DeleteBookModal";
import { MdAdd, MdEdit, MdDelete, MdBookmark, MdSearch } from "react-icons/md";
import { getAllBooks } from "../services/bookService";

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [isEditBookModalOpen, setIsEditBookModalOpen] = useState(false);
  const [isDeleteBookModalOpen, setIsDeleteBookModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    setLoading(true);
    const result = await getAllBooks(searchQuery);
    if (result.success) {
      setBooks(result.books);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

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

  const handleDeleteClick = (book) => {
    setSelectedBook(book);
    setIsDeleteBookModalOpen(true);
  };

  const handleBookUpdated = () => {
    fetchBooks();
  };

  const handleBookDeleted = () => {
    fetchBooks();
  };



return (
    <div className="flex min-h-screen bg-gray-50">
        <Sidebar />

        <div className="flex-1 flex flex-col">
            <TopBar />

            <div className="p-8 mt-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Book Management</h2>

                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search books..."
                                className="pl-10 pr-4 py-2 text-black rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsAddBookModalOpen(true)}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <MdAdd className="mr-2" />
                            Add Book
                        </button>
                    </div>
                </div>

                {/* Books Table */}
                <div className="bg-white rounded-lg shadow">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Book Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Author
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Quantity
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                            Loading books...
                                        </td>
                                    </tr>
                                ) : books.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                            <div className="flex flex-col items-center gap-2">
                                                <MdBookmark className="w-12 h-12 text-gray-300" />
                                                <p>No books found</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    books.map((book) => (
                                        <tr key={book.bookId} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{book.bookName}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">{book.author}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">{book.category}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {book.quantity}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center gap-2">
                                                    <button 
                                                        onClick={() => handleEditClick(book)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        <MdEdit className="w-5 h-5" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteClick(book)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <MdDelete className="w-5 h-5" />
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

        {/* Delete Book Modal */}
        <DeleteBookModal
            isOpen={isDeleteBookModalOpen}
            onClose={() => {
                setIsDeleteBookModalOpen(false);
                setSelectedBook(null);
            }}
            book={selectedBook}
            onBookDeleted={handleBookDeleted}
        />
    </div>
);
}