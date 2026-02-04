import { Plus, Trash2 } from 'lucide-react';
import React from 'react'

const ProjectForm = ({ data, onChange }) => {

    const addProject = () => {
        const newProject = {
            name: "",
            type: "",
            description: "",
        };
        onChange([...data, newProject]) 
    }

    const removeProject = (index) => {
        const updated = data.filter((_, i) => i !== index);
        onChange(updated)
    }

    const updatedProject = (index, field, value) => {
        const updated = [...data];
        updated[index] = { ...updated[index], [field]: value }
        onChange(updated)
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                        Projects
                    </h3>
                    <p className="text-sm text-gray-500">
                        Add your projects
                    </p>
                </div>
                <button
                    onClick={addProject}
                    className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-green-200 transition-colors "
                >
                    <Plus className="size-4" />
                    Add new project
                </button>
            </div>

            <div className="space-y-4 mt-6">
                {data.map((project, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                        <div className="flex justify-between items-start">
                            <h4>Project #{index + 1}</h4>
                            <button
                                onClick={() => removeProject(index)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                            >
                                <Trash2 className="size-4" />
                            </button>
                        </div>

                        <div className="grid gap-3">
                            <input
                                value={project.name || ""}
                                onChange={(e) => updatedProject(index, "name", e.target.value)}
                                type="text"
                                placeholder="Project name"
                                className="px-3 py-2 text-sm rounded-lg"
                            />
                            <input
                                value={project.type || ""}
                                onChange={(e) => updatedProject(index, "type", e.target.value)}
                                type="text"
                                placeholder="Project type"
                                className="px-3 py-2 text-sm rounded-lg"
                            />
                            <textarea
                                rows={4}
                                value={project.description || ""}
                                onChange={(e) => updatedProject(index, "description", e.target.value)}
                                placeholder="Describe your project..."
                                className="w-full px-3 py-2 text-sm rounded-lg resize-none"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ProjectForm;
