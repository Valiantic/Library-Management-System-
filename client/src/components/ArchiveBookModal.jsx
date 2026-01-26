import { useState } from 'react';
import { X, Archive, BookOpen } from 'lucide-react';

export default function ArchiveBookModal({ isOpen, onClose, book, onToggleStatus, isArchived }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleToggleStatus = async () => {
    if (!book) return;

    setLoading(true);
    setError('');

    try {
      await onToggleStatus();
      onClose();
    } catch (err) {
      setError(err.message || `Failed to ${isArchived ? 'unarchive' : 'archive'} book`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
    setError('');
  };

  // Close modal if click on backdrop
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !book) return null;

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-50" onMouseDown={handleBackdropClick}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm" onMouseDown={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className={`${isArchived ? 'bg-green-100' : 'bg-orange-100'} p-2 rounded-lg`}>
              {isArchived ? (
                <BookOpen className="w-5 h-5 text-green-700" />
              ) : (
                <Archive className="w-5 h-5 text-orange-700" />
              )}
            </div>
            <h2 className="text-lg text-black font-semibold text-gray-900">
              {isArchived ? 'Unarchive Book' : 'Archive Book'}
            </h2>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="text-center">
            <p className="text-gray-700 mb-2">
              {isArchived
                ? 'Are you sure you want to unarchive this book?'
                : 'Are you sure you want to archive this book?'}
            </p>
            <p className="text-lg font-semibold text-gray-900">
              "{book.bookName}"
            </p>
            <p className="text-sm text-gray-500 mt-1">
              by {book.author}
            </p>
          </div>

          <p className={`text-sm ${isArchived ? 'text-green-600' : 'text-orange-600'} text-center`}>
            {isArchived
              ? 'This book will be visible in the inventory again.'
              : 'Archived books will not be displayed in the inventory.'}
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors text-sm"
            >
              CANCEL
            </button>
            <button
              type="button"
              onClick={handleToggleStatus}
              disabled={loading}
              className={`px-4 py-3 ${isArchived ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-600 hover:bg-orange-700'} text-black rounded-lg font-medium transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (isArchived ? 'RESTORING...' : 'ARCHIVING...') : (isArchived ? 'UNARCHIVE' : 'ARCHIVE')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
