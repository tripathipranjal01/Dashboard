import React, { useState, useEffect } from 'react';
import { X, Calendar, Building, FileText, Briefcase, AlertTriangle } from 'lucide-react';
import { Job, JobStatus } from '../types';
import { DuplicateCheckResult } from '../utils/duplicateDetection';

interface JobFormProps {
  job?: Job | null;
  onSubmit: (job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => { success: boolean; duplicateCheck: DuplicateCheckResult };
  onCancel: () => void;
}

const JobForm: React.FC<JobFormProps> = ({ job, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    dateApplied: new Date().toISOString().split('T')[0],
    status: 'saved' as JobStatus,
  });
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        company: job.company,
        description: job.description,
        dateApplied: job.dateApplied,
        status: job.status,
      });
    }
  }, [job]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.company.trim()) {
      return;
    }

    setIsSubmitting(true);
    setDuplicateWarning(null);

    try {
      const result = onSubmit(formData);
      
      if (!result.success && result.duplicateCheck.isDuplicate) {
        setDuplicateWarning(result.duplicateCheck.message || 'This job already exists');
        setIsSubmitting(false);
        return;
      }

      // Success - form will be closed by parent component
    } catch (error) {
      console.error('Error submitting job:', error);
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear duplicate warning when user modifies the form
    if (duplicateWarning) {
      setDuplicateWarning(null);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {job ? 'Edit Job Application' : 'Add New Job Application'}
        </h3>
        <button
          onClick={onCancel}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Duplicate Warning */}
      {duplicateWarning && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-amber-900 font-medium">Duplicate Job Detected</h4>
              <p className="text-amber-800 text-sm mt-1">{duplicateWarning}</p>
              <p className="text-amber-700 text-xs mt-2">
                Please check your existing applications or modify the job details if this is a different position.
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              <Briefcase className="w-4 h-4 inline mr-1" />
              Job Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., Senior Software Engineer"
            />
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
              <Building className="w-4 h-4 inline mr-1" />
              Company *
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., Google"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="dateApplied" className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Date Applied
            </label>
            <input
              type="date"
              id="dateApplied"
              name="dateApplied"
              value={formData.dateApplied}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="saved">Saved</option>
              <option value="applied">Applied</option>
              <option value="interviewing">Interviewing</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4 inline mr-1" />
            Job Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-vertical"
            placeholder="Paste the job description here for AI resume optimization..."
          />
          <p className="text-xs text-gray-500 mt-1">
            Adding a job description helps our AI optimize your resume for better matching
          </p>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            {isSubmitting ? 'Checking...' : (job ? 'Update Job' : 'Add Job')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobForm;