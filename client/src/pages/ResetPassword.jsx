import { Lock, Eye, EyeOff } from 'lucide-react'
import React from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../configs/api'

const ResetPassword = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const token = searchParams.get('token')
    
    const [formData, setFormData] = React.useState({
        newPassword: '',
        confirmPassword: ''
    })
    const [loading, setLoading] = React.useState(false)
    const [showPassword, setShowPassword] = React.useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value.trim() }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!formData.newPassword || !formData.confirmPassword) {
            toast.error('Bütün sahələri doldurun')
            return
        }
        
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('Şifrələr uyğun gəlmir!')
            return
        }

        if (formData.newPassword.length < 6) {
            toast.error('Şifrə ən azı 6 simvol olmalıdır!')
            return
        }
        
        // Şifrə gücü yoxlaması
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
            toast.error('Şifrə hərflər və rəqəmlərdən ibarət olmalıdır')
            return
        }

        try {
            setLoading(true)
            const { data } = await api.post('/api/users/reset-password', {
                token,
                newPassword: formData.newPassword
            })
            toast.success(data.message)
            setFormData({ newPassword: '', confirmPassword: '' })
            navigate('/login')
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Xəta baş verdi!')
        } finally {
            setLoading(false)
        }
    }

    if (!token) {
        return (
            <div className='flex items-center justify-center min-h-screen bg-gray-50'>
                <div className="sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white py-10">
                    <h1 className="text-gray-900 text-3xl font-medium">Xəta</h1>
                    <p className="text-gray-500 text-sm mt-2">Sıfırlama linki keçərsizdir</p>
                </div>
            </div>
        )
    }

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-50'>
            <form onSubmit={handleSubmit} className="sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white">
                <h1 className="text-gray-900 text-3xl mt-10 font-medium">Yeni Şifrə</h1>
                <p className="text-gray-500 text-sm mt-2">Yeni şifrənizi daxil edin</p>
                
                <div className="flex items-center mt-6 w-full bg-gray-50 border-2 border-gray-200 h-12 rounded-lg overflow-hidden px-4 gap-3 focus-within:bg-white focus-within:border-green-500 focus-within:shadow-md hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
                    <Lock size={13} color='#9CA3AF' className="flex-shrink-0" />
                    <input 
                        type={showPassword ? "text" : "password"} 
                        name="newPassword" 
                        placeholder="Yeni şifrə" 
                        className="border-none outline-none ring-0 w-full bg-transparent focus:ring-0 placeholder:text-gray-400 text-gray-900" 
                        value={formData.newPassword} 
                        onChange={handleChange}
                        maxLength="100"
                        autoFocus
                        required 
                    />
                    <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>

                <div className="flex items-center mt-4 w-full bg-gray-50 border-2 border-gray-200 h-12 rounded-lg overflow-hidden px-4 gap-3 focus-within:bg-white focus-within:border-green-500 focus-within:shadow-md hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
                    <Lock size={13} color='#9CA3AF' className="flex-shrink-0" />
                    <input 
                        type={showConfirmPassword ? "text" : "password"} 
                        name="confirmPassword" 
                        placeholder="Şifrəni təsdiq edin" 
                        className="border-none outline-none ring-0 w-full bg-transparent focus:ring-0 placeholder:text-gray-400 text-gray-900" 
                        value={formData.confirmPassword} 
                        onChange={handleChange}
                        maxLength="100"
                        required 
                    />
                    <button 
                        type="button" 
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="mt-6 w-full h-11 rounded-full text-white bg-green-500 hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                    {loading ? 'Yüklənir...' : 'Şifrəni Sıfırla'}
                </button>
            </form>
        </div>
    )
}

export default ResetPassword
