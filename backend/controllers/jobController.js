const Job = require('../models/Job');

// @desc    Get all jobs for a user (grouped by status)
// @route   GET /api/jobs/:userId
// @access  Public
const getJobsByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { grouped = 'true', status, limit, page = 1 } = req.query;

    if (grouped === 'true') {
      // Return jobs grouped by status
      const groupedJobs = await Job.getJobsByUserGrouped(userId);
      
      res.status(200).json({
        success: true,
        message: 'Jobs retrieved successfully',
        data: groupedJobs,
        count: Object.values(groupedJobs).flat().length
      });
    } else {
      // Return flat list with optional filtering and pagination
      const query = { userId };
      
      if (status) {
        query.status = status;
      }

      const options = {
        sort: { createdAt: -1 },
        limit: limit ? parseInt(limit) : undefined,
        skip: limit ? (parseInt(page) - 1) * parseInt(limit) : 0
      };

      const jobs = await Job.find(query, null, options);
      const total = await Job.countDocuments(query);

      res.status(200).json({
        success: true,
        message: 'Jobs retrieved successfully',
        data: jobs,
        count: jobs.length,
        total,
        page: parseInt(page),
        pages: limit ? Math.ceil(total / parseInt(limit)) : 1
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get job statistics for a user
// @route   GET /api/jobs/:userId/stats
// @access  Public
const getJobStats = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const stats = await Job.getJobStats(userId);
    
    // Calculate additional metrics
    const responseRate = stats.total > 0 ? 
      Math.round(((stats.Interviewing + stats.Offer) / stats.total) * 100) : 0;
    
    const successRate = stats.total > 0 ? 
      Math.round((stats.Offer / stats.total) * 100) : 0;

    res.status(200).json({
      success: true,
      message: 'Job statistics retrieved successfully',
      data: {
        ...stats,
        responseRate,
        successRate
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/job/:jobId
// @access  Public
const getJobById = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job retrieved successfully',
      data: job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new job
// @route   POST /api/jobs
// @access  Public
const createJob = async (req, res, next) => {
  try {
    const jobData = req.body;
    
    // Create new job
    const job = await Job.create(jobData);

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:jobId
// @access  Public
const updateJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const updateData = req.body;

    const job = await Job.findByIdAndUpdate(
      jobId,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job status (for drag and drop)
// @route   PATCH /api/jobs/:jobId/status
// @access  Public
const updateJobStatus = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const job = await Job.findByIdAndUpdate(
      jobId,
      { status },
      {
        new: true,
        runValidators: true
      }
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job status updated successfully',
      data: job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:jobId
// @access  Public
const deleteJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findByIdAndDelete(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully',
      data: job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk update jobs
// @route   PATCH /api/jobs/bulk
// @access  Public
const bulkUpdateJobs = async (req, res, next) => {
  try {
    const { jobs } = req.body;

    if (!Array.isArray(jobs) || jobs.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Jobs array is required'
      });
    }

    const updatePromises = jobs.map(({ id, ...updateData }) => 
      Job.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
    );

    const updatedJobs = await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: 'Jobs updated successfully',
      data: updatedJobs.filter(job => job !== null)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add interview to job
// @route   POST /api/jobs/:jobId/interviews
// @access  Public
const addInterview = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const interviewData = req.body;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    job.interviewDates.push(interviewData);
    await job.save();

    res.status(200).json({
      success: true,
      message: 'Interview added successfully',
      data: job
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJobsByUser,
  getJobStats,
  getJobById,
  createJob,
  updateJob,
  updateJobStatus,
  deleteJob,
  bulkUpdateJobs,
  addInterview
};