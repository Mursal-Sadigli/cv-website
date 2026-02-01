import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const ModernColorfulTemplate = ({ data, accentColor }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        return new Date(year, month - 1).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short"
        });
    };

    return (
        <div className="w-full mx-auto bg-white text-gray-800 print:p-0 print:m-0">
            {/* Colored Header */}
            <header className="p-8 text-white" style={{ backgroundColor: accentColor }}>
                <h1 className="text-4xl font-bold mb-2">{data.personal_info?.full_name || "Your Name"}</h1>
                <p className="text-lg opacity-90">{data.personal_info?.profession || "Professional Title"}</p>
                
                <div className="flex flex-wrap gap-4 mt-4 text-sm">
                    {data.personal_info?.email && <span>📧 {data.personal_info.email}</span>}
                    {data.personal_info?.phone && <span>📱 {data.personal_info.phone}</span>}
                    {data.personal_info?.location && <span>📍 {data.personal_info.location}</span>}
                </div>
            </header>

            <div className="p-8 space-y-8">
                {/* Professional Summary */}
                {data.professional_summary && (
                    <section>
                        <p className="text-gray-700 leading-relaxed">{data.professional_summary}</p>
                    </section>
                )}

                {/* Experience */}
                {data.experience && data.experience.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2" style={{ borderColor: accentColor, color: accentColor }}>
                            EXPERIENCE
                        </h2>
                        <div className="space-y-4">
                            {data.experience.map((exp, index) => (
                                <div key={index} className="border-l-4 pl-4" style={{ borderColor: accentColor }}>
                                    <h3 className="font-bold text-lg">{exp.position}</h3>
                                    <p className="text-sm" style={{ color: accentColor }}>{exp.company}</p>
                                    <p className="text-xs text-gray-500">
                                        {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                                    </p>
                                    <p className="text-sm mt-2 text-gray-700">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {data.education && data.education.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2" style={{ borderColor: accentColor, color: accentColor }}>
                            EDUCATION
                        </h2>
                        <div className="space-y-4">
                            {data.education.map((edu, index) => (
                                <div key={index}>
                                    <h3 className="font-bold">{edu.degree} in {edu.field}</h3>
                                    <p style={{ color: accentColor }}>{edu.institution}</p>
                                    <p className="text-sm text-gray-500">{formatDate(edu.graduation_date)}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Skills */}
                {data.skills && data.skills.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2" style={{ borderColor: accentColor, color: accentColor }}>
                            SKILLS
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {data.skills.map((skill, index) => (
                                <span key={index} className="px-3 py-1 rounded-full text-white text-sm" style={{ backgroundColor: accentColor }}>
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default ModernColorfulTemplate;
