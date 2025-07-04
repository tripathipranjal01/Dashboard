import React from 'react';
import { Briefcase, FileText, TrendingUp, Users, Target, CheckCircle, XCircle, Clock, Award } from 'lucide-react';
import { Job } from '../types';
import { calculateDashboardStats } from '../utils/storage';

interface DashboardProps {
  jobs: Job[];
}

const Dashboard: React.FC<DashboardProps> = ({ jobs }) => {
  const stats = calculateDashboardStats(jobs);
  
  const recentJobs = jobs
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);

  const successRate = stats.total > 0 ? Math.round((stats.offer / stats.total) * 100) : 0;
  const responseRate = stats.total > 0 ? Math.round(((stats.interviewing + stats.offer) / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Your Career Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track your job applications, monitor your progress, and optimize your career journey with AI-powered insights.
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Total Applications */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Briefcase className="w-7 h-7 text-white" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm font-medium text-gray-500">Total Applications</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (stats.total / 50) * 100)}%` }}
              />
            </div>
          </div>

          {/* Active Interviews */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">{stats.interviewing}</p>
                <p className="text-sm font-medium text-gray-500">Active Interviews</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (stats.interviewing / 10) * 100)}%` }}
              />
            </div>
          </div>

          {/* Offers Received */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Award className="w-7 h-7 text-white" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">{stats.offer}</p>
                <p className="text-sm font-medium text-gray-500">Offers Received</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (stats.offer / 5) * 100)}%` }}
              />
            </div>
          </div>

          {/* Success Rate */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">{successRate}%</p>
                <p className="text-sm font-medium text-gray-500">Success Rate</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${successRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-gray-900">{stats.applied}</p>
                <p className="text-sm text-gray-600">Applications Sent</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-gray-900">{responseRate}%</p>
                <p className="text-sm text-gray-600">Response Rate</p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-gray-900">{stats.saved}</p>
                <p className="text-sm text-gray-600">Jobs Saved</p>
              </div>
              <Clock className="w-8 h-8 text-amber-500" />
            </div>
          </div>
        </div>

        {/* Application Pipeline */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Application Pipeline</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { status: 'saved', label: 'Saved', count: stats.saved, color: 'bg-gray-500', icon: Clock },
              { status: 'applied', label: 'Applied', count: stats.applied, color: 'bg-blue-500', icon: FileText },
              { status: 'interviewing', label: 'Interviewing', count: stats.interviewing, color: 'bg-amber-500', icon: Users },
              { status: 'offer', label: 'Offers', count: stats.offer, color: 'bg-green-500', icon: CheckCircle },
              { status: 'rejected', label: 'Rejected', count: stats.rejected, color: 'bg-red-500', icon: XCircle },
            ].map(({ status, label, count, color, icon: Icon }) => (
              <div key={status} className="text-center">
                <div className={`w-16 h-16 ${color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{count}</p>
                <p className="text-sm font-medium text-gray-600">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h3>
          
          {recentJobs.length > 0 ? (
            <div className="space-y-4">
              {recentJobs.map((job) => {
                const statusConfig = {
                  saved: { color: 'bg-gray-100 text-gray-700 border-gray-200', icon: Clock },
                  applied: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: FileText },
                  interviewing: { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Users },
                  offer: { color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
                  rejected: { color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
                  deleted: { color: 'bg-gray-100 text-gray-700 border-gray-200', icon: XCircle },
                };
                
                const config = statusConfig[job.status];
                const Icon = config.icon;
                
                return (
                  <div key={job.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${config.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{job.title}</p>
                        <p className="text-sm text-gray-600">{job.company}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize border ${config.color}`}>
                        {job.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(job.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h4>
              <p className="text-gray-600 mb-6">Start by adding your first job application to see your progress here.</p>
              <button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105">
                Add Your First Job
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;