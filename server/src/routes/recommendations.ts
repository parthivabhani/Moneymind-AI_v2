import { Router } from 'express';
import { generateRecommendations } from '../services/recommendationEngine';
import { storage } from '../services/storage';
import { sampleTransactions } from '../services/dashboardService';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId as string || 'demo';
    
    // Check if user has uploaded data, otherwise use sample data if it's demo mode
    const transactions = storage.hasTransactions(userId) 
      ? storage.getTransactions(userId) 
      : sampleTransactions;
      
    const recommendations = await generateRecommendations(transactions);
    
    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch recommendations',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const { transactions, userId, goals } = req.body;
    
    if (!transactions && !userId) {
      return res.status(400).json({ error: 'Transactions or userId required' });
    }
    
    const recommendations = await generateRecommendations(transactions, goals);
    
    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ 
      error: 'Failed to generate recommendations',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export { router as recommendationsRouter };
