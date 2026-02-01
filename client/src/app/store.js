import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/authSlice'
import certificationReducer from './features/certificationSlice'
import analyticsReducer from './features/analyticsSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        certification: certificationReducer,
        analytics: analyticsReducer
    }
})