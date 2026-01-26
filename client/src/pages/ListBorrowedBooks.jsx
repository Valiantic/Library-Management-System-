import React, { useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { getAllUsers } from "../services/userService.js";
import { getAllActiveBooks, getAllBorrowedBooks } from "../services/bookService.js";

const ListBorrowedBooks = () => {
  const { token } = useContext(AuthContext);
  const [rows, setRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const usersRes = await getAllUsers(token);
        const booksRes = await getAllActiveBooks(token);
        const borrowedRes = await getAllBorrowedBooks(token);

        // ✅ CORRECT EXTRACTION
        const users = usersRes?.users || [];
        const books = booksRes?.activeBooks || [];
        const borrowed = borrowedRes?.borrowedBooks || [];

        const usersMap = {};
        users.forEach((u) => {
          usersMap[u.userId] = u;
        });

        const booksMap = {};
        books.forEach((b) => {
          booksMap[b.bookId] = b;
        });

        const merged = borrowed.map((item) => {
          const user = usersMap[item.userId];
          const book = booksMap[item.bookId];

          return {
            borrowedId: item.borrowedId,
            username: user?.userName || "Unknown",
            bookName: book?.bookName || "Unavailable",
            category: book?.category || "Unavailable",
            amount: item.amount,
            status: item.status,
            dateAndTimeAdded: item.dateAndTimeAdded,
          };
        });
        setRows(merged);

      } catch (error) {
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);




  // 🔍 Simple search filter (NO MEMO)
  const filteredRows = rows.filter((row) =>
    `${row.username} ${row.bookName} ${row.category} ${row.status}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col md:ml-72 lg:ml-72">
        <TopBar />

        <div className="p-2 md:p-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              Borrowed & Returned Books (All Users)
            </h2>

            {/* Search */}
            <div className="w-full md:w-80 relative">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search user, book, category..."
                className="w-full pl-10 pr-4 py-2 text-black rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-[900px] w-full text-sm md:text-base">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Username
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Book Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date Borrowed
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      Loading borrowed books...
                    </td>
                  </tr>
                ) : filteredRows.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No records found
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((row) => (
                    <tr key={row.borrowedId} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {row.username}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {row.bookName}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {row.category}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                          {row.amount}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${row.status === "borrowed"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                            }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(row.dateAndTimeAdded).toLocaleString()}
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
  );
};

export default ListBorrowedBooks;
