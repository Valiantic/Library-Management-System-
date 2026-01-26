/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { X, BookOpen } from 'lucide-react';
import { addBook } from '../services/bookService';

export default function AddBookModal({ isOpen, onClose, onBookAdded }) {
  const [formData, setFormData] = useState({
    bookId: '',
    bookName: '',
    author: '',
    category: '',
    quantity: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    // Validate form data
    if (!formData.bookName.trim() || !formData.author.trim() || !formData.category.trim() || !formData.quantity) {
      setError('All fields are required');
      return;
    }

    if (Number(formData.quantity) < 0) {
      setError('Quantity must be a positive number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await addBook({
        bookName: formData.bookName,
        author: formData.author,
        category: formData.category,
        quantity: Number(formData.quantity)
      });

      if (result.success) {
        setFormData({ bookId: '', bookName: '', author: '', category: '', quantity: '' });
        onClose();
        if (onBookAdded) {
          onBookAdded();
        }
      } else {
        setError(result.message || 'Failed to add book');
      }
    } catch (err) {
      setError('An error occurred while adding the book');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
    setFormData({ bookId: '', bookName: '', author: '', category: '', quantity: '' });
    setError('');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  if (!isOpen) return null;

  // Close modal if click on backdrop
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-50" onMouseDown={handleBackdropClick}>
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm" onMouseDown={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-2 rounded-lg">
              <BookOpen className="w-5 h-5 text-gray-700" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Add Book</h2>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-4">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Book Name Input */}
          <input
            type="text"
            name="bookName"
            placeholder="Book Name"
            value={formData.bookName}
            onChange={handleChange}
            className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
          />

          {/* Author Input */}
          <input
            type="text"
            name="author"
            placeholder="Author"
            value={formData.author}
            onChange={handleChange}
            className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
          />

          {/* Category and Quantity Row */}
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              className="px-4 text-black py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="px-4 text-black py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-3 bg-gray-200 text-black rounded-lg font-medium hover:bg-gray-300 transition-colors text-sm"
            >
              CANCEL
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-3 bg-black text-black rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'ADDING...' : 'ADD'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}