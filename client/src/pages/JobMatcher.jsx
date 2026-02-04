import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Zap, AlertCircle, CheckCircle, TrendingUp, Upload } from 'lucide-react';
import { useSelector } from 'react-redux';
import jobMatchService from '../services/jobMatchService';
import toast from 'react-hot-toast';
import pdfToText from 'react-pdftotext';

const JobMatcher = () => {
  const { token } = useSelector(state => state.auth);
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [atsScore, setAtsScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('match'); // 'match' or 'ats'

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const processFile = async (file) => {
    if (!file.type.includes('pdf')) {
      toast.error('Please select a PDF file');
      return;
    }

    try {
      setResumeFile(file);
      const text = await pdfToText(file);
      setResumeText(text);
      toast.success('Resume uploaded successfully! ✓');
    } catch (error) {
      console.error('PDF parse error:', error);
      toast.error('PDF file could not be read. Try another PDF.');
      setResumeFile(null);
      setResumeText('');
    }
  };

  const handleDragDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer?.files?.[0];
    if (file) processFile(file);
  };

  const handleAnalyzeJobMatch = async () => {
    if (!jobDescription.trim() || !resumeText) {
      toast.error('Enter job description and resume');
      return;
    }

    try {
      setLoading(true);
      const result = await jobMatchService.analyzeJobMatch(jobDescription, resumeText);
      setAnalysis(result);
      toast.success('Analysis completed!');
    } catch (error) {
      console.error('Match analysis error:', error);
      toast.error(error?.response?.data?.message || 'Error during analysis');
    } finally {
      setLoading(false);
    }
  };

  const handleOptimizeATS = async () => {
    if (!resumeText) {
      toast.error('Upload resume');
      return;
    }

    try {
      setLoading(true);
      const result = await jobMatchService.optimizeForATS(resumeText);
      setAtsScore(result);
      toast.success('ATS analysis completed!');
    } catch (error) {
      console.error('ATS optimization error:', error);
      toast.error(error?.response?.data?.message || 'Error during ATS analysis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link to="/app" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 w-fit">
            <ArrowLeft className="size-4" />
            Go Back
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Job Description Analysis</h1>
            <p className="text-gray-600 mt-1">Compare your resume with job description and optimize ATS</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('match')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'match'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Search className="inline size-4 mr-2" />
            Job Description Analysis
          </button>
          <button
            onClick={() => setActiveTab('ats')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'ats'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Zap className="inline size-4 mr-2" />
            ATS Optimization
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h2 className="text-xl font-bold mb-4">Resume Upload</h2>
            
            <div className="mb-4">
              <label htmlFor="resume-input" className="block text-sm font-semibold mb-2 text-gray-700">
                Resume File
              </label>
              <div 
                onClick={() => document.getElementById('resume-input')?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={handleDragDrop}
                className='flex flex-col items-center justify-center gap-2 border group text-gray-400 border-gray-300 border-dashed rounded-md p-6 py-10 hover:border-blue-500 hover:text-blue-600 cursor-pointer transition-colors'
              >
                {resumeFile ? (
                  <div className='text-center'>
                    <p className='text-blue-600 font-semibold'>{resumeFile.name}</p>
                    <p className='text-xs text-gray-500 mt-1'>Click to change</p>
                  </div>
                ) : (
                  <>
                    <Upload className='size-8 stroke-1' />
                    <p className='font-semibold'>Upload Resume PDF</p>
                    <p className='text-xs text-gray-400'>or drag here</p>
                  </>
                )}
              </div>
              <input 
                type='file' 
                id='resume-input' 
                accept='.pdf' 
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
            </div>

            {resumeText && (
              <div className='mb-4 p-3 bg-green-50 border border-green-200 rounded-lg'>
                <p className='text-sm text-green-700'>✓ Resume read successfully</p>
                <p className='text-xs text-green-600 mt-1'>{resumeText.length} characters read</p>
              </div>
            )}

            {activeTab === 'match' && (
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Job Description
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-32"
                  placeholder="Paste job description here..."
                />
              </div>
            )}

            <button
              onClick={activeTab === 'match' ? handleAnalyzeJobMatch : handleOptimizeATS}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? 'Analyzing...' : activeTab === 'match' ? 'Analyze' : 'Optimize ATS'}
            </button>
          </div>

          {/* Results Panel */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h2 className="text-xl font-bold mb-4">
              {activeTab === 'match' ? 'Match Results' : 'ATS Results'}
            </h2>

            {activeTab === 'match' && analysis && (
              <div className="space-y-4">
                {/* Match Percentage */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-700">Match Percentage</span>
                    <span className="text-3xl font-bold text-blue-600">{analysis.matchPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${analysis.matchPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Matched Skills */}
                {analysis.matchedSkills?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                      <CheckCircle className="size-4" />
                      Matched Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.matchedSkills.map((skill, i) => (
                        <span key={i} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Skills */}
                {analysis.missingSkills?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                      <AlertCircle className="size-4" />
                      Missing Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.missingSkills.map((skill, i) => (
                        <span key={i} className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {analysis.recommendations?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-orange-700 mb-2">Recommendations</h3>
                    <ul className="space-y-1">
                      {analysis.recommendations.map((rec, i) => (
                        <li key={i} className="text-sm text-gray-700 flex gap-2">
                          <span>•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'ats' && atsScore && (
              <div className="space-y-4">
                {/* ATS Score */}
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-700">ATS Score</span>
                    <span className="text-3xl font-bold text-green-600">{atsScore.atsScore}%</span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{ width: `${atsScore.atsScore}%` }}
                    />
                  </div>
                </div>

                {/* Issues */}
                {atsScore.issues?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-red-700 mb-2">Issues</h3>
                    <ul className="space-y-1">
                      {atsScore.issues.map((issue, i) => (
                        <li key={i} className="text-sm text-gray-700">• {issue}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Keywords to Add */}
                {atsScore.keywords?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-blue-700 mb-2">Keywords to Add</h3>
                    <div className="flex flex-wrap gap-2">
                      {atsScore.keywords.map((keyword, i) => (
                        <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Improvements */}
                {atsScore.improvements?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-green-700 mb-2">Improvements</h3>
                    <ul className="space-y-1">
                      {atsScore.improvements.map((imp, i) => (
                        <li key={i} className="text-sm text-gray-700">• {imp}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {!analysis && !atsScore && (
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="size-12 mx-auto mb-3 text-gray-300" />
                <p>Analysis results will be displayed here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobMatcher;
