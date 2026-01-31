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
    <>
      <div className="w-full bg-gray-100 px-2 sm:px-4">
        <div
          id="resume-preview"
          className={
            "border border-gray-200 print:shadow-none print:border-none mx-auto max-w-4xl" + classes
          }
        >
          {renderTemplate()}
        </div>
      </div>
      <style>{`
        @page {
          size: letter;
          margin: 0;
          padding: 0;
        }
        @media print {
          body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100%;
            height: 100%;
          }
          html {
            margin: 0 !important;
            padding: 0 !important;
            width: 100%;
            height: 100%;
          }
          body > * {
            visibility: hidden !important;
            display: none !important;
          }
          #resume-preview {
            visibility: visible !important;
            display: block !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: white !important;
            page-break-after: avoid !important;
            max-width: none !important;
          }
          #resume-preview * {
            visibility: visible !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>
    </>
  );
};

export default ResumePreview;
