import { Lock, Mail, User2Icon } from 'lucide-react'
import React from 'react'
import { useDispatch } from 'react-redux'
import { login } from '../app/features/authSlice'
import toast from 'react-hot-toast'
import api from '../configs/api'

const Login = () => {

    const dispatch = useDispatch()
  const query=new URLSearchParams(window.location.search)
  const urlState=query.get('state')
   const [state, setState] = React.useState(urlState || "login")
   const [showForgotPassword, setShowForgotPassword] = React.useState(false)
   const [forgotEmail, setForgotEmail] = React.useState('')

  const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        password: ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const endpoint = state === "login" ? "/api/users/login" : "/api/users/register"
            const {data} = await api.post(endpoint, formData)
            dispatch(login(data))
            localStorage.setItem('token', data.token)
            toast.success(data.message)
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleForgotPassword = async (e) => {
        e.preventDefault()
        try {
            const { data } = await api.post('/api/users/forgot-password', { email: forgotEmail })
            toast.success('Şifrə sıfırlama linki e-mailinizə göndərildi!')
            setShowForgotPassword(false)
            setForgotEmail('')
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Xəta baş verdi!')
        }
    }
    
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50'>
        {!showForgotPassword ? (
        <form onSubmit={handleSubmit} className="sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white">
                <h1 className="text-gray-900 text-3xl mt-10 font-medium">{state === "login" ? "Daxil Ol" : "Qeydiyyatdan Keç"}</h1>
                <p className="text-gray-500 text-sm mt-2">{state === "login" ? "Daxil olmaq üçün xahiş edirik" : "Qeydiyyatdan keçmək üçün xahiş edirik"}</p>
                {state !== "login" && (
                    <div className="flex items-center mt-6 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden px-4 gap-2">
                        <User2Icon size={16} color='#6B7280' className="flex-shrink-0" />
                        <input type="text" name="name" placeholder="Ad" className="border-none outline-none ring-0 w-full bg-transparent hover:bg-transparent" value={formData.name} onChange={handleChange} required />
                    </div>
                )}
                <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden px-4 gap-2">
                   <Mail size={13} color='#6B7280' className="flex-shrink-0" />
                    <input type="email" name="email" placeholder="Email" className="border-none outline-none ring-0 w-full bg-transparent hover:bg-transparent" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden px-4 gap-2">
                    <Lock size={13} color='#6B7280' className="flex-shrink-0" />
                    <input type="password" name="password" placeholder="Şifrə" className="border-none outline-none ring-0 w-full bg-transparent hover:bg-transparent" value={formData.password} onChange={handleChange} required />
                </div>
                {state === "login" && (
                <div className="mt-4 text-left text-green-500">
                    <button type="button" onClick={() => setShowForgotPassword(true)} className="text-sm hover:underline">Şifrəni unutdunuz?</button>
                </div>
                )}
                <button type="submit" className="mt-2 w-full h-11 rounded-full text-white bg-green-500 hover:opacity-90 transition-opacity">
                    {state === "login" ? "Daxil Ol" : "Qeydiyyatdan Keç"}
                </button>
                <p onClick={() => setState(prev => prev === "login" ? "register" : "login")} className="text-gray-500 text-sm mt-3 mb-11 cursor-pointer">{state === "login" ? "Hesabınız yoxdur?" : "Artıq hesabınız var?"} <span className="text-green-500 hover:underline">buraya klikləyin</span></p>
            </form>
        ) : (
        <form onSubmit={handleForgotPassword} className="sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white">
            <h1 className="text-gray-900 text-3xl mt-10 font-medium">Şifrə Sıfırla</h1>
            <p className="text-gray-500 text-sm mt-2">Şifrənizi sıfırlamaq üçün e-mailinizi daxil edin</p>
            <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden px-4 gap-2">
               <Mail size={13} color='#6B7280' className="flex-shrink-0" />
                <input type="email" placeholder="Email" className="border-none outline-none ring-0 w-full bg-transparent hover:bg-transparent" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} required />
            </div>
            <button type="submit" className="mt-6 w-full h-11 rounded-full text-white bg-green-500 hover:opacity-90 transition-opacity">
                Göndər
            </button>
            <button type="button" onClick={() => setShowForgotPassword(false)} className="text-gray-500 text-sm mt-3 mb-11 hover:underline">Geri qayıt</button>
        </form>
        )}
    </div>
  )
}

export default Login