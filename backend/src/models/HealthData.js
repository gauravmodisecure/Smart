const mongoose = require('mongoose');

const healthDataSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  deviceId: {
    type: String,
    required: true
  },
  deviceName: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  heartRate: {
    bpm: {
      type: Number,
      min: 0,
      max: 300
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  steps: {
    count: {
      type: Number,
      min: 0
    },
    distance: {
      type: Number,
      min: 0
    },
    calories: {
      type: Number,
      min: 0
    }
  },
  spo2: {
    percentage: {
      type: Number,
      min: 0,
      max: 100
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  sleep: {
    duration: {
      type: Number,
      min: 0 // in minutes
    },
    quality: {
      type: String,
      enum: ['poor', 'fair', 'good', 'excellent']
    },
    stages: {
      deep: { type: Number, min: 0 },
      light: { type: Number, min: 0 },
      rem: { type: Number, min: 0 },
      awake: { type: Number, min: 0 }
    }
  },
  battery: {
    level: {
      type: Number,
      min: 0,
      max: 100
    },
    charging: {
      type: Boolean,
      default: false
    }
  },
  location: {
    latitude: Number,
    longitude: Number,
    accuracy: Number
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Index for efficient queries
healthDataSchema.index({ user: 1, timestamp: -1 });
healthDataSchema.index({ deviceId: 1, timestamp: -1 });

// Static method to get aggregated data for a user
healthDataSchema.statics.getAggregatedData = async function(userId, startDate, endDate) {
  return this.aggregate([
    { $match: { user: userId, timestamp: { $gte: startDate, $lte: endDate } } },
    {
      $group: {
        _id: {
          year: { $year: '$timestamp' },
          month: { $month: '$timestamp' },
          day: { $dayOfMonth: '$timestamp' }
        },
        avgHeartRate: { $avg: '$heartRate.bpm' },
        totalSteps: { $sum: '$steps.count' },
        avgSpO2: { $avg: '$spo2.percentage' },
        totalSleepMinutes: { $sum: '$sleep.duration' },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
  ]);
};

module.exports = mongoose.model('HealthData', healthDataSchema);
