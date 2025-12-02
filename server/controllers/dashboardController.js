import { getDashboardStatsService } from '../services/dashboardService.js';

export const getDashboardStatsController = async (req, res) => {
    try {
        const result = await getDashboardStatsService();
        
        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(500).json(result);
        }
    } catch (error) {
        console.error('Error in getDashboardStatsController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
