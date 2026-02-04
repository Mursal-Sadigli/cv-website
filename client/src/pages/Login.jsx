import { Lock, Mail, User2Icon, Eye, EyeOff } from 'lucide-react'
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
   const [showPassword, setShowPassword] = React.useState(false)

  const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        password: ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        // Trim values
        const trimmedEmail = formData.email.trim()
        const trimmedPassword = formData.password.trim()
        const trimmedName = formData.name.trim()
        
        // Validation
        if (!trimmedEmail.match(/^[\w\.-]+@[\w\.-]+\.\w+$/)) {
            toast.error('Email format is incorrect')
            return
        }
        
        if (trimmedPassword.length < 6) {
            toast.error('Password must be at least 6 characters')
            return
        }
        
        if (state === "register" && !trimmedName) {
            toast.error('Name cannot be empty')
            return
        }
        
        try {
            const endpoint = state === "login" ? "/api/users/login" : "/api/users/register"
            const {data} = await api.post(endpoint, {
                ...formData,
                email: trimmedEmail,
                password: trimmedPassword,
                name: trimmedName
            })
            dispatch(login(data))
            localStorage.setItem('token', data.token)
            toast.success(data.message)
            // Form sıfırla
            setFormData({ name: '', email: '', password: '' })
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
        
        const trimmedEmail = forgotEmail.trim()
        
        if (!trimmedEmail.match(/^[\w\.-]+@[\w\.-]+\.\w+$/)) {
            toast.error('Email format is incorrect')
            return
        }
        
        try {
            const { data } = await api.post('/api/users/forgot-password', { email: trimmedEmail })
            toast.success('Password reset link sent to your email!')
            setShowForgotPassword(false)
            setForgotEmail('')
        } catch (error) {
            toast.error(error?.response?.data?.message || 'An error occurred!')
        }
    }
    
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50'>
        {!showForgotPassword ? (
        <form onSubmit={handleSubmit} className="sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white">
                <h1 className="text-gray-900 text-3xl mt-10 font-medium">{state === "login" ? "Log In" : "Sign Up"}</h1>
                <p className="text-gray-500 text-sm mt-2">{state === "login" ? "Please log in" : "Please sign up"}</p>
                {state !== "login" && (
                    <div className="flex items-center mt-6 w-full bg-gray-50 border-2 border-gray-200 h-12 rounded-lg overflow-hidden px-4 gap-3 focus-within:bg-white focus-within:border-green-500 focus-within:shadow-md hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
                        <User2Icon size={16} color='#9CA3AF' className="flex-shrink-0" />
                        <input autoFocus type="text" name="name" placeholder="Your Name" className="border-0 outline-0 ring-0 w-full bg-transparent focus:outline-0 focus:ring-0 focus-visible:ring-0 placeholder:text-gray-400 text-gray-900 appearance-none" value={formData.name} onChange={handleChange} maxLength="50" required />
                    </div>
                )}
                <div className="flex items-center w-full mt-6 bg-gray-50 border-2 border-gray-200 h-12 rounded-lg overflow-hidden px-4 gap-3 focus-within:bg-white focus-within:border-green-500 focus-within:shadow-md hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
                   <Mail size={13} color='#9CA3AF' className="flex-shrink-0" />
                    <input autoFocus={state === "login"} type="email" name="email" placeholder="Email address" className="border-0 outline-0 ring-0 w-full bg-transparent focus:outline-0 focus:ring-0 focus-visible:ring-0 placeholder:text-gray-400 text-gray-900 appearance-none" value={formData.email} onChange={handleChange} maxLength="100" required />
                </div>
                <div className="flex items-center mt-4 w-full bg-gray-50 border-2 border-gray-200 h-12 rounded-lg overflow-hidden px-4 gap-3 focus-within:bg-white focus-within:border-green-500 focus-within:shadow-md hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
                    <Lock size={13} color='#9CA3AF' className="flex-shrink-0" />
                    <input type={showPassword ? "text" : "password"} name="password" placeholder="Your Password" className="border-0 outline-0 ring-0 w-full bg-transparent focus:outline-0 focus:ring-0 focus-visible:ring-0 placeholder:text-gray-400 text-gray-900 appearance-none" value={formData.password} onChange={handleChange} maxLength="100" required />
                    <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>
                {state === "login" && (
                <div className="mt-4 text-left text-green-500">
                    <button type="button" onClick={() => setShowForgotPassword(true)} className="text-sm hover:underline">Forgot password?</button>
                </div>
                )}
                <button type="submit" className="mt-2 w-full h-11 rounded-full text-white bg-green-500 hover:opacity-90 transition-opacity">
                    {state === "login" ? "Log In" : "Sign Up"}
                </button>
                <p onClick={() => setState(prev => prev === "login" ? "register" : "login")} className="text-gray-500 text-sm mt-3 mb-11 cursor-pointer">{state === "login" ? "Don't have an account?" : "Already have an account?"} <span className="text-green-500 hover:underline">click here</span></p>
            </form>
        ) : (
        <form onSubmit={handleForgotPassword} className="sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white">
            <h1 className="text-gray-900 text-3xl mt-10 font-medium">Reset Password</h1>
            <p className="text-gray-500 text-sm mt-2">Enter your email to reset your password</p>
            <div className="flex items-center w-full mt-6 bg-gray-50 border-2 border-gray-200 h-12 rounded-lg overflow-hidden px-4 gap-3 focus-within:bg-white focus-within:border-green-500 focus-within:shadow-md hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
               <Mail size={13} color='#9CA3AF' className="flex-shrink-0" />
                <input autoFocus type="email" placeholder="Email address" className="border-0 outline-0 ring-0 w-full bg-transparent focus:outline-0 focus:ring-0 focus-visible:ring-0 placeholder:text-gray-400 text-gray-900 appearance-none" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value.trim())} maxLength="100" required />
            </div>
            <button type="submit" className="mt-6 w-full h-11 rounded-full text-white bg-green-500 hover:opacity-90 transition-opacity">
                Send
            </button>
            <button type="button" onClick={() => setShowForgotPassword(false)} className="text-gray-500 text-sm mt-3 mb-11 hover:underline">Go Back</button>
        </form>
        )}
    </div>
  )
}

export default Login