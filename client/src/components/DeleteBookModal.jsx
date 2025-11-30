import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { deleteBook } from '../services/bookService';

export default function DeleteBookModal({ isOpen, onClose, book, onBookDeleted }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!book) return;

    setLoading(true);
    setError('');

    try {
      const result = await deleteBook(book.bookId);

      if (result.success) {
        onClose();
        if (onBookDeleted) {
          onBookDeleted();
        }
      } else {
        setError(result.message || 'Failed to delete book');
      }
    } catch (err) {
      setError('An error occurred while deleting the book');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
    setError('');
  };

  if (!isOpen || !book) return null;

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-700" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Delete Book</h2>
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
              Are you sure you want to delete this book?
            </p>
            <p className="text-lg font-semibold text-gray-900">
              "{book.bookName}"
            </p>
            <p className="text-sm text-gray-500 mt-1">
              by {book.author}
            </p>
          </div>

          <p className="text-sm text-red-600 text-center">
            This action cannot be undone.
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
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'DELETING...' : 'DELETE'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
