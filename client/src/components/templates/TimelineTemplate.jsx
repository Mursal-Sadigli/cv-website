import { Mail, Phone, MapPin } from "lucide-react";

const TimelineTemplate = ({ data, accentColor }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        return new Date(year, month - 1).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short"
        });
    };

    return (
        <div className="w-full mx-auto p-8 bg-gradient-to-br from-gray-50 to-white text-gray-800 print:p-6 print:m-0">
            {/* Header */}
            <header className="mb-12 text-center">
                <h1 className="text-5xl font-black mb-2">{data.personal_info?.full_name || "Your Name"}</h1>
                <p className="text-lg text-gray-600 mb-4">{data.personal_info?.profession || "Professional"}</p>
                
                <div className="flex justify-center gap-6 text-sm">
                    {data.personal_info?.email && <span>{data.personal_info.email}</span>}
                    {data.personal_info?.phone && <span>{data.personal_info.phone}</span>}
                    {data.personal_info?.location && <span>{data.personal_info.location}</span>}
                </div>
            </header>

            {/* Professional Summary */}
            {data.professional_summary && (
                <section className="mb-12 text-center">
                    <p className="text-gray-700 max-w-2xl mx-auto">{data.professional_summary}</p>
                </section>
            )}

            {/* Timeline Experience */}
            {data.experience && data.experience.length > 0 && (
                <section className="mb-12">
                    <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: accentColor }}>PROFESSIONAL JOURNEY</h2>
                    <div className="relative">
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full" style={{ backgroundColor: accentColor }}></div>
                        <div className="space-y-8">
                            {data.experience.map((exp, index) => (
                                <div key={index} className={`flex ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                                    <div className="w-1/2 pr-8">
                                        <div className="text-right">
                                            <h3 className="font-bold text-lg">{exp.position}</h3>
                                            <p style={{ color: accentColor }} className="font-semibold">{exp.company}</p>
                                            <p className="text-sm text-gray-500">
                                                {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                                            </p>
                                            <p className="text-sm text-gray-700 mt-2">{exp.description}</p>
                                        </div>
                                    </div>
                                    <div className="w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
                <section className="mt-12">
                    <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: accentColor }}>SKILLS & EXPERTISE</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {data.skills.map((skill, index) => (
                            <div key={index} className="p-3 border-2 text-center rounded" style={{ borderColor: accentColor }}>
                                <p className="font-semibold text-sm">{skill}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default TimelineTemplate;
