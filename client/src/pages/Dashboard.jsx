import { FilePenLineIcon, LoaderCircleIcon, PencilIcon, PlusIcon, TrashIcon, UploadCloud, UploadCloudIcon, XIcon, Sparkles, Zap, Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { dummyResumeData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import toast from 'react-hot-toast'
import pdfToText from 'react-pdftotext'

const Dashboard = () => {
  const {user, token} = useSelector(state => state.auth)
  const colors = ["#9333ea", "#d97706", "#dc2626", "#0284c7", "#16a34a"]
  const [allResumes, setAllResumes] = useState([])
  const [showCreateResume, setShowCreateResume] = useState(false)
  const [showUploadResume, setShowUploadResume] = useState(false)
  const [title, setTitle] = useState('')
  const [resume, setResume] = useState(null)
  const [editResumeId, setEditResumeId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const loadAllResumes=async () => {
    try {
      const {data} = await api.get('/api/users/resumes', {headers: {Authorization: token}})
      setAllResumes(data.resumes)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  const createResume = async (event) => {
    try {
      event.preventDefault()
      const {data} = await api.post('/api/resumes/create', {title}, {headers: {Authorization: token}})
      setAllResumes([...allResumes, data.resume])
      setTitle('')
      setShowCreateResume(false)
      navigate(`/app/builder/${data.resume._id}`)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  const uploadResume = async (event) => {
    event.preventDefault()
    if (!resume) {
      toast.error('Zəhmət olmasa CV faylını seçin')
      return
    }
    if (!title.trim()) {
      toast.error('Zəhmət olmasa CV başlığını daxil edin')
      return
    }
    
    setIsLoading(true)
    const loadingToast = toast.loading('CV yüklənir... Zəhmət olmasa gözləyin')
    
    try {
      console.log('Starting PDF parsing...')
      const resumeText = await pdfToText(resume)
      console.log('PDF parsed, sending to server...')
      
      const {data} = await api.post('/api/ai/upload-resume', {title, resumeText}, {headers: {Authorization: `Bearer ${token}`}})
      
      toast.dismiss(loadingToast)
      
      // Delay before state reset and navigation to ensure React finishes modal cleanup
      setTimeout(async () => {
        try {
          // Reset modal state FIRST
          setTitle('')
          setResume(null)
          setShowUploadResume(false)
          setIsLoading(false)
          
          // Reload resumes
          const {data: resumesData} = await api.get('/api/users/resumes', {headers: {Authorization: token}})
          setAllResumes(resumesData.resumes)
          
          toast.success('CV uğurla yükləndi!')
          navigate(`/app/builder/${data.resumeId}`)
        } catch (err) {
          console.error('Reload error:', err)
          setIsLoading(false)
          toast.error('Resumes yükləmə xətası')
        }
      }, 300)
    } catch (error) {
      console.error('Upload error:', error)
      toast.dismiss(loadingToast)
      setIsLoading(false)
      toast.error(error?.response?.data?.message || 'CV yükləmə zamanı xəta oldu')
    }
  }

  const editTitle = async (event) => {
    try {
      event.preventDefault()
      const {data} = await api.put(`/api/resumes/update`, {resumeId: editResumeId, resumeData: {title}}, {headers: {Authorization: token}})
      setAllResumes(allResumes.map(resume => resume._id === editResumeId ? {...resume, title} : resume))
      setTitle('')
      setEditResumeId('')
      toast.success(data.message)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  const deleteResume = async (resumeId) => {
    try {
       const confirm=window.confirm('Bu CV-ni silmək istədiyinizə əminsiniz?')
    if(confirm){
      const {data} = await api.delete(`/api/resumes/delete/${resumeId}`, {headers: {Authorization: `Bearer ${token}`}})
      setAllResumes(allResumes.filter(resume => resume._id !== resumeId))
      toast.success(data.message)
    }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }   
  }

  useEffect(() => {
    loadAllResumes()
  }, [])

  return (
    <div>
        <div className='max-w-7xl mx-auto px-4 py-8'>
          <p className='text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden'>Xoş gəldin Mürsəl Sadıqlı</p>
          <div className='flex gap-4'>
            <button onClick={() => setShowCreateResume(true)} className='w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-indigo-500 hover:shadow-lg transition-all duration-300 cursor-pointer'>
              <PlusIcon className='size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-indigo-300 to-indigo-500 text-white rounded-full' />
              <p className='text-sm group-hover:text-indigo-600 transition-all'>CV yarat</p>
            </button>
            <button onClick={() => setShowUploadResume(true)} className='w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer'>
              <UploadCloudIcon className='size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-purple-300 to-purple-500 text-white rounded-full' />
              <p className='text-sm group-hover:text-purple-600 transition-all'>Mövcud CV-ni yüklə</p>
            </button>
            <button onClick={() => navigate('/app/templates')} className='w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-pink-500 hover:shadow-lg transition-all duration-300 cursor-pointer'>
              <Sparkles className='size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-pink-300 to-pink-500 text-white rounded-full' />
              <p className='text-sm group-hover:text-pink-600 transition-all'>Şablonlar</p>
            </button>
            <button onClick={() => navigate('/app/job-matcher')} className='w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-green-500 hover:shadow-lg transition-all duration-300 cursor-pointer'>
              <Zap className='size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-green-300 to-green-500 text-white rounded-full' />
              <p className='text-sm group-hover:text-green-600 transition-all'>İş Analizi</p>
            </button>
          </div>

          <hr className='border-slate-300 my-6 sm:w-[305px]' />

          <div className='grid grid-cols-2 sm:flex flex-wrap gap-4'>
            {allResumes.map((resume, index) => {
              const baseColor=colors[index % colors.length];
              return(
                <button key={resume._id} onClick={() => navigate(`/app/builder/${resume._id}`)} className='relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group hover:shadow-lg transition-all duration-300 cursor-pointer'
                style={{background: `linear-gradient(135deg, ${baseColor}10, ${baseColor}40)`, borderColor: baseColor + '40'}}>

                  <FilePenLineIcon className='size-7 group-hover:scale-105 transition-all' style={{color: baseColor}} />
                  <p className='text-sm group-hover:scale-105 transition-all px-2 text-center' style={{color: baseColor}}>{resume.title}</p>
                  <p className='absolute bottom-1 text-[11px] text-slate-400  group-hover:text-slate-500 transition-all duration-300 px-2 text-center' style={{color: baseColor + '90'}}>
                    Son yenilənmə {new Date(resume.updatedAt).toLocaleDateString()}</p>
                    <div onClick={e => e.stopPropagation()} className='absolute top-1 right-1 group-hover:flex items-center hidden'>
                      <TrashIcon onClick={() => deleteResume(resume._id)} className='size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors' />
                      <PencilIcon onClick={() => {setEditResumeId(resume._id); setTitle(resume.title)}} className='size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors' />
                    </div>
                </button>
              )
            })}
          </div>

          {showCreateResume && (
            <form onSubmit={createResume} onClick={() => {setShowCreateResume(false); setTitle('')}} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>
              <div onClick={e => e.stopPropagation()} className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6'>
                <h2 className='text-xl font-bold mb-4'>CV yaradın</h2>
                <input onChange={(e) => setTitle(e.target.value)} value={title} type='text' placeholder='CV başlığını daxil edin' className='w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600' required />

                <button className='w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors'>CV yaradın</button>
                <XIcon onClick={() => {setShowCreateResume(false); setTitle('')}} className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors' />
              </div>
            </form>
          )}

          {showUploadResume && (
              <form onSubmit={uploadResume} onClick={() => {setShowUploadResume(false); setTitle(''); setResume(null)}} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>
              <div onClick={e => e.stopPropagation()} className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6'>
                <h2 className='text-xl font-bold mb-4'>CV-ni yükləyin</h2>
                <input onChange={(e) => setTitle(e.target.value)} value={title} type='text' placeholder='CV başlığını daxil edin' className='w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600' required />
                <div>
                  <label htmlFor='resume-input' className='block text-sm text-slate-700 mb-2'>
                    CV faylını seçin
                  </label>
                  <div 
                    onClick={() => document.getElementById('resume-input')?.click()}
                    className='flex flex-col items-center justify-center gap-2 border group text-slate-400 border-slate-400 border-dashed rounded-md p-4 py-10 hover:border-green-500 hover:text-green-700 cursor-pointer transition-colors'
                  >
                    {resume ? (
                      <div className='text-center'>
                        <p className='text-green-700 font-semibold'>{resume.name}</p>
                        <p className='text-xs text-gray-500 mt-1'>Dəyişdirmək üçün klik edin</p>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className='size-14 stroke-1' />
                        <p className='font-semibold'>CV PDF faylını seçin</p>
                        <p className='text-xs'>və ya buraya çəkin</p>
                      </>
                    )}
                  </div>
                  <input 
                    type='file' 
                    id='resume-input' 
                    accept='.pdf' 
                    style={{ display: 'none' }}
                    onChange={(e) => setResume(e.target.files?.[0])} 
                  />
                </div>
                <button 
                  disabled={isLoading || !resume || !title.trim()} 
                  className='w-full py-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2 font-semibold'
                >
                  {isLoading && <LoaderCircleIcon className='animate-spin size-4 text-white' />}
                  {isLoading ? 'Yüklənir... Zəhmət olmasa gözləyin' : 'CV-ni Yüklə'}
                </button>
                <XIcon onClick={() => {setShowUploadResume(false); setTitle(''); setResume(null)}} className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors' />
              </div>
            </form>
          )}

           {editResumeId && (
            <form onSubmit={editTitle} onClick={() => setEditResumeId('')} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>
              <div onClick={e => e.stopPropagation()} className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6'>
                <h2 className='text-xl font-bold mb-4'>CV başlığını dəyişin</h2>
                <input onChange={(e) => setTitle(e.target.value)} value={title} type='text' placeholder='CV başlığını daxil edin' className='w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600' required />

                <button className='w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors'>Yenilə</button>
                <XIcon onClick={() => {setEditResumeId(''); setTitle('')}} className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors' />
              </div>
            </form>
          )}
          
        </div>
    </div>
  )
}

export default Dashboard