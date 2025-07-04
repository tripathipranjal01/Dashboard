const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    trim: true
  },
  jobTitle: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [200, 'Job title cannot exceed 200 characters']
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  status: {
    type: String,
    enum: {
      values: ['Saved', 'Applied', 'Interviewing', 'Offer', 'Rejected'],
      message: 'Status must be one of: Saved, Applied, Interviewing, Offer, Rejected'
    },
    default: 'Saved',
    required: true
  },
  jobLink: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        // Allow empty string or valid URL
        if (!v) return true;
        try {
          new URL(v);
          return true;
        } catch {
          return false;
        }
      },
      message: 'Please provide a valid URL'
    }
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  salary: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  deadline: {
    type: Date
  },
  contactPerson: {
    name: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    }
  },
  interviewDates: [{
    round: {
      type: String,
      trim: true
    },
    date: {
      type: Date
    },
    type: {
      type: String,
      enum: ['Phone', 'Video', 'In-Person', 'Technical', 'HR', 'Final'],
      default: 'Video'
    },
    notes: {
      type: String,
      trim: true
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
jobSchema.index({ userId: 1, status: 1 });
jobSchema.index({ userId: 1, createdAt: -1 });
jobSchema.index({ userId: 1, applicationDate: -1 });

// Virtual for days since application
jobSchema.virtual('daysSinceApplication').get(function() {
  if (!this.applicationDate) return null;
  const diffTime = Math.abs(new Date() - this.applicationDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to update applicationDate when status changes to 'Applied'
jobSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'Applied' && !this.applicationDate) {
    this.applicationDate = new Date();
  }
  next();
});

// Static method to get jobs grouped by status
jobSchema.statics.getJobsByUserGrouped = async function(userId) {
  const jobs = await this.find({ userId }).sort({ createdAt: -1 });
  
  const grouped = {
    Saved: [],
    Applied: [],
    Interviewing: [],
    Offer: [],
    Rejected: []
  };
  
  jobs.forEach(job => {
    if (grouped[job.status]) {
      grouped[job.status].push(job);
    }
  });
  
  return grouped;
};

// Static method to get job statistics
jobSchema.statics.getJobStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const result = {
    total: 0,
    Saved: 0,
    Applied: 0,
    Interviewing: 0,
    Offer: 0,
    Rejected: 0
  };
  
  stats.forEach(stat => {
    result[stat._id] = stat.count;
    result.total += stat.count;
  });
  
  return result;
};

module.exports = mongoose.model('Job', jobSchema);