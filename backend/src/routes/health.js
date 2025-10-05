const express = require('express');
const {
  getHealthData,
  saveHealthData,
  getHealthHistory,
  deleteHealthData,
  getAggregatedData
} = require('../controllers/healthController');

const router = express.Router();

// All health routes are now public (no authentication required)
router.get('/data', getHealthData);
router.post('/data', saveHealthData);
router.get('/history', getHealthHistory);
router.get('/aggregated', getAggregatedData);
router.delete('/data/:id', deleteHealthData);

module.exports = router;
