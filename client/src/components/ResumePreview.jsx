import React from "react";
import ClassicTemplate from "./templates/ClassicTemplate";
import ModernTemplate from "./templates/ModernTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";
import MinimalImageTemplate from "./templates/MinimalImageTemplate";
import ModernColorfulTemplate from "./templates/ModernColorfulTemplate";
import TimelineTemplate from "./templates/TimelineTemplate";
import CreativeTemplate from "./templates/CreativeTemplate";
import ProfessionalTemplate from "./templates/ProfessionalTemplate";

const ResumePreview = ({ data, template, accentColor, classes = "" }) => {
  const styleRef = React.useRef(null);

  const renderTemplate = () => {
    if (!data || !template) return null;

    switch (template) {
      case "modern":
        return <ModernTemplate data={data} accentColor={accentColor} />;
      case "minimal":
        return <MinimalTemplate data={data} accentColor={accentColor} />;
      case "minimal-image":
        return <MinimalImageTemplate data={data} accentColor={accentColor} />;
      case "modern-colorful":
        return <ModernColorfulTemplate data={data} accentColor={accentColor} />;
      case "timeline":
        return <TimelineTemplate data={data} accentColor={accentColor} />;
      case "creative":
        return <CreativeTemplate data={data} accentColor={accentColor} />;
      case "professional":
        return <ProfessionalTemplate data={data} accentColor={accentColor} />;
      default:
        return <ClassicTemplate data={data} accentColor={accentColor} />;
    }
  };

  React.useEffect(() => {
    try {
      // Əvvəlki style-ı silindir
      const existingStyle = document.getElementById("resume-print-styles");
      if (existingStyle && styleRef.current !== existingStyle) {
        existingStyle.remove();
      }

      // Yeni style əlavə et
      if (!styleRef.current) {
        const style = document.createElement("style");
        style.id = "resume-print-styles";
        style.innerHTML = `
          @page {
            size: letter;
            margin: 0;
            padding: 0;
          }
          @media print {
            * {
              visibility: hidden;
            }
            #resume-preview,
            #resume-preview * {
              visibility: visible !important;
            }
            #resume-preview {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: auto;
              margin: 0 !important;
              padding: 0 !important;
              border: none !important;
              background: white !important;
              page-break-inside: avoid !important;
            }
            body {
              margin: 0;
              padding: 0;
              width: 100%;
            }
          }
        `;
        document.head.appendChild(style);
        styleRef.current = style;
      }
    } catch (error) {
      console.error("Error managing print styles:", error);
    }

    // Cleanup - component unmount olduqda
    return () => {
      try {
        if (styleRef.current && document.head.contains(styleRef.current)) {
          styleRef.current.remove();
          styleRef.current = null;
        }
      } catch (error) {
        console.error("Error removing print styles:", error);
      }
    };
  }, []);

  return (
    <div className="w-full bg-gray-100 px-2 sm:px-4">
      <div
        id="resume-preview"
        className={
          "border border-gray-200 mx-auto max-w-4xl bg-white" +
          (classes ? " " + classes : "")
        }
      >
        {renderTemplate()}
      </div>
    </div>
  );
};

export default ResumePreview;
