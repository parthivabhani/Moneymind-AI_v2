import { Router } from 'express';
import { getDashboardData } from '../services/dashboardService';

const router = Router();

router.get('/summary', async (req, res) => {
  try {
    const userId = req.query.userId as string || 'demo';
    const dashboardData = await getDashboardData(userId);
    
    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch dashboard data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export { router as dashboardRouter };
