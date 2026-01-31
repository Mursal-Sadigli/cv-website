import React from "react";
import ClassicTemplate from "./templates/ClassicTemplate";
import ModernTemplate from "./templates/ModernTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";
import MinimalImageTemplate from "./templates/MinimalImageTemplate";

const ResumePreview = ({ data, template, accentColor, classes = "" }) => {
  const renderTemplate = () => {
    switch (template) {
      case "modern":
        return <ModernTemplate data={data} accentColor={accentColor} />;
      case "minimal":
        return <MinimalTemplate data={data} accentColor={accentColor} />;
      case "minimal-image":
        return <MinimalImageTemplate data={data} accentColor={accentColor} />;

      default:
        return <ClassicTemplate data={data} accentColor={accentColor} />;
    }
  };

  React.useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @page {
        size: letter;
        margin: 0;
        padding: 0;
      }
      @media print {
        body > * {
          display: none !important;
        }
        #resume-preview {
          display: block !important;
          visibility: visible !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          max-width: 100% !important;
          border: none !important;
          background: white !important;
        }
        #resume-preview * {
          page-break-inside: avoid !important;
          margin: 0 !important;
          padding: 0 !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="w-full bg-gray-100 px-2 sm:px-4">
      <div
        id="resume-preview"
        className={
          "border border-gray-200 mx-auto max-w-4xl bg-white" + classes
        }
      >
        {renderTemplate()}
      </div>
    </div>
  );
};

export default ResumePreview;
