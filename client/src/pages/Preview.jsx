import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { dummyResumeData } from '../assets/assets'
import ResumePreview from '../components/ResumePreview'
import { ArrowLeftIcon, Loader } from 'lucide-react'
import api from '../configs/api'

const Preview = () => {
  const {resumeId} = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [resumeData, setResumeData] = useState(null)
  const [error, setError] = useState(null)

  const loadResume = async () => {
    try {
      setIsLoading(true)
      const {data} = await api.get(`/api/resumes/public/${resumeId}`)
      if(data && data.resume){
        setResumeData(data.resume)
        console.log('Resume loaded:', data.resume)
      } else {
        setError('Resume data not found')
      }
    } catch (error) {
      console.error('Error loading resume:', error.message)
      setError(error?.response?.data?.message || 'Error loading resume')
    } finally{
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if(resumeId){
      loadResume()
    }
  }, [resumeId])

  return (
    <>
      {isLoading ? (
        <div className='flex items-center justify-center h-screen'>
          <Loader className='animate-spin size-8 text-green-500' />
        </div>
      ) : error ? (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50'>
          <div className="sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white py-10">
            <h1 className="text-gray-900 text-3xl font-medium">Error</h1>
            <p className="text-gray-500 text-sm mt-2">{error}</p>
            <a href='/app' className='mt-6 inline-block bg-green-500 hover:bg-green-600 text-white rounded-full px-6 h-9 ring-offset-1 ring-1 ring-green-400 flex items-center justify-center transition-colors'>
              <ArrowLeftIcon className='mr-2 size-4' />
              Go back to home page
            </a>
          </div>
        </div>
      ) : resumeData ? (
        <div className='bg-slate-100 min-h-screen'>
          <div className='max-w-3xl mx-auto py-10'>
            <ResumePreview 
              data={resumeData} 
              template={resumeData.template || 'classic'} 
              accentColor={resumeData.accent_color || '#3B82f6'}
              classes='py-4 bg-white' 
            />
          </div>
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50'>
          <div className="sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white py-10">
            <h1 className="text-gray-900 text-3xl font-medium">Error</h1>
            <p className="text-gray-500 text-sm mt-2">Resume not found</p>
            <a href='/app' className='mt-6 inline-block bg-green-500 hover:bg-green-600 text-white rounded-full px-6 h-9 ring-offset-1 ring-1 ring-green-400 flex items-center justify-center transition-colors'>
              <ArrowLeftIcon className='mr-2 size-4' />
              Go back to home page
            </a>
          </div>
        </div>
      )}
    </>
  )
}

export default Preview