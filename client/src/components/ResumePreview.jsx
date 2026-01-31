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
          padding: 0;
        }
        @media print {
          * {
            margin: 0 !important;
            padding: 0 !important;
          }
          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            height: 100% !important;
            overflow: visible !important;
          }
          body * {
            visibility: hidden;
          }
          #resume-preview,
          #resume-preview * {
            visibility: visible !important;
          }
          #resume-preview {
            position: absolute;
            top: 0;
            left: 0;
            width: 8.5in;
            height: auto;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            page-break-after: avoid;
            background: white;
          }
        }
        
        /* Prevent page breaks inside content */
        @media print {
          .bg-white,
          div, section, article, p, span, h1, h2, h3, h4, h5, h6 {
            page-break-inside: avoid;
            margin: 0 !important;
            padding-top: 0 !important;
            padding-bottom: 0 !important;
          }
        }
      `}
      </style>
    </div>
  );
};

export default ResumePreview;
