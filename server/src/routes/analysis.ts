import { Router } from 'express';
import { generateForecast } from '../services/forecastService';
import { categorizeTransactions } from '../services/categorizer';
import { detectAnomalies } from '../services/anomalyDetector';

const router = Router();

router.post('/forecast', async (req, res) => {
  try {
    const { transactions, userId } = req.body;
    
    if (!transactions && !userId) {
      return res.status(400).json({ error: 'Transactions or userId required' });
    }
    
    const forecast = await generateForecast(transactions);
    
    res.json({
      success: true,
      data: forecast
    });
  } catch (error) {
    console.error('Forecast error:', error);
    res.status(500).json({ 
      error: 'Failed to generate forecast',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.post('/categorize', async (req, res) => {
  try {
    const { transactions } = req.body;
    
    if (!transactions || !Array.isArray(transactions)) {
      return res.status(400).json({ error: 'Transactions array required' });
    }
    
    const categorizedTransactions = categorizeTransactions(transactions);
    
    res.json({
      success: true,
      data: categorizedTransactions
    });
  } catch (error) {
    console.error('Categorization error:', error);
    res.status(500).json({ 
      error: 'Failed to categorize transactions',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.post('/anomalies', async (req, res) => {
  try {
    const { transactions } = req.body;
    
    if (!transactions || !Array.isArray(transactions)) {
      return res.status(400).json({ error: 'Transactions array required' });
    }
    
    const anomalies = await detectAnomalies(transactions);
    
    res.json({
      success: true,
      data: anomalies
    });
  } catch (error) {
    console.error('Anomaly detection error:', error);
    res.status(500).json({ 
      error: 'Failed to detect anomalies',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export { router as analysisRouter };
