import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { dummyResumeData } from '../assets/assets'
import { ArrowLeftIcon, Briefcase, ChevronLeft, ChevronRight, DownloadIcon, EyeIcon, EyeOffIcon, FileText, FolderIcon, GraduationCap, Share2Icon, Sparkles, User, Award, Globe } from 'lucide-react'
import PersonalInfoForm from '../components/PersonalInfoForm'
import ResumePreview from '../components/ResumePreview'
import TemplateSelector from '../components/TemplateSelector'
import ColorPicker from '../components/ColorPicker'
import ProfessionalSummaryForm from '../components/ProfessionalSummaryForm'
import ExperienceForm from '../components/ExperienceForm'
import EducationForm from '../components/EducationForm'
import ProjectForm from '../components/ProjectForm'
import SkillsForm from '../components/SkillsForm'
import CertificationForm from '../components/CertificationForm'
import LanguagesForm from '../components/LanguagesForm'
import { useSelector, useDispatch } from 'react-redux'
import api from '../configs/api'
import toast from 'react-hot-toast'
import { trackResumeCreated, trackTemplateUsed, trackDownload } from '../app/features/analyticsSlice'
import { clearSelectedTemplate } from '../app/features/themeSlice'

const ResumeBuilder = () => {

  const {resumeId} = useParams()
  const {token} = useSelector(state => state.auth)
  const selectedTemplate = useSelector(state => state.theme?.selectedTemplate)
  const selectedTemplateColor = useSelector(state => state.theme?.selectedTemplateColor)
  const dispatch = useDispatch()
  const [resumeData, setResumeData] =useState({
    _id: '',
    title: '',
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    certification: [],
    languages: [],
    project: [],
    skills: [],
    template: "classic",
    accent_color: "#3B82f6",
    public: false,
  })

  const loadExistingResume=async () => {
    try {
      const {data} = await api.get('/api/resumes/get/' + resumeId, {headers: {Authorization: `Bearer ${token}`}})
      if(data.resume){
        setResumeData({
          ...data.resume,
          certification: data.resume.certification || [],
          languages: data.resume.languages || []
        })
        document.title = data.resume.title;
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const [activeSectionIndex, setActiveSectionIndex] = useState(0)
  const [removeBackground, setRemoveBackground] = useState(false);

  const sections =[
    {id: "personal", name: "Personal Info", icon: User},
    {id: "summary", name: "Summary", icon: FileText},
    {id: "experience", name: "Experience", icon: Briefcase},
    {id: "education", name: "Education", icon: GraduationCap},
    {id: "certification", name: "Certification", icon: Award},
    {id: "languages", name: "Languages", icon: Globe},
    {id: "projects", name: "Projects", icon: FolderIcon},
    {id: "skills", name: "Skills", icon: Sparkles},
  ]

  const activeSection = sections[activeSectionIndex]

  useEffect(() => {
    loadExistingResume()
    
    // Əgər Template Gallery-dən template seçilibsə, onu tətbiq et
    if (selectedTemplate) {
      setResumeData(prev => ({
        ...prev,
        template: selectedTemplate,
        accent_color: selectedTemplateColor || '#3B82f6'
      }))
      // Tətbiq edildikdən sonra clear et
      setTimeout(() => {
        dispatch(clearSelectedTemplate())
      }, 100)
    }
  }, [resumeId])

  const changeResumeVisibility = async () => {
   try {
    const newVisibility = !resumeData.public;
    const payload = {
      resumeId,
      resumeData: {...resumeData, public: newVisibility}
    }
    const {data} = await api.put('/api/resumes/update', payload, {headers: {Authorization: `Bearer ${token}`}})

    setResumeData({...resumeData, public: newVisibility})
    toast.success(data.message)
   } catch (error) {
    console.log("Error saving resume:", error)
   }
  }

  const handleShare = () => {
    const frontendUrl = window.location.href.split('/app/')[0];
    const resumeUrl = frontendUrl + '/view/' + resumeId;

    if(navigator.share){
      navigator.share({url: resumeUrl, text: "CV-im", })
    }else{
      alert('Paylaşma funksiyası bu brauzerdə mövcud deyil.')
    }
  }

  const downloadResume = () => {
    dispatch(trackDownload());
    window.print();
  }

  const saveResume = async() => {
    try {
      console.log("saveResume called");
      console.log("resumeId:", resumeId);
      console.log("resumeData:", resumeData);
      
      let updatedResumeData = structuredClone(resumeData)

      // Check if image is a file object
      const hasImageFile = typeof resumeData.personal_info?.image === "object";
      if(hasImageFile){
        delete updatedResumeData.personal_info.image
      }

      const formData = new FormData()
      formData.append("resumeId", resumeId)
      formData.append('resumeData', JSON.stringify(updatedResumeData))
      removeBackground && formData.append("removeBackground", "yes");
      
      // Append image file if it exists
      if(hasImageFile && resumeData.personal_info?.image){
        formData.append("image", resumeData.personal_info.image)
      }

      console.log("Sending FormData with image");

      const {data} = await api.put('/api/resumes/update', formData, {headers: {Authorization: `Bearer ${token}`}})

      console.log("Response data:", data);
      console.log("Server certification data:", data.resume?.certification);
      console.log("Local certification data before merge:", resumeData.certification);
      
      // Track resume creation if new
      if (!resumeId) {
        dispatch(trackResumeCreated());
      }
      
      // Merge server response with local state to preserve certification and other fields
      const mergedData = {
        ...resumeData,
        ...data.resume,
        certification: data.resume?.certification || resumeData.certification || [],
        languages: data.resume?.languages || resumeData.languages || [],
        personal_info: {
          ...resumeData.personal_info,
          ...data.resume?.personal_info
        }
      };
      
      console.log("Merged certification data:", mergedData.certification);
      console.log("Merged certification with URL details:", JSON.stringify(mergedData.certification, null, 2));
      setResumeData(mergedData)
      return {message: data.message}
    } catch (error) {
      console.log("Error in saveResume:", error);
      console.log("Error response:", error?.response?.data);
      throw error
    }
  }

  return (
    <div>
      <div className='max-w-7xl mx-auto px-4 py-6'>
        <Link to={'/app'} className='inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all'>
        <ArrowLeftIcon className='size-4' /> Panelə qayıt
        </Link>
      </div>

      <div className='max-w-7xl mx-auto px-4 pb-8'>
        <div className='grid lg:grid-cols-12 gap-8'>
          {/* Left Panel - Form */}
          <div className='relative lg:col-span-5 rounded-lg overflow-hidden'>
            <div className='bg-white rounded-lg shadow-sm border-gray-200 p-6 pt-1'>
              {/* progress bar using activeSectionIndex */}
              <hr className='absolute top-0 left-0 right-0 border-2 border-gray-200' />
              <hr className='absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600 border-none transition-all duration-2000' 
              style={{width: `${activeSectionIndex * 100 / (sections.length - 1)}%`}} />

              {/* Section Navigation */}
              <div className='flex justify-between items-center mb-6 border-b border-gray-300 py-1'>

                <div className='flex items-center gap-2'>
                  <TemplateSelector selectedTemplate={resumeData.template} onChange={(template) => {
                    setResumeData(prev => ({...prev, template}))
                    dispatch(trackTemplateUsed(template))
                  }} />
                    <ColorPicker selectedColor={resumeData.accent_color} onChange={(color) => setResumeData(prev => ({...prev, accent_color: color}))} />
                </div>

                <div className='flex items-center'>
                  {activeSectionIndex !== 0 && (
                    <button onClick={() => setActiveSectionIndex((prevIndex) => Math.max(prevIndex - 1, 0))} className='flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all' 
                    disabled={activeSectionIndex === 0}>
                      <ChevronLeft className='size-4' /> Geri
                    </button>
                  )}

                  <button onClick={() => setActiveSectionIndex((prevIndex) => Math.min(prevIndex + 1, sections.length - 1))} className= {`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${activeSectionIndex === sections.length - 1 && 'opacity-50'}`}
                    disabled={activeSectionIndex === sections.length - 1}>
                       Növbəti <ChevronRight className='size-4' />
                    </button>
                </div>
              </div>

              {/* Form Content */}
              <div className='space-y-6'>
                {activeSection.id === 'personal' && (
                  <PersonalInfoForm data={resumeData.personal_info} onChange={(data) => setResumeData(prev => ({...prev, personal_info: data}))} removeBackground={removeBackground} setRemoveBackground={setRemoveBackground} />
                )}
                {activeSection.id === 'summary' && (
                  <ProfessionalSummaryForm data={resumeData.professional_summary} onChange={(data) => setResumeData(prev => ({...prev, professional_summary: data}))} setResumeData={setResumeData} />
                )}
                 {activeSection.id === 'experience' && (
                  <ExperienceForm data={resumeData.experience} onChange={(data) => setResumeData(prev => ({...prev, experience: data}))} />
                )}
                {activeSection.id === 'education' && (
                  <EducationForm data={resumeData.education} onChange={(data) => setResumeData(prev => ({...prev, education: data}))} />
                )}
                {activeSection.id === 'certification' && (
                  <CertificationForm data={resumeData.certification} onChange={(data) => setResumeData(prev => ({...prev, certification: data}))} />
                )}
                {activeSection.id === 'languages' && (
                  <LanguagesForm data={resumeData.languages} onChange={(data) => setResumeData(prev => ({...prev, languages: data}))} />
                )}
                {activeSection.id === 'projects' && (
                  <ProjectForm data={resumeData.project} onChange={(data) => setResumeData(prev => ({...prev, project: data}))} />
                )}
                {activeSection.id === 'skills' && (
                  <SkillsForm data={resumeData.skills} onChange={(data) => setResumeData(prev => ({...prev, skills: data}))} />
                )}
              </div>

              <button onClick={() => {
                console.log("Save button clicked, token:", token);
                toast.promise(saveResume(), {loading: 'Dəyişikliklər yadda saxlanılır', success: 'Dəyişikliklər yadda saxlandı', error: 'Xəta baş verdi'})
              }} className='bg bg-gradient-to-br from-green-100 to-green-200 ring-green-300 text-green-600 ring hover:ring-green-400 transition-all rounded-md px-6 py-2 mt-6 text-sm'>
                Dəyişiklikləri yadda saxla
              </button>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className='lg:col-span-7 max-lg:mt-6'>
            <div className='flex flex-col gap-0'>
              <div className='flex items-center justify-end gap-2 p-4 border-b border-gray-200 bg-white rounded-t-lg'>
                {resumeData.public && (
                  <button onClick={handleShare} className='flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-tr from-blue-100 to-blue-200 text-blue-600 rounded-lg ring-blue-300 hover:ring transition-colors'>
                    <Share2Icon className='size-4' /> Paylaş
                  </button>
                )}
                <button onClick={changeResumeVisibility} className='flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-tr from-purple-100 to-purple-200 text-purple-600 rounded-lg ring-purple-300 hover:ring transition-colors'>
                  {resumeData.public ? <EyeIcon className='size-4' /> : 
                  <EyeOffIcon className='size-4' />}
                  {resumeData.public ? 'Public' : 'Private'}
                </button>
                <button onClick={downloadResume} className='flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-tr from-green-100 to-green-200 text-green-600 rounded-lg ring-green-300 hover:ring transition-colors'>
                  <DownloadIcon className='size-4' />Yüklə
                </button>
              </div>

              <div className='bg-white rounded-b-lg shadow-sm border border-gray-200 border-t-0 overflow-hidden'>
                <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumeBuilder