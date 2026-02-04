import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BarChart3, TrendingUp, FileText, Download, Clock, Activity } from 'lucide-react';
import { incrementTimeSpent, incrementSession, setAnalytics } from '../app/features/analyticsSlice';
import analyticsService from '../services/analyticsService';
import toast from 'react-hot-toast';

const AnalyticsPanel = () => {
  const dispatch = useDispatch();
  const analytics = useSelector(state => state.analytics);
  const [sessionTime, setSessionTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load analytics data from server
  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setIsLoading(true);
        const serverAnalytics = await analyticsService.getAnalytics();
        dispatch(setAnalytics(serverAnalytics));
      } catch (error) {
        console.error('Error while loading analytics:', error);
        toast.error('Failed to load analytics');
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalytics();
  }, [dispatch]);

  // Start session and track time
  useEffect(() => {
    dispatch(incrementSession());
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
      dispatch(incrementTimeSpent(1));
    }, 1000);

    return () => clearInterval(timer);
  }, [dispatch]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  const getMostUsedTemplate = () => {
    let maxCount = 0;
    let maxTemplate = '';
    
    const templatesUsed = analytics.templatesUsed || {};
    Object.entries(templatesUsed).forEach(([template, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxTemplate = template;
      }
    });
    
    return { template: maxTemplate, count: maxCount };
  };

  const mostUsed = getMostUsedTemplate();

  const stats = [
    {
      label: 'Created Resumes',
      value: analytics.resumesCreated,
      icon: FileText,
      color: 'from-blue-100 to-blue-200',
      textColor: 'text-blue-600',
    },
    {
      label: 'Viewed Resumes',
      value: analytics.resumesViewed,
      icon: TrendingUp,
      color: 'from-green-100 to-green-200',
      textColor: 'text-green-600',
    },
    {
      label: 'Downloaded Resumes',
      value: analytics.downloadsCount,
      icon: Download,
      color: 'from-purple-100 to-purple-200',
      textColor: 'text-purple-600',
    },
    {
      label: 'Total Session Time',
      value: formatTime(analytics.totalTimeSpent),
      icon: Clock,
      color: 'from-orange-100 to-orange-200',
      textColor: 'text-orange-600',
    },
  ];

  return (
    <div className="space-y-8">
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin">
              <Activity className="size-8 text-blue-600" />
            </div>
            <p className="mt-3 text-gray-600">Loading analytics...</p>
          </div>
        </div>
      ) : (
        <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
            <BarChart3 className="size-7" />
            Usage Statistics
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Detailed overview of resume builder activity
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`bg-gradient-to-br ${stat.color} rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.textColor} mt-2`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.textColor} opacity-20`}>
                  <Icon className="size-12" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Template Usage */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <BarChart3 className="size-5" />
          Template Usage
        </h3>

        <div className="space-y-4">
          {Object.entries(analytics.templatesUsed).map(([template, count]) => {
            const maxCount = Math.max(...Object.values(analytics.templatesUsed), 1);
            const percentage = (count / maxCount) * 100;
            const templateNames = {
              classic: 'Classic',
              minimal: 'Minimal',
              modern: 'Modern',
              'minimal-image': 'Minimal with Image',
              'modern-colorful': 'Colorful Modern',
              timeline: 'Timeline',
              creative: 'Creative',
              professional: 'Professional',
            };

            return (
              <div key={template}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {templateNames[template] || template}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {count} times
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {mostUsed.count > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Most used template:</span>{' '}
              {Object.keys(analytics.templatesUsed).find(k => analytics.templatesUsed[k] === mostUsed.count)
                ? Object.keys(analytics.templatesUsed)
                    .filter(k => analytics.templatesUsed[k] === mostUsed.count)
                    .map(k => ({
                      classic: 'Classic',
                      minimal: 'Minimal',
                      modern: 'Modern',
                      minimalImage: 'Minimal with Image',
                    }[k]))
                    .join(', ')
                : 'Not used yet'}
            </p>
          </div>
        )}
      </div>

      {/* Activity Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white rounded-lg p-3">
              <Activity className="size-6" />
            </div>
            <div>
              <p className="text-sm text-indigo-900">Total Sessions</p>
              <p className="text-2xl font-bold text-indigo-600">{analytics.sessionsCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-600 text-white rounded-lg p-3">
              <Clock className="size-6" />
            </div>
            <div>
              <p className="text-sm text-cyan-900">Total Time</p>
              <p className="text-2xl font-bold text-cyan-600">
                {formatTime(analytics.totalTimeSpent)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-rose-100 to-rose-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-rose-600 text-white rounded-lg p-3">
              <TrendingUp className="size-6" />
            </div>
            <div>
              <p className="text-sm text-rose-900">Average Download Rate</p>
              <p className="text-2xl font-bold text-rose-600">
                {analytics.resumesCreated > 0
                  ? ((analytics.downloadsCount / analytics.resumesCreated) * 100).toFixed(1)
                  : 0}
                %
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Last Activity */}
      {analytics.lastActivityDate && (
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-600">
            <span className="font-semibold">Last activity:</span>{' '}
            {new Date(analytics.lastActivityDate).toLocaleString('en-US')}
          </p>
        </div>
      )}
        </>
      )}
    </div>
  );
};

export default AnalyticsPanel;
