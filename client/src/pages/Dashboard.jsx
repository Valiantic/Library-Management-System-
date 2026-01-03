import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getDashboardStats } from "../services/dashboardService";
import { getAllBorrowedBooks} from "../services/bookService.js"; 
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { 
    FiUsers, 
    FiBook, 
    FiBookOpen, 
    FiArchive,
    FiTrendingUp,
    FiClock,
    FiPieChart
} from "react-icons/fi";
import { 
    HiOutlineUserGroup 
} from "react-icons/hi";
import { 
    BiBookBookmark 
} from "react-icons/bi";

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { token, toastError, navigate } = useContext(AuthContext);
    const [borrowedBooks, setBorrowedBooks] = useState([]);

    const fetchDashboardStats = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await getDashboardStats();
            if (res.success) {
                setStats(res.stats);
            }
        } catch (err) {
            toast.error("Failed to fetch dashboard data", { ...toastError });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardStats();
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

    // ================= BORROWED BOOKS STATS =================
    const totalBorrowedRecords = borrowedBooks.length;

    const totalBorrowedActive = borrowedBooks.filter(
        (item) => item.status === "borrowed"
    ).length;

    const totalReturnedBooks = borrowedBooks.filter(
        (item) => item.status === "returned"
    ).length;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit'
        });
    };

    return (
        <div className="flex min-h-screen max-h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0 max-w-full">
                <TopBar />

                <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8">
                    {/* Page Header */}
                    <div className="mb-6 md:mb-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>
                        <p className="text-gray-500 mt-1">Welcome to your library management overview</p>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <>
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8">
                                {/* Total Users Card */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-5 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between">
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs md:text-sm font-medium text-gray-500">Total Users</p>
                                            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mt-1">
                                                {stats?.totalUsers || 0}
                                            </p>
                                        </div>
                                        <div className="bg-blue-100 p-2 md:p-3 rounded-xl flex-shrink-0 ml-2">
                                            <HiOutlineUserGroup className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                                        </div>
                                    </div>
                                    <div className="mt-2 md:mt-3 flex items-center text-xs md:text-sm text-gray-500">
                                        <FiUsers className="w-3 h-3 md:w-4 md:h-4 mr-1 flex-shrink-0" />
                                        <span className="truncate">Active members</span>
                                    </div>
                                </div>

                                {/* Total Books Card */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-5 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between">
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs md:text-sm font-medium text-gray-500">Total Book Titles</p>
                                            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mt-1">
                                                {stats?.totalBooks || 0}
                                            </p>
                                        </div>
                                        <div className="bg-green-100 p-2 md:p-3 rounded-xl flex-shrink-0 ml-2">
                                            <FiBook className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                                        </div>
                                    </div>
                                    <div className="mt-2 md:mt-3 flex items-center text-xs md:text-sm text-gray-500">
                                        <BiBookBookmark className="w-3 h-3 md:w-4 md:h-4 mr-1 flex-shrink-0" />
                                        <span className="truncate">{stats?.totalBookCopies || 0} total copies</span>
                                    </div>
                                </div>

                                {/* Available Books Card */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-5 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between">
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs md:text-sm font-medium text-gray-500">Available Books</p>
                                            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mt-1">
                                                {stats?.availableBooks || 0}
                                            </p>
                                        </div>
                                        <div className="bg-emerald-100 p-2 md:p-3 rounded-xl flex-shrink-0 ml-2">
                                            <FiBookOpen className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                                        </div>
                                    </div>
                                    <div className="mt-2 md:mt-3 flex items-center text-xs md:text-sm text-green-600">
                                        <FiTrendingUp className="w-3 h-3 md:w-4 md:h-4 mr-1 flex-shrink-0" />
                                        <span className="truncate">Ready for circulation</span>
                                    </div>
                                </div>

                                {/* Archived Books Card */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-5 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between">
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs md:text-sm font-medium text-gray-500">Archived Books</p>
                                            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mt-1">
                                                {stats?.archivedBooks || 0}
                                            </p>
                                        </div>
                                        <div className="bg-amber-100 p-2 md:p-3 rounded-xl flex-shrink-0 ml-2">
                                            <FiArchive className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />
                                        </div>
                                    </div>
                                    <div className="mt-2 md:mt-3 flex items-center text-xs md:text-sm text-gray-500">
                                        <FiArchive className="w-3 h-3 md:w-4 md:h-4 mr-1 flex-shrink-0" />
                                        <span className="truncate">Inactive inventory</span>
                                    </div>
                                </div>

                                

                                {/* Total Borrowed Records Card */}
                                <div onClick={() => navigate("/list-borrowed")} className="cursor-pointer bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-5 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between">
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs md:text-sm font-medium text-gray-500">
                                                Total Borrowed Records
                                            </p>
                                            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mt-1">
                                                {totalBorrowedRecords}
                                            </p>
                                        </div>
                                        <div className="bg-indigo-100 p-2 md:p-3 rounded-xl flex-shrink-0 ml-2">
                                            <FiBookOpen className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
                                        </div>
                                    </div>
                                    <div className="mt-2 md:mt-3 flex items-center text-xs md:text-sm text-gray-500">
                                        <FiTrendingUp className="w-3 h-3 md:w-4 md:h-4 mr-1 flex-shrink-0" />
                                        <span className="truncate">
                                            {totalBorrowedActive} borrowed · {totalReturnedBooks} returned
                                        </span>
                                    </div>
                                </div>

                            </div>

                            {/* Main Content Grid */}
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
                                {/* Recent Books - Takes 2 columns */}
                                <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-base md:text-lg font-semibold text-gray-800">Recently Added Books</h2>
                                        <FiClock className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0" />
                                    </div>
                                    <div className="overflow-x-auto -mx-4 md:mx-0">
                                        <div className="min-w-[400px] px-4 md:px-0">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="text-left text-xs md:text-sm text-gray-500 border-b border-gray-100">
                                                        <th className="pb-3 font-medium">Book Title</th>
                                                        <th className="pb-3 font-medium hidden sm:table-cell">Author</th>
                                                        <th className="pb-3 font-medium hidden lg:table-cell">Category</th>
                                                        <th className="pb-3 font-medium text-center">Qty</th>
                                                        <th className="pb-3 font-medium text-right">Added</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-xs md:text-sm">
                                                    {stats?.recentBooks?.length > 0 ? (
                                                        stats.recentBooks.map((book, index) => (
                                                            <tr key={book.bookId || index} className="border-b border-gray-50 hover:bg-gray-50">
                                                                <td className="py-3 pr-2">
                                                                    <div className="font-medium text-gray-800 truncate max-w-[120px] md:max-w-[180px]">{book.bookName}</div>
                                                                    <div className="text-xs text-gray-500 sm:hidden truncate">{book.author}</div>
                                                                </td>
                                                                <td className="py-3 text-gray-600 hidden sm:table-cell">
                                                                    <span className="truncate block max-w-[100px] md:max-w-[150px]">{book.author}</span>
                                                                </td>
                                                                <td className="py-3 hidden lg:table-cell">
                                                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium whitespace-nowrap">
                                                                        {book.category}
                                                                    </span>
                                                                </td>
                                                                <td className="py-3 text-center text-gray-600">{book.quantity}</td>
                                                                <td className="py-3 text-right text-gray-500 text-xs whitespace-nowrap">
                                                                    {formatDate(book.createdAt)}
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="5" className="py-8 text-center text-gray-500">
                                                                No books added yet
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                {/* Books by Category */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-base md:text-lg font-semibold text-gray-800">Books by Category</h2>
                                        <FiPieChart className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0" />
                                    </div>
                                    <div className="space-y-3 md:space-y-4">
                                        {stats?.booksByCategory?.length > 0 ? (
                                            stats.booksByCategory.map((category, index) => {
                                                const colors = [
                                                    'bg-blue-500',
                                                    'bg-green-500',
                                                    'bg-purple-500',
                                                    'bg-amber-500',
                                                    'bg-pink-500'
                                                ];
                                                const bgColors = [
                                                    'bg-blue-100',
                                                    'bg-green-100',
                                                    'bg-purple-100',
                                                    'bg-amber-100',
                                                    'bg-pink-100'
                                                ];
                                                const percentage = stats.totalBooks > 0 
                                                    ? Math.round((category.count / stats.totalBooks) * 100) 
                                                    : 0;
                                                
                                                return (
                                                    <div key={category.category || index}>
                                                        <div className="flex items-center justify-between mb-1 gap-2">
                                                            <span className="text-xs md:text-sm font-medium text-gray-700 truncate">
                                                                {category.category}
                                                            </span>
                                                            <span className="text-xs md:text-sm text-gray-500 whitespace-nowrap flex-shrink-0">
                                                                {category.count} ({category.totalQuantity})
                                                            </span>
                                                        </div>
                                                        <div className={`h-2 ${bgColors[index % 5]} rounded-full overflow-hidden`}>
                                                            <div 
                                                                className={`h-full ${colors[index % 5]} rounded-full transition-all duration-500`}
                                                                style={{ width: `${percentage}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="py-8 text-center text-gray-500 text-sm">
                                                No categories yet
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Recent Users */}
                                <div className="xl:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-base md:text-lg font-semibold text-gray-800">Recently Registered Users</h2>
                                        <FiUsers className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0" />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                                        {stats?.recentUsers?.length > 0 ? (
                                            stats.recentUsers.map((user, index) => (
                                                <div 
                                                    key={user.userId || index} 
                                                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                                >
                                                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs md:text-sm flex-shrink-0">
                                                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs md:text-sm font-medium text-gray-800 truncate">
                                                            {user.firstName} {user.lastName}
                                                        </p>
                                                        <p className="text-xs text-gray-500 truncate">
                                                            {user.role}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-span-full py-8 text-center text-gray-500 text-sm">
                                                No users registered yet
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Quick Stats Summary */}
                                <div className="xl:col-span-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-sm p-4 md:p-5 text-white">
                                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                                        <div className="min-w-0 flex-1">
                                            <h2 className="text-base md:text-lg lg:text-xl font-semibold">Library Summary</h2>
                                            <p className="text-blue-100 text-xs md:text-sm mt-1">
                                                Your library manages {stats?.totalBookCopies || 0} copies across {stats?.totalBooks || 0} titles, 
                                                serving {stats?.totalUsers || 0} members.
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-3 md:space-x-4 lg:space-x-6 flex-shrink-0">
                                            <div className="text-center">
                                                <p className="text-xl md:text-2xl lg:text-3xl font-bold">{stats?.totalBooks || 0}</p>
                                                <p className="text-xs text-blue-200">Titles</p>
                                            </div>
                                            <div className="h-8 md:h-10 w-px bg-blue-400"></div>
                                            <div className="text-center">
                                                <p className="text-xl md:text-2xl lg:text-3xl font-bold">{stats?.totalBookCopies || 0}</p>
                                                <p className="text-xs text-blue-200">Copies</p>
                                            </div>
                                            <div className="h-8 md:h-10 w-px bg-blue-400"></div>
                                            <div className="text-center">
                                                <p className="text-xl md:text-2xl lg:text-3xl font-bold">{stats?.totalUsers || 0}</p>
                                                <p className="text-xs text-blue-200">Members</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}