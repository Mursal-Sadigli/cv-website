import React, { useState } from 'react'
import { X, Plus, Sparkles } from 'lucide-react'

const SkillsForm = ({data, onChange}) => {
    const [newSkill, setNewSkill] = useState("")

    const addSkill = () => {
        if(newSkill.trim() && !data.includes(newSkill.trim())){
            onChange([...data, newSkill.trim()])
            setNewSkill("")
        }
    }

    const removeSkill = (indexToRemove) => {
        onChange(data.filter((_, index) => index !== indexToRemove))
    }

    const handleKeyPress = (e) => {
        if(e.key === "Enter"){
            e.preventDefault();
            addSkill();
        }
    }

  return (
    <div className='space-y-4'>
        <div>
            <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Bacarıqlar</h3>
            <p className='text-sm text-gray-500'>Peşəkar və şəxsi bacarıqlarınızı daxil edin</p>
        </div>
        
        <div>
            <input type='text' placeholder='Bacarıq daxil edin (məsələn, JavaScript, Layihə İdarəetməsi)'
            className='flex-1 px-3 py-2 text-sm' onChange={(e) => setNewSkill(e.target.value)}
            value={newSkill} onKeyDown={handleKeyPress} />
            <button onClick={addSkill} disabled={!newSkill.trim()} className='flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
                <Plus className='size-4' />Əlavə et
                </button>
        </div>

        {data.length > 0 ? (
            <div className='flex flex-wrap gap-2'>
                {data.map((skill, index) => (
                    <span key={index} className='flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm'>
                        {skill}
                        <button onClick={() => removeSkill(index)} className='ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors'>
                            <X className='w-3 h-3' />
                        </button>
                    </span>
                ))}
            </div>
        )
    :
    (
        <div className='text-center py-6 text-gray-500'>
            <Sparkles className='w-10 h-10 mx-auto mb-2 text-gray-300' />
            <p>Bacarıqlar əlavə olunmayıb.</p>
            <p className='text-sm'>Texniki və sosial bacarıqlarınızı yuxarıda əlavə edin.</p>
        </div>
    )}

    <div className='bg-blue-50 p-3 rounded-lg'>
        <p className='text-sm text-blue-800'><strong>Məsləhət:</strong> 8-12 uyğun bacarıq əlavə edin. Həm texniki bacarıqları (proqramlaşdırma dilləri, alətlər), həm də sosial bacarıqları (liderlik, ünsiyyət) daxil edin.</p>
    </div>
    </div>
  )
}

export default SkillsForm