const ProfessionalTemplate = ({ data, accentColor }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        return new Date(year, month - 1).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short"
        });
    };

    return (
        <div className="w-full mx-auto p-8 bg-white text-gray-800 print:p-6 print:m-0">
            {/* Header with line */}
            <header className="mb-8 pb-6 border-b-4" style={{ borderColor: accentColor }}>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-black" style={{ color: accentColor }}>
                            {data.personal_info?.full_name || "Your Name"}
                        </h1>
                        <p className="text-lg text-gray-600 mt-1">{data.personal_info?.profession || "Professional"}</p>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                        {data.personal_info?.email && <p>{data.personal_info.email}</p>}
                        {data.personal_info?.phone && <p>{data.personal_info.phone}</p>}
                        {data.personal_info?.location && <p>{data.personal_info.location}</p>}
                    </div>
                </div>
            </header>

            <div className="space-y-8">
                {/* Professional Summary */}
                {data.professional_summary && (
                    <section>
                        <p className="text-gray-700 leading-relaxed">{data.professional_summary}</p>
                    </section>
                )}

                {/* Experience */}
                {data.experience && data.experience.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold mb-4 pb-2 border-b-2" style={{ color: accentColor, borderColor: accentColor }}>
                            PROFESSIONAL EXPERIENCE
                        </h2>
                        <div className="space-y-4">
                            {data.experience.map((exp, index) => (
                                <div key={index}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-lg">{exp.position}</h3>
                                            <p className="text-sm" style={{ color: accentColor }}>{exp.company}</p>
                                        </div>
                                        <p className="text-xs text-gray-500 text-right">
                                            {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                                        </p>
                                    </div>
                                    <p className="text-sm text-gray-700 mt-2">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {data.education && data.education.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold mb-4 pb-2 border-b-2" style={{ color: accentColor, borderColor: accentColor }}>
                            EDUCATION
                        </h2>
                        <div className="space-y-3">
                            {data.education.map((edu, index) => (
                                <div key={index}>
                                    <div className="flex justify-between">
                                        <div>
                                            <h3 className="font-bold">{edu.degree} in {edu.field}</h3>
                                            <p className="text-sm" style={{ color: accentColor }}>{edu.institution}</p>
                                        </div>
                                        <p className="text-xs text-gray-500">{formatDate(edu.graduation_date)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Skills */}
                {data.skills && data.skills.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold mb-4 pb-2 border-b-2" style={{ color: accentColor, borderColor: accentColor }}>
                            SKILLS
                        </h2>
                        <div className="columns-2 md:columns-3">
                            {data.skills.map((skill, index) => (
                                <div key={index} className="text-sm text-gray-700 break-inside-avoid">
                                    ✓ {skill}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default ProfessionalTemplate;
