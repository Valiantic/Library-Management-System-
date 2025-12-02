import express from 'express';
import { getDashboardStatsController } from '../controllers/dashboardController.js';
import userAuth from '../middleware/userAuth.js';

const dashboardRouter = express.Router();

// GET dashboard stats
dashboardRouter.get('/stats', userAuth, getDashboardStatsController);

export default dashboardRouter;
