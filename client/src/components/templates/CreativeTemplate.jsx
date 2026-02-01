import { Mail, Phone, MapPin } from "lucide-react";

const CreativeTemplate = ({ data, accentColor }) => {
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
            {/* Side by side layout */}
            <div className="flex flex-col md:flex-row print:flex-row">
                {/* Left sidebar */}
                <div className="w-full md:w-1/3 p-8 text-white print:w-1/3 print:p-6" style={{ backgroundColor: accentColor }}>
                    <h1 className="text-3xl font-black mb-8">{data.personal_info?.full_name || "Your Name"}</h1>
                    
                    {/* Contact */}
                    <section className="mb-8">
                        <h3 className="text-sm font-bold mb-4 opacity-75">CONTACT</h3>
                        <div className="space-y-2 text-sm">
                            {data.personal_info?.email && <p>📧 {data.personal_info.email}</p>}
                            {data.personal_info?.phone && <p>📱 {data.personal_info.phone}</p>}
                            {data.personal_info?.location && <p>📍 {data.personal_info.location}</p>}
                        </div>
                    </section>

                    {/* Skills */}
                    {data.skills && data.skills.length > 0 && (
                        <section>
                            <h3 className="text-sm font-bold mb-4 opacity-75">SKILLS</h3>
                            <div className="space-y-2 text-sm">
                                {data.skills.map((skill, index) => (
                                    <div key={index} className="flex items-center">
                                        <span className="w-2 h-2 rounded-full mr-2 opacity-75"></span>
                                        {skill}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Right content */}
                <div className="w-full md:w-2/3 p-8 print:w-2/3 print:p-6">
                    {/* Professional Summary */}
                    {data.professional_summary && (
                        <section className="mb-8">
                            <p className="text-gray-700 leading-relaxed italic">{data.professional_summary}</p>
                        </section>
                    )}

                    {/* Experience */}
                    {data.experience && data.experience.length > 0 && (
                        <section className="mb-8">
                            <h2 className="text-2xl font-bold mb-4" style={{ color: accentColor }}>EXPERIENCE</h2>
                            <div className="space-y-4">
                                {data.experience.map((exp, index) => (
                                    <div key={index}>
                                        <h3 className="font-bold text-lg">{exp.position}</h3>
                                        <p className="font-semibold text-sm" style={{ color: accentColor }}>{exp.company}</p>
                                        <p className="text-xs text-gray-500">
                                            {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                                        </p>
                                        <p className="text-sm text-gray-700 mt-2">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Education */}
                    {data.education && data.education.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold mb-4" style={{ color: accentColor }}>EDUCATION</h2>
                            <div className="space-y-3">
                                {data.education.map((edu, index) => (
                                    <div key={index}>
                                        <h3 className="font-bold">{edu.degree}</h3>
                                        <p className="text-sm" style={{ color: accentColor }}>{edu.institution}</p>
                                        <p className="text-xs text-gray-500">{formatDate(edu.graduation_date)}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreativeTemplate;
