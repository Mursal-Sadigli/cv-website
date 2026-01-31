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

  return (
    <div className="w-full bg-gray-100 px-2 sm:px-4">
      <div
        id="resume-preview"
        className={
          "border border-gray-200 print:shadow-none print:border-none mx-auto max-w-4xl" + classes
        }
      >
        {renderTemplate()}
      </div>

      <style>{`
        @page {
          size: letter;
          margin: 0;
        }
        @media print {
          html,
          body {
            margin: 0;
            padding: 0;
            overflow: visible;
          }
          body * {
            visibility: hidden;
          }
          #resume-preview,
          #resume-preview * {
            visibility: visible;
          }
          #resume-preview {
            position: relative;
            width: 8.5in;
            margin: 0;
            padding: 0;
            box-shadow: none !important;
            border: none !important;
            page-break-after: auto;
          }
        }
        
        /* Prevent breaking inside sections */
        @media print {
          div, section, article {
            page-break-inside: avoid;
          }
        }
      `}
      </style>
    </div>
  );
};

export default ResumePreview;
