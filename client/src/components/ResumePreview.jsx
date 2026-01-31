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
    <div className="w-full bg-gray-100 px-2 sm:px-4 print:bg-white print:p-0">
      <div
        id="resume-preview"
        className={
          "border border-gray-200 print:shadow-none print:border-none mx-auto max-w-4xl print:mx-0 print:rounded-none" + classes
        }
      >
        {renderTemplate()}
      </div>

      <style>{`
        @media print {
          body, html {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
          }
          body > * {
            display: none !important;
          }
          #resume-preview {
            display: block !important;
            width: 100%;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            page-break-after: avoid !important;
            background: white !important;
            box-shadow: none !important;
            max-width: 100% !important;
          }
        }
      `}
      </style>
    </div>
  );
};

export default ResumePreview;
