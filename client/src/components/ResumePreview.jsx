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
    <div className="w-full bg-gray-100 px-2 sm:px-4 print:bg-white print:p-0 print:m-0">
      <div
        id="resume-preview"
        className={
          "border border-gray-200 mx-auto max-w-4xl bg-white print:border-none print:max-w-none print:mx-0 print:p-0" + classes
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

          body {
            width: 8.5in !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }

          body > * {
            visibility: hidden;
            display: none;
          }

          #resume-preview {
            visibility: visible !important;
            display: block !important;
            position: static !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: white !important;
            page-break-after: avoid !important;
          }

          #resume-preview * {
            visibility: visible !important;
            page-break-inside: avoid !important;
          }
        }
      `}
      </style>
    </div>
  );
};

export default ResumePreview;
