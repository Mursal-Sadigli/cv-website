import { Check, Layout } from "lucide-react";
import React, { useState } from "react";

const TemplateSelector = ({ selectedTemplate, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const templates = [
    {
      id: "classic",
      name: "Classic",
      preview: "Clean, traditional CV format with clear sections and professional fonts",
    },
    {
      id: "minimal",
      name: "Minimal",
      preview: "Ultra-clean design that highlights your content",
    },
    {
      id: "modern",
      name: "Modern",
      preview: "Elegant design with strategic use of colors and modern typography",
    },
    {
      id: "minimal-image",
      name: "Minimal (With Image)",
      preview: "Minimal design with a single image and clean typography",
    },
    {
      id: "modern-colorful",
      name: "Colorful Modern",
      preview: "Color-rich layout with eye-catching headers and bordered sections",
    },
    {
      id: "timeline",
      name: "Timeline",
      preview: "Timeline-based presentation with a creative chronological look",
    },
    {
      id: "creative",
      name: "Creative",
      preview: "Creative side layout with a two-column design and colorful sidebar",
    },
    {
      id: "professional",
      name: "Professional",
      preview: "Corporate professional, formal and well-structured appearance",
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm text-blue-600 bg-gradient-to-tr from-blue-50 to-blue-100 ring-blue-300 hover:ring transition-all px-3 py-2 rounded-lg"
      >
        <Layout size={14} /> <span className="max-sm:hidden">Template</span>
      </button>
      {isOpen && (
        <div className="absolute top-full min-w-[300px] p-3 mt-2 space-y-3 z-10 bg-white rounded-md border border-gray-200 shadow-sm">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => {
                onChange(template.id);
                setIsOpen(false);
              }}
              className={`relative p-3 border rounded-md cursor-pointer transition-all ${
                selectedTemplate === template.id
                  ? "border-blue-400 bg-blue-100"
                  : "border-gray-300 hover:border-gray-400 hover:bg-gray-100"
              }`}
            >
              {selectedTemplate === template.id && (
                <div className="absolute top-2 right-2">
                  <div className="size-5 bg-blue-400 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <h4 className="font-medium text-gray-800">{template.name}</h4>
                <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-gray-500 italic">
                  {template.preview}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;
