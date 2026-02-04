import { Plus, Trash2, Globe } from 'lucide-react';
import React from 'react'

const LanguagesForm = ({ data = [], onChange }) => {

    const addLanguage = () => {
        const newLanguage = {
            language: "",
            proficiency: "Intermediate",
        };
        onChange([...data, newLanguage]) 
    }

    const removeLanguage = (index) => {
        const updated = data.filter((_, i) => i !== index);
        onChange(updated)
    }

    const updateLanguage = (index, field, value) => {
        const updated = [...data];
        updated[index] = { ...updated[index], [field]: value }
        onChange(updated)
    }

    const proficiencyLevels = [
        "Elementary",
        "Intermediate", 
        "Upper-Intermediate",
        "Advanced",
        "Fluent",
        "Native"
    ];
    
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                        <Globe className="size-5" />
                        Languages
                    </h3>
                    <p className="text-sm text-gray-500">
                        Add the languages you know and their proficiency levels
                    </p>
                </div>
                <button
                    onClick={addLanguage}
                    className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors "
                >
                    <Plus className="size-4" />
                    Add language
                </button>
            </div>

            {data.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <Globe className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No languages added.</p>
                    <p className="text-sm">
                        Select 'Add language' to get started
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {data.map((language, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                            <div className="flex justify-between items-start">
                                <h4 className="font-medium">Language #{index + 1}</h4>
                                <button
                                    onClick={() => removeLanguage(index)}
                                    className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                    <Trash2 className="size-4" />
                                </button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-3">
                                <input 
                                    value={language.language || ""} 
                                    onChange={(e) => updateLanguage(index, "language", e.target.value)} 
                                    type="text" 
                                    placeholder="Language name (e.g. English, Français)" 
                                    className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                />
                                <select 
                                    value={language.proficiency || "Intermediate"} 
                                    onChange={(e) => updateLanguage(index, "proficiency", e.target.value)}
                                    className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {proficiencyLevels.map((level) => (
                                        <option key={level} value={level}>
                                            {level}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default LanguagesForm;
