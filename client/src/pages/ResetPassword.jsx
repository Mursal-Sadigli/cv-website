import { Lock } from 'lucide-react'
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

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('Şifrələr uyğun gəlmir!')
            return
        }

        if (formData.newPassword.length < 6) {
            toast.error('Şifrə ən azı 6 simvol olmalıdır!')
            return
        }

        try {
            setLoading(true)
            const { data } = await api.post('/api/users/reset-password', {
                token,
                newPassword: formData.newPassword
            })
            toast.success(data.message)
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
                
                <div className="flex items-center mt-6 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                    <Lock size={13} color='#6B7280' />
                    <input 
                        type="password" 
                        name="newPassword" 
                        placeholder="Yeni Şifrə" 
                        className="border-none outline-none ring-0 w-full" 
                        value={formData.newPassword} 
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                    <Lock size={13} color='#6B7280' />
                    <input 
                        type="password" 
                        name="confirmPassword" 
                        placeholder="Şifrəni Təsdiq Et" 
                        className="border-none outline-none ring-0 w-full" 
                        value={formData.confirmPassword} 
                        onChange={handleChange} 
                        required 
                    />
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
