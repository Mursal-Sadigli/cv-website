import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='flex flex-col items-center justify-center h-screen gap-4'>
          <h1 className='text-2xl font-bold text-red-600'>Xəta baş verdi</h1>
          <p className='text-gray-600'>{this.state.error?.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700'
          >
            Səhifəni yenilə
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
