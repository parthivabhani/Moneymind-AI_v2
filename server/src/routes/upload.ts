import { Router } from 'express';
import multer from 'multer';
import { parseCSV } from '../services/csvParser';
import { validateFinancialData } from '../services/dataValidator';
import { processFinancialData } from '../services/dataProcessor';
import { storage as transactionStorage } from '../services/storage';

const router = Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.toLowerCase().endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  }
});

router.post('/csv', upload.single('file'), async (req, res) => {
  try {
    console.log('Upload request received:', {
      file: req.file?.originalname,
      size: req.file?.size,
      userId: req.body.userId
    });

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Parse CSV from buffer
    console.log('Parsing CSV...');
    const csvData = await parseCSV(req.file.buffer);
    console.log('Parsed CSV data:', csvData.length, 'transactions');
    
    // Validate financial data structure
    const validation = validateFinancialData(csvData);
    if (!validation.isValid) {
      console.log('Validation failed:', validation.errors);
      return res.status(400).json({ 
        error: 'Invalid data format',
        details: validation.errors 
      });
    }

    // Process and store financial data
    const processedData = await processFinancialData(csvData, req.body.userId || 'demo');
    console.log('Processed data:', processedData.transactions.length, 'transactions');
    
    // Store transactions in memory
    transactionStorage.setTransactions(req.body.userId || 'demo', processedData.transactions);
    console.log('Stored transactions for user:', req.body.userId || 'demo');

    res.json({
      success: true,
      message: 'File uploaded and processed successfully',
      data: {
        totalRecords: processedData.transactions.length,
        dateRange: processedData.dateRange,
        summary: processedData.summary
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Failed to process file',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export { router as uploadRouter };
