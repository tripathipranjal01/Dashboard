const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./config/database');
const jobRoutes = require('./routes/jobRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Connect to database
connectDB();

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000'
    ];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Job Tracker API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/jobs', jobRoutes);

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Job Tracker API',
    version: '1.0.0',
    documentation: '/api/docs',
    endpoints: {
      jobs: '/api/jobs',
      health: '/health'
    }
  });
});

// API documentation route
app.get('/api/docs', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Job Tracker API Documentation',
    version: '1.0.0',
    endpoints: {
      'GET /api/jobs/:userId': 'Get all jobs for a user (grouped by status)',
      'GET /api/jobs/:userId/stats': 'Get job statistics for a user',
      'GET /api/jobs/job/:jobId': 'Get single job by ID',
      'POST /api/jobs': 'Create a new job',
      'PUT /api/jobs/:jobId': 'Update job details',
      'PATCH /api/jobs/:jobId/status': 'Update job status (for drag & drop)',
      'DELETE /api/jobs/:jobId': 'Delete a job',
      'PATCH /api/jobs/bulk': 'Bulk update multiple jobs',
      'POST /api/jobs/:jobId/interviews': 'Add interview to job'
    },
    examples: {
      createJob: {
        method: 'POST',
        url: '/api/jobs',
        body: {
          userId: 'user123',
          jobTitle: 'Software Engineer',
          company: 'Tech Corp',
          status: 'Saved',
          jobLink: 'https://example.com/job',
          notes: 'Interesting position',
          salary: '$80,000 - $120,000',
          location: 'San Francisco, CA',
          priority: 'High'
        }
      },
      updateStatus: {
        method: 'PATCH',
        url: '/api/jobs/60f7b3b3b3b3b3b3b3b3b3b3/status',
        body: {
          status: 'Applied'
        }
      }
    }
  });
});

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('❌ Unhandled Promise Rejection:', err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔄 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});

module.exports = app;