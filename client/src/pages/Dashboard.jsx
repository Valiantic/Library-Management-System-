import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getDashboardStats } from "../services/dashboardService";
import { getAllBorrowedBooks } from "../services/bookService.js";
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
        <div className="flex min-h-screen bg-[#f8fafc]">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0 max-w-full md:ml-64 lg:ml-72 transition-all duration-300">
                <TopBar />

                <main className="flex-1 p-6 md:p-8 lg:p-10 max-w-[1600px] mx-auto w-full">
                    {/* Page Header */}
                    <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard</h1>
                            <p className="text-slate-500 font-medium mt-1.5 text-sm">Welcome back. Here's what's happening in your library today.</p>
                        </div>
                        <div className="flex items-center gap-2 text-[13px] font-bold text-slate-400 bg-slate-100 py-1.5 px-3 rounded-lg">
                            <FiClock className="text-slate-400" />
                            <span>Last updated: Just now</span>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-[50vh]">
                            <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4"></div>
                            <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">Loading Analytics</p>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
                                {/* Total Users Card */}
                                <div className="group bg-white rounded-3xl p-6 border border-slate-100 hover:border-blue-500/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all duration-500">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                                            <HiOutlineUserGroup className="w-6 h-6" />
                                        </div>
                                        <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase bg-slate-50 px-2.5 py-1 rounded-full">Membership</div>
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wide">Total Users</p>
                                        <div className="flex items-baseline gap-2 mt-1">
                                            <h3 className="text-3xl font-black text-slate-900">{stats?.totalUsers || 0}</h3>
                                            <span className="text-emerald-500 text-xs font-bold">+2.4%</span>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-xs font-bold text-slate-400 italic">
                                            <span>Active members</span>
                                            <FiUsers className="w-3.5 h-3.5" />
                                        </div>
                                    </div>
                                </div>

                                {/* Total Books Card */}
                                <div className="group bg-white rounded-3xl p-6 border border-slate-100 hover:border-green-500/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all duration-500">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                                            <FiBook className="w-6 h-6" />
                                        </div>
                                        <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase bg-slate-50 px-2.5 py-1 rounded-full">Inventory</div>
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wide">Book Titles</p>
                                        <div className="flex items-baseline gap-2 mt-1">
                                            <h3 className="text-3xl font-black text-slate-900">{stats?.totalBooks || 0}</h3>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-xs font-bold text-slate-400 italic">
                                            <span>{stats?.totalBookCopies || 0} Total Copies</span>
                                            <BiBookBookmark className="w-3.5 h-3.5" />
                                        </div>
                                    </div>
                                </div>

                                {/* Available Books Card */}
                                <div className="group bg-white rounded-3xl p-6 border border-slate-100 hover:border-emerald-500/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all duration-500">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                                            <FiBookOpen className="w-6 h-6" />
                                        </div>
                                        <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase bg-slate-50 px-2.5 py-1 rounded-full">Status</div>
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wide">Available</p>
                                        <div className="flex items-baseline gap-2 mt-1">
                                            <h3 className="text-3xl font-black text-slate-900">{stats?.availableBooks || 0}</h3>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-xs font-bold text-emerald-600/70 italic">
                                            <span>Ready for circulation</span>
                                            <FiTrendingUp className="w-3.5 h-3.5" />
                                        </div>
                                    </div>
                                </div>

                                {/* Borrowed Records Card */}
                                <div onClick={() => navigate("/list-borrowed")} className="group cursor-pointer bg-white rounded-3xl p-6 border border-slate-100 hover:border-indigo-500/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all duration-500">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                                            <FiBookOpen className="w-6 h-6" />
                                        </div>
                                        <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase bg-slate-50 px-2.5 py-1 rounded-full">Activity</div>
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wide">Total Records</p>
                                        <div className="flex items-baseline gap-2 mt-1">
                                            <h3 className="text-3xl font-black text-slate-900">{totalBorrowedRecords}</h3>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-xs font-bold text-slate-400 italic">
                                            <span>{totalBorrowedActive} active · {totalReturnedBooks} back</span>
                                            <FiTrendingUp className="w-3.5 h-3.5" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Main Content Grid */}
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                                {/* Recent Books Table */}
                                <div className="xl:col-span-2 bg-white rounded-[32px] p-8 border border-slate-100">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Recently Added</h2>
                                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Latest inventory updates</p>
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                            <FiClock className="w-5 h-5" />
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="text-left text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-50">
                                                    <th className="pb-4">Book Information</th>
                                                    <th className="pb-4 hidden lg:table-cell">Category</th>
                                                    <th className="pb-4 text-center">Qty</th>
                                                    <th className="pb-4 text-right">Date Added</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {stats?.recentBooks?.length > 0 ? (
                                                    stats.recentBooks.map((book, index) => (
                                                        <tr key={book.bookId || index} className="group hover:bg-slate-50/50 transition-colors">
                                                            <td className="py-5 pr-4">
                                                                <div className="font-bold text-slate-900 transition-colors group-hover:text-blue-600">{book.bookName}</div>
                                                                <div className="text-xs font-medium text-slate-400 mt-0.5">{book.author}</div>
                                                            </td>
                                                            <td className="py-5 hidden lg:table-cell">
                                                                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                                                                    {book.category}
                                                                </span>
                                                            </td>
                                                            <td className="py-5 text-center font-bold text-slate-700">{book.quantity}</td>
                                                            <td className="py-5 text-right text-xs font-bold text-slate-400">
                                                                {formatDate(book.createdAt)}
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="4" className="py-20 text-center">
                                                            <p className="text-slate-300 font-bold uppercase tracking-widest text-xs">No Recent Activity</p>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Categories Summary */}
                                <div className="bg-white rounded-[32px] p-8 border border-slate-100">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Distribution</h2>
                                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">By Category</p>
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                            <FiPieChart className="w-5 h-5" />
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {stats?.booksByCategory?.length > 0 ? (
                                            stats.booksByCategory.map((category, index) => {
                                                const percentages = stats.totalBooks > 0
                                                    ? Math.round((category.count / stats.totalBooks) * 100)
                                                    : 0;
                                                const accentColors = ['bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 'bg-slate-900', 'bg-slate-400'];

                                                return (
                                                    <div key={category.category || index} className="group">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-[13px] font-bold text-slate-700 group-hover:text-slate-900 transition-colors">{category.category}</span>
                                                            <span className="text-[11px] font-black text-slate-400 tracking-tighter italic">{category.count} titles</span>
                                                        </div>
                                                        <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full ${accentColors[index % accentColors.length]} rounded-full transition-all duration-1000 ease-out`}
                                                                style={{ width: `${percentages}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="py-20 text-center">
                                                <p className="text-slate-300 font-bold uppercase tracking-widest text-xs">Awaiting Data</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Library Summary Banner */}
                                <div className="xl:col-span-3 bg-[#0f1115] rounded-[32px] overflow-hidden p-8 relative">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full -ml-24 -mb-24 blur-3xl"></div>

                                    <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                                        <div className="max-w-xl">
                                            <h2 className="text-2xl font-black text-white tracking-tight">System Summary</h2>
                                            <p className="text-white/40 font-medium mt-2 text-sm leading-relaxed">
                                                Aurevia current infrastructure supports <span className="text-white font-bold">{stats?.totalBookCopies || 0}</span> volumes
                                                across <span className="text-white font-bold">{stats?.totalBooks || 0}</span> distinct categories,
                                                fully accessible to <span className="text-white font-bold">{stats?.totalUsers || 0}</span> verified members.
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-10">
                                            <div className="text-center group">
                                                <p className="text-3xl font-black text-white mb-1 group-hover:scale-110 transition-transform">{stats?.totalBooks || 0}</p>
                                                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Titles</p>
                                            </div>
                                            <div className="h-10 w-px bg-white/10"></div>
                                            <div className="text-center group">
                                                <p className="text-3xl font-black text-white mb-1 group-hover:scale-110 transition-transform">{stats?.totalBookCopies || 0}</p>
                                                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Volumes</p>
                                            </div>
                                            <div className="h-10 w-px bg-white/10"></div>
                                            <div className="text-center group">
                                                <p className="text-3xl font-black text-white mb-1 group-hover:scale-110 transition-transform">{stats?.totalUsers || 0}</p>
                                                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Members</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}