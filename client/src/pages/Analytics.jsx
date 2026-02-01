import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AnalyticsPanel from '../components/AnalyticsPanel';

const Analytics = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link to="/app" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 w-fit">
            <ArrowLeft className="size-4" />
            Geri qayıt
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analitika</h1>
            <p className="text-gray-600 mt-1">CV qurucu istifadə statistikasını görün</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnalyticsPanel />
      </div>
    </div>
  );
};

export default Analytics;
