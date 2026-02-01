import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import ResumeBuilder from "./pages/ResumeBuilder";
import Preview from "./pages/Preview";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Analytics from "./pages/Analytics";
import TemplateGallery from "./pages/TemplateGallery";
import JobMatcher from "./pages/JobMatcher";
import api from "./configs/api";
import { login, setLoading } from "./app/features/authSlice";
import {Toaster} from 'react-hot-toast'

const App = () => {
  const dispatch = useDispatch()
  
  const getUserData = async() => {
    const token = localStorage.getItem('token')
    try {
      if(token){
        const {data} = await api.get('/api/users/data', {headers: {Authorization: `Bearer ${token}`}})
        if(data.user){
          dispatch(login({token, user: data.user}))
        }
        dispatch(setLoading(false))
      }else{
        dispatch(setLoading(false))
      }
    } catch (error) {
      dispatch(setLoading(false))
      console.log(error.message)
    }
  }

  useEffect(() => {
    getUserData()
  }, [])
  
  return (
    <>
    <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="reset-password" element={<ResetPassword />} />

        <Route path="app" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="builder/:resumeId" element={<ResumeBuilder />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="templates" element={<TemplateGallery />} />
          <Route path="job-matcher" element={<JobMatcher />} />
        </Route>

        <Route path="view/:resumeId" element={<Preview />} />

      </Routes>
    </>
  );
};

export default App;
