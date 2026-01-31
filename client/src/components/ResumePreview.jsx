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
          "border border-gray-200 print:shadow-none print:border-none mx-auto max-w-4xl print:mx-0" + classes
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
            border: none !important;
            line-height: 1 !important;
          }
          html {
            margin: 0 !important;
            padding: 0 !important;
            width: 8.5in !important;
            height: auto !important;
          }
          body {
            margin: 0 !important;
            padding: 0 !important;
            width: 8.5in !important;
            height: auto !important;
            overflow: visible !important;
          }
          body > * {
            display: none !important;
            visibility: hidden !important;
          }
          #resume-preview {
            display: block !important;
            visibility: visible !important;
            position: static !important;
            width: 8.5in !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            page-break-after: avoid !important;
            page-break-before: avoid !important;
            background: white !important;
            overflow: visible !important;
          }
          #resume-preview * {
            margin: 0 !important;
            padding: 0 !important;
            page-break-inside: avoid !important;
            background-clip: border-box !important;
            line-height: inherit !important;
          }
          /* Remove all spacing classes in print */
          div, section, article, header, footer, main, nav {
            margin: 0 !important;
            padding: 0 !important;
            page-break-inside: avoid !important;
          }
          p {
            margin: 0 !important;
            padding: 0 !important;
          }
          img {
            max-width: 100%;
            height: auto;
          }
        }
      `}
      </style>
    </div>
  );
};

export default ResumePreview;
