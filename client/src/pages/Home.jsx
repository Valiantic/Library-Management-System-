import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, RotateCcw, Hand } from 'lucide-react';
import Navbar from '../components/Student/Navbar';
import Sidebar from '../components/Student/Sidebar';
import {getAllBorrowedBooks} from "../services/bookService.js"; 

const Home = () => {
  const { navigate, token } = useContext(AuthContext);
  const [borrowedBooks, setBorrowedBooks] = useState([]);

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

  

  // ================= CALCULATIONS =================
  const totalBorrowed = borrowedBooks.filter(
    (b) => b.status === "borrowed"
  ).length;

  const totalReturned = borrowedBooks.filter(
    (b) => b.status === "returned"
  ).length;

  const total = totalBorrowed + totalReturned;

  // Avoid divide-by-zero
  const borrowedPercentage = total > 0 ? (totalBorrowed / total) * 100 : 0;
  const returnedPercentage = total > 0 ? (totalReturned / total) * 100 : 0;

  // Circle circumference (2πr where r = 120)
  const CIRCUMFERENCE = 2 * Math.PI * 120;

  return (
    <>
    <Navbar/>
    <Sidebar/>
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Section with Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Left Column - Navigation Cards */}
          <div className="space-y-4">
            {/* Borrowed Books Card */}
            <div 
              onClick={() => navigate('/')}
              className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Your Borrowed</h2>
                <h2 className="text-xl font-bold">Book List</h2>
              </div>
            </div>

            {/* Returned Books Card */}
            <div 
              onClick={() => navigate('/')}
              className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <RotateCcw className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Your Returned</h2>
                <h2 className="text-xl font-bold">Book List</h2>
              </div>
            </div>

            {/* Browse Inventory Card */}
            <div 
              onClick={() => navigate('/library-books')}
              className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <Hand className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Let's browse available</h2>
                <h2 className="text-xl font-bold">book inventory</h2>
              </div>
            </div>
          </div>

          {/* Right Column - Library Title and Pie Chart */}
          <div className="space-y-4">
            {/* Library Title */}
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <h1 className="text-4xl sm:text-5xl font-bold">CHIGGAS</h1>
              <p className="text-sm sm:text-base mt-1">LIBRARY</p>
            </div>

            {/* Pie Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-center mb-6">
                <svg width="280" height="280" viewBox="0 0 280 280" className="max-w-full">
                  {/* Borrowed */}
                  <circle
                    cx="140"
                    cy="140"
                    r="120"
                    fill="none"
                    stroke="#3D3E3E"
                    strokeWidth="60"
                    strokeDasharray={`${(borrowedPercentage / 100) * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                    transform="rotate(-90 140 140)"
                  />

                  {/* Returned */}
                  <circle
                    cx="140"
                    cy="140"
                    r="120"
                    fill="none"
                    stroke="#151619"
                    strokeWidth="60"
                    strokeDasharray={`${(returnedPercentage / 100) * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                    strokeDashoffset={`${-(borrowedPercentage / 100) * CIRCUMFERENCE}`}
                    transform="rotate(-90 140 140)"
                  />
                </svg>
              </div>

              {/* Legend */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 border-l-4 border-gray-600 pl-3">
                  <div className="w-4 h-4 bg-neutral-600 rounded-full"></div>
                  <span className="text-sm sm:text-base font-medium">
                    Total Borrowed Books ({totalBorrowed})
                  </span>
                </div>

                <div className="flex items-center gap-3 border-l-4 border-gray-900 pl-3">
                  <div className="w-4 h-4 bg-black rounded-full"></div>
                  <span className="text-sm sm:text-base font-medium">
                    Total Returned Books ({totalReturned})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quote Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
          <blockquote className="text-lg sm:text-xl font-medium leading-relaxed">
            "Embarking on the journey of reading fosters personal growth, nurturing a path towards excellence and the refinement of character."
          </blockquote>
          <p className="text-right text-gray-600 mt-4">~ BookWorm Team</p>
        </div>
      </div>
    </div>
    </>
  );
};

export default Home;