import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, RotateCcw, Hand } from 'lucide-react';
import Navbar from '../components/Student/Navbar';
import Sidebar from '../components/Student/Sidebar';

const Home = () => {
  const { navigate } = useContext(AuthContext);

  // Empty data for now - will be populated from backend later
  const totalBorrowed = 0;
  const totalReturned = 0;
  const total = totalBorrowed + totalReturned;

  // Calculate pie chart segments
  const borrowedPercentage = total > 0 ? (totalBorrowed / total) * 100 : 50;
  const returnedPercentage = total > 0 ? (totalReturned / total) * 100 : 50;

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
                  <circle
                    cx="140"
                    cy="140"
                    r="120"
                    fill="none"
                    stroke="#3D3E3E"
                    strokeWidth="60"
                    strokeDasharray={`${(borrowedPercentage / 100) * 754} 754`}
                    transform="rotate(-90 140 140)"
                  />
                  <circle
                    cx="140"
                    cy="140"
                    r="120"
                    fill="none"
                    stroke="#151619"
                    strokeWidth="60"
                    strokeDasharray={`${(returnedPercentage / 100) * 754} 754`}
                    strokeDashoffset={`${-(borrowedPercentage / 100) * 754}`}
                    transform="rotate(-90 140 140)"
                  />
                </svg>
              </div>

              {/* Legend */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 border-l-4 border-gray-600 pl-3">
                  <div className="w-4 h-4 bg-neutral-600 rounded-full flex-shrink-0"></div>
                  <span className="text-sm sm:text-base font-medium">Total Borrowed Books</span>
                </div>
                <div className="flex items-center gap-3 border-l-4 border-gray-900 pl-3">
                  <div className="w-4 h-4 bg-black rounded-full flex-shrink-0"></div>
                  <span className="text-sm sm:text-base font-medium">Total Returned Books</span>
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