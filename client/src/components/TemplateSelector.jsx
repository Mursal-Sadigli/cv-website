import { Check, Layout } from "lucide-react";
import React, { useState } from "react";

const TemplateSelector = ({ selectedTemplate, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const templates = [
    {
      id: "classic",
      name: "Klassik",
      preview: "Təmiz, ənənəvi CV formatı, aydın bölmələr və peşəkar şriftlərlə",
    },
    {
      id: "minimal",
      name: "Minimal",
      preview: "Ultra-təmiz dizayn, məzmununu ön plana çıxarır",
    },
    {
      id: "modern",
      name: "Müasir",
      preview: "Rənglərin strateji istifadəsi və müasir şriftlərlə zərif dizayn",
    },
    {
      id: "minimal-image",
      name: "Minimal (Şəkilli)",
      preview: "Minimal dizayn, tək bir şəkil və təmiz tipografiya",
    },
    {
      id: "modern-colorful",
      name: "Rəngli Müasır",
      preview: "Rənglərlə dolu, cəlbedici başlıq və sərhədli bölmələr",
    },
    {
      id: "timeline",
      name: "Zaman Xətti",
      preview: "Zaman xətti ilə təqdimat, kronoloji yaradıcı görünüş",
    },
    {
      id: "creative",
      name: "Yaradıcı",
      preview: "Yaradıcı tərəf layoutu, rəngli sidebar ilə iki sütunlu dizayn",
    },
    {
      id: "professional",
      name: "Professional",
      preview: "Korporativ professional, rəsmi və təşkilatlı görünüş",
    },
  ];

  return <div className="relative">
    <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-1 text-sm text-blue-600 bg-gradient-to-tr from-blue-50 to-blue-100 ring-blue-300 hover:ring transition-all px-3 py-2 rounded-lg">
        <Layout size={14} /> <span className="max-sm:hidden">Template</span>
    </button>
    {isOpen && (
        <div className="absolute top-full min-w-[300px] p-3 mt-2 space-y-3 z-10 bg-white rounded-md border border-gray-200 shadow-sm">
            {templates.map((template) => (
                <div key={template.id} onClick={() => {onChange(template.id); setIsOpen(false)}}
                className={`relative p-3 border rounded-md cursor-pointer transition-all ${selectedTemplate === template.id ?
                    "border-blue-400 bg-blue-100"
                    : "border-gray-300 hover:border-gray-400 hover:bg-gray-100"
                }`}>
                    {selectedTemplate === template.id && (
                        <div className="absolute top-2 right-2">
                            <div className="size-5 bg-blue-400 rounded-full flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                            </div>
                        </div>
                    )}

                    <div className="space-y-1">
                        <h4 className="font-medium text-gray-800">{template.name}</h4>
                        <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-gray-500 italic">{template.preview}</div>
                    </div>
                    </div>
            ))}

        </div>
    )}
  </div>;
};

export default TemplateSelector;
