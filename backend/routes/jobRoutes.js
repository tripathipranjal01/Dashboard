const express = require('express');
const router = express.Router();

const {
  getJobsByUser,
  getJobStats,
  getJobById,
  createJob,
  updateJob,
  updateJobStatus,
  deleteJob,
  bulkUpdateJobs,
  addInterview
} = require('../controllers/jobController');

const {
  validateJob,
  validateJobUpdate,
  validateJobId,
  validateUserId
} = require('../middleware/validation');

// Job routes
router.route('/')
  .post(validateJob, createJob);

router.route('/bulk')
  .patch(bulkUpdateJobs);

router.route('/:userId')
  .get(validateUserId, getJobsByUser);

router.route('/:userId/stats')
  .get(validateUserId, getJobStats);

router.route('/job/:jobId')
  .get(validateJobId, getJobById);

router.route('/:jobId')
  .put(validateJobId, validateJobUpdate, updateJob)
  .delete(validateJobId, deleteJob);

router.route('/:jobId/status')
  .patch(validateJobId, updateJobStatus);

router.route('/:jobId/interviews')
  .post(validateJobId, addInterview);

module.exports = router;