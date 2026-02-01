import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, CheckCircle, Download } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { selectTemplate } from '../app/features/themeSlice';
import ClassicTemplate from '../components/templates/ClassicTemplate';
import MinimalTemplate from '../components/templates/MinimalTemplate';
import ModernTemplate from '../components/templates/ModernTemplate';
import MinimalImageTemplate from '../components/templates/MinimalImageTemplate';
import ModernColorfulTemplate from '../components/templates/ModernColorfulTemplate';
import TimelineTemplate from '../components/templates/TimelineTemplate';
import CreativeTemplate from '../components/templates/CreativeTemplate';
import ProfessionalTemplate from '../components/templates/ProfessionalTemplate';

const TemplateGallery = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [previewColor, setPreviewColor] = useState('#3B82f6');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const templates = [
    {
      id: 'classic',
      name: 'Klassik',
      description: 'Ənənəvi və professionalTemplates Gallery - Daha çox şablonlar',
      component: ClassicTemplate,
      color: '#3B82f6',
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Sadə və təmiz',
      component: MinimalTemplate,
      color: '#10b981',
    },
    {
      id: 'modern',
      name: 'Müasır',
      description: 'Müasır və fərqli',
      component: ModernTemplate,
      color: '#f59e0b',
    },
    {
      id: 'minimal-image',
      name: 'Şəkilli Minimal',
      description: 'Şəkil ilə minimal',
      component: MinimalImageTemplate,
      color: '#8b5cf6',
    },
    {
      id: 'modern-colorful',
      name: 'Rəngli Müasır',
      description: 'Rənglərlə dolu',
      component: ModernColorfulTemplate,
      color: '#ec4899',
    },
    {
      id: 'timeline',
      name: 'Zaman Xətti',
      description: 'Zaman xətti ilə təqdimat',
      component: TimelineTemplate,
      color: '#06b6d4',
    },
    {
      id: 'creative',
      name: 'Yaradıcı',
      description: 'Yaradıcı tərəf layoutu',
      component: CreativeTemplate,
      color: '#ef4444',
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Korporativ professional',
      component: ProfessionalTemplate,
      color: '#14b8a6',
    },
  ];

  const dummyData = {
    personal_info: {
      full_name: 'Ayşə Hüseynova',
      profession: 'Veb Dəveloper',
      email: 'ayse@example.com',
      phone: '+994 50 XXX XX XX',
      location: 'Bakı, Azərbaycan',
      linkedin: 'linkedin.com/in/ayse',
      website: 'aysedev.com',
    },
    professional_summary: 'Peşəkar veb dəveleperəm, 5 illik təcrübəsi ilə React, Node.js və bulud texnologiyalarında uzmanım.',
    experience: [
      {
        company: 'Tech Company',
        position: 'Senior Developer',
        start_date: '2022-01',
        end_date: '',
        is_current: true,
        description: 'Əsas proyektlərdə liderlik, komanda menecmenti və texniki mühəndislik.',
      },
      {
        company: 'Digital Agency',
        position: 'Web Developer',
        start_date: '2020-06',
        end_date: '2021-12',
        is_current: false,
        description: 'Müxtəlif vəb tətbiqlərin inkişafı və dizayn implementasiyası.',
      },
    ],
    education: [
      {
        institution: 'Bak ı Dövlət Universiteti',
        degree: 'Bakalavriat',
        field: 'Kompüter Elmləri',
        graduation_date: '2020-06',
        gpa: '3.8',
      },
    ],
    skills: ['React', 'Node.js', 'JavaScript', 'TypeScript', 'MongoDB', 'PostgreSQL', 'Docker', 'AWS'],
    template: 'classic',
    accent_color: previewColor,
  };

  const selectedTpl = templates.find(t => t.id === selectedTemplate);
  const PreviewComponent = selectedTpl?.component;

  const handleUseTemplate = (templateId, templateName, templateColor) => {
    // Redux-a və localStorage-ə saxla
    dispatch(selectTemplate({ id: templateId, name: templateName, color: templateColor }));
    localStorage.setItem('pendingTemplate', JSON.stringify({ 
      id: templateId, 
      name: templateName, 
      color: templateColor 
    }));
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link to="/app" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 w-fit">
            <ArrowLeft className="size-4" />
            Geri qayıt
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Şablonlar Qalereyası</h1>
            <p className="text-gray-600 mt-1">Daha çox şablonlar - Rezyumenizi istənilən stilə çevirin</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedTemplate ? (
          // Preview Mode
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Preview */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                <div className="p-4 bg-gray-100 border-b flex justify-between items-center">
                  <h2 className="font-semibold text-gray-700">{selectedTpl?.name} - Ön İzləmə</h2>
                  <button
                    onClick={() => setSelectedTemplate(null)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    ✕
                  </button>
                </div>
                <div className="overflow-auto max-h-96 bg-white">
                  <PreviewComponent data={dummyData} accentColor={previewColor} />
                </div>
              </div>
            </div>

            {/* Details */}
            <div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-2xl font-bold mb-2">{selectedTpl?.name}</h3>
                <p className="text-gray-600 mb-6">{selectedTpl?.description}</p>

                {/* Color Picker */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-3 text-gray-700">Rəng Seçin</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['#3B82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#ef4444', '#14b8a6'].map((color) => (
                      <button
                        key={color}
                        onClick={() => setPreviewColor(color)}
                        className={`w-10 h-10 rounded-lg border-2 transition-all ${previewColor === color ? 'border-gray-800 scale-110' : 'border-gray-300'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <Link
                  to="/app"
                  onClick={() => {
                    dispatch(selectTemplate({ id: selectedTpl.id, name: selectedTpl.name, color: previewColor }));
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-3 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 text-center font-bold text-lg flex items-center justify-center gap-2 border-2 border-blue-600 hover:border-blue-800 shadow-md"
                >
                  <CheckCircle className="size-5" />
                  Bu Şablondan İstifadə Et
                </Link>
              </div>
            </div>
          </div>
        ) : (
          // Gallery Grid
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-200"
                >
                  {/* Template Preview Thumbnail */}
                  <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full scale-50 origin-top-left">
                      <template.component data={dummyData} accentColor={template.color} />
                    </div>
                  </div>

                  {/* Template Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{template.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{template.description}</p>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedTemplate(template.id);
                          setPreviewColor(template.color);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                      >
                        <Eye className="size-4" />
                        Bax
                      </button>

                      <button
                        onClick={() => handleUseTemplate(template.id, template.name, template.color)}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                      >
                        <Download className="size-4" />
                        İstifadə Et
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateGallery;
