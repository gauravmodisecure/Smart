const HealthData = require('../models/HealthData');

// @desc    Get current health data
// @route   GET /api/health/data
// @access  Private
const getHealthData = async (req, res) => {
  try {
    // Get latest health data for the user
    const latestData = await HealthData.findOne(
      { user: req.user.id },
      {},
      { sort: { timestamp: -1 } }
    );

    res.json({
      success: true,
      data: latestData || null
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Save health data
// @route   POST /api/health/data
// @access  Private
const saveHealthData = async (req, res) => {
  try {
    const healthData = {
      ...req.body,
      user: req.user.id
    };

    const savedData = await HealthData.create(healthData);

    // Broadcast real-time update to user's room
    global.io.to(`user_${req.user.id}`).emit('health-data-update', savedData);

    res.status(201).json({
      success: true,
      data: savedData
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get health history
// @route   GET /api/health/history
// @access  Private
const getHealthHistory = async (req, res) => {
  try {
    const { startDate, endDate, limit = 100 } = req.query;

    let query = { user: req.user.id };

    if (startDate && endDate) {
      query.timestamp = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const history = await HealthData.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete health data
// @route   DELETE /api/health/data/:id
// @access  Private
const deleteHealthData = async (req, res) => {
  try {
    const healthData = await HealthData.findById(req.params.id);

    if (!healthData) {
      return res.status(404).json({
        success: false,
        error: 'Health data not found'
      });
    }

    // Make sure user owns the data
    if (healthData.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this data'
      });
    }

    await HealthData.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Health data deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get aggregated health data
// @route   GET /api/health/aggregated
// @access  Private
const getAggregatedData = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Start date and end date are required'
      });
    }

    const aggregatedData = await HealthData.getAggregatedData(
      req.user.id,
      new Date(startDate),
      new Date(endDate)
    );

    res.json({
      success: true,
      data: aggregatedData
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getHealthData,
  saveHealthData,
  getHealthHistory,
  deleteHealthData,
  getAggregatedData
};
