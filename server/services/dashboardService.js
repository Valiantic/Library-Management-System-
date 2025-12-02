import Books from '../model/Book.js';
import Users from '../model/User.js';
import { Op } from 'sequelize';

// GET DASHBOARD STATS
export const getDashboardStatsService = async () => {
    try {
        // Get total active users
        const totalUsers = await Users.count({
            where: { status: 'active' }
        });

        // Get total active books count
        const totalBooks = await Books.count({
            where: { status: 'active' }
        });

        // Get total book quantity (available copies)
        const bookQuantityResult = await Books.sum('quantity', {
            where: { status: 'active' }
        });
        const totalBookCopies = bookQuantityResult || 0;

        // Get archived books count
        const archivedBooks = await Books.count({
            where: { status: 'archived' }
        });

        // Get books by category
        const booksByCategory = await Books.findAll({
            where: { status: 'active' },
            attributes: [
                'category',
                [Books.sequelize.fn('COUNT', Books.sequelize.col('bookId')), 'count'],
                [Books.sequelize.fn('SUM', Books.sequelize.col('quantity')), 'totalQuantity']
            ],
            group: ['category'],
            order: [[Books.sequelize.fn('COUNT', Books.sequelize.col('bookId')), 'DESC']],
            limit: 5
        });

        // Get recently added books
        const recentBooks = await Books.findAll({
            where: { status: 'active' },
            order: [['createdAt', 'DESC']],
            limit: 5,
            attributes: ['bookId', 'bookName', 'author', 'category', 'quantity', 'createdAt']
        });

        // Get recently registered users
        const recentUsers = await Users.findAll({
            where: { status: 'active' },
            order: [['createdAt', 'DESC']],
            limit: 5,
            attributes: ['userId', 'firstName', 'lastName', 'emailAddress', 'role', 'createdAt']
        });

        // For now, since we don't have a borrowing system yet, we'll show placeholder data
        // This can be updated when borrowing functionality is implemented
        const borrowedBooks = 0;
        const availableBooks = totalBookCopies;

        return {
            success: true,
            stats: {
                totalUsers,
                totalBooks,
                totalBookCopies,
                archivedBooks,
                borrowedBooks,
                availableBooks,
                booksByCategory,
                recentBooks,
                recentUsers
            }
        };
    } catch (error) {
        console.error('Error in getDashboardStatsService:', error);
        return {
            success: false,
            message: 'Failed to fetch dashboard stats'
        };
    }
};
