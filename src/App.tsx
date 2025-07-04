import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import JobTracker from './components/JobTracker';
import ResumeOptimizer from './components/ResumeOptimizer';
import PDFUploader from './components/PDFUploader';
import { useJobs } from './hooks/useJobs';
import { useOptimizedResumes } from './hooks/useOptimizedResumes';
import { ParsedResumeData } from './utils/pdfParser';
import { BaseResume } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showPDFUploader, setShowPDFUploader] = useState(false);
  const [baseResume, setBaseResume] = useState<BaseResume | null>(null);
  
  const {
    jobs,
    isLoading: jobsLoading,
    addJob,
    updateJob,
    deleteJob,
    updateJobStatus,
  } = useJobs('demo-user');
  
  const {
    optimizedResumes,
    isLoading: resumesLoading,
    addOptimizedResume,
  } = useOptimizedResumes();

  // Load base resume from localStorage on mount
  useEffect(() => {
    const savedResume = localStorage.getItem('base-resume-demo-user');
    if (savedResume) {
      setBaseResume(JSON.parse(savedResume));
    }
  }, []);

  const handleUploadPDFResume = (resumeData: ParsedResumeData) => {
    // Convert PDF data to base resume format
    const baseResumeFromPDF: BaseResume = {
      id: `base-resume-${Date.now()}`,
      name: resumeData.contact.name ? `${resumeData.contact.name}'s Resume` : 'Uploaded PDF Resume',
      content: resumeData.text,
      skills: resumeData.skills,
      experience: resumeData.experience,
      education: resumeData.education,
      userId: 'demo-user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setBaseResume(baseResumeFromPDF);
    localStorage.setItem('base-resume-demo-user', JSON.stringify(baseResumeFromPDF));
    setShowPDFUploader(false);
  };

  if (jobsLoading || resumesLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading FLASHFIRE...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main>
          {activeTab === 'dashboard' && <Dashboard jobs={jobs} />}
          
          {activeTab === 'jobs' && (
            <JobTracker
              jobs={jobs}
              baseResume={baseResume}
              optimizedResumes={optimizedResumes}
              onAddJob={addJob}
              onUpdateJob={updateJob}
              onDeleteJob={deleteJob}
              onUpdateJobStatus={updateJobStatus}
              onAddOptimizedResume={addOptimizedResume}
              onShowPDFUploader={() => setShowPDFUploader(true)}
            />
          )}

          {activeTab === 'optimizer' && (
            <ResumeOptimizer
              baseResume={baseResume}
              onShowPDFUploader={() => setShowPDFUploader(true)}
            />
          )}
        </main>

        {/* PDF Uploader Modal */}
        {showPDFUploader && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <PDFUploader
                onResumeUploaded={handleUploadPDFResume}
                onCancel={() => setShowPDFUploader(false)}
              />
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;