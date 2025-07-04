import React from 'react';
import { Edit3, Trash2, Calendar, Building } from 'lucide-react';
import { Job } from '../types';

interface JobCardProps {
  job: Job;
  onDragStart: (e: React.DragEvent, job: Job) => void;
  onEdit: () => void;
  onDelete: () => void;
}

const JobCard: React.FC<JobCardProps> = ({
  job,
  onDragStart,
  onEdit,
  onDelete,
}) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, job)}
      className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-move"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 truncate">{job.title}</h4>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <Building className="w-3 h-3 mr-1" />
            <span className="truncate">{job.company}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center text-xs text-gray-500 mb-3">
        <Calendar className="w-3 h-3 mr-1" />
        <span>{new Date(job.dateApplied).toLocaleDateString()}</span>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-1 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded transition-colors"
            title="Edit Job"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
            title="Delete Job"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;