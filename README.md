# 🚀 Professional Resume Builder

A modern, feature-rich resume builder application that enables users to create, customize, and download professional resumes with multiple templates and AI-powered suggestions.

## ✨ Key Features

### 📋 Multiple Professional Templates
- **8+ Customizable Templates**: Classic, Minimal, Modern, Professional, Creative, Timeline, Modern Colorful, and Minimal Image templates
- **Real-time Preview**: See changes instantly as you build your resume
- **Template Switcher**: Switch between templates at any time without losing data
- **Color Customization**: Choose custom colors for each template

### 🎨 Rich Customization Options
- **Dark Mode Support**: Eye-friendly dark theme with persistent storage
- **Dynamic Color Picker**: Personalize your resume's appearance
- **Responsive Design**: Perfect on desktop, tablet, and mobile devices
- **Professional Styling**: Built with Tailwind CSS for consistent, modern UI

### 📝 Comprehensive Form Fields
- Personal Information (Name, Email, Phone, Location)
- Professional Summary
- Work Experience
- Education
- Projects & Portfolio
- Skills Management
- Certifications & Awards
- Languages Proficiency
- Dynamic Form Validation

### 🤖 AI-Powered Features
- **AI Job Matcher**: Match your resume against job descriptions
- **Smart Suggestions**: Get AI-powered recommendations to improve your resume
- **Integration**: Powered by OpenAI API for intelligent insights

### 📊 Analytics Dashboard
- **Resume Metrics**: Track resume creation and downloads
- **Template Usage Statistics**: Understand which templates are most popular
- **User Engagement Tracking**: Monitor user behavior and preferences
- **Real-time Dashboard**: View analytics with intuitive charts

### 💾 Data Management
- **Auto-save**: Resume data automatically saves to the backend
- **Cloud Storage**: Secure MongoDB database for user data
- **Resume History**: Access and manage multiple resumes
- **Export Options**: Download resumes as PDF

### 🔐 User Authentication
- **User Accounts**: Secure registration and login system
- **JWT Authentication**: Secure token-based authentication
- **Password Reset**: Email-based password recovery
- **Session Management**: Persistent user sessions

### 📧 Email Integration
- **Email Notifications**: Resend integration for email services
- **Password Recovery**: Secure email-based password reset

### 🖼️ Media Management
- **Image Upload**: Profile picture upload with ImageKit integration
- **Optimized Images**: Automatic image optimization and delivery
- **File Upload**: Multer integration for secure file handling

## 🛠️ Tech Stack

### Frontend
- **React 19.2** - Modern UI library
- **Vite 7.2** - Lightning-fast build tool
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Redux Toolkit 2.11** - State management
- **React Router 7.12** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Modern icon library
- **React Hot Toast** - Elegant notifications

### Backend
- **Node.js / Express 5.2** - Server framework
- **MongoDB / Mongoose** - Database and ODM
- **JWT** - Secure authentication
- **Bcrypt** - Password hashing
- **OpenAI API** - AI features
- **Google Generative AI** - Alternative AI integration
- **ImageKit** - Image optimization and delivery
- **Multer** - File upload handling
- **Resend** - Email service
- **CORS** - Cross-origin resource sharing

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn
- MongoDB database (local or cloud)
- OpenAI API key (for AI features)
- ImageKit account (for image uploads)

### Client Setup

```bash
cd client
npm install
```

**Environment Variables (.env):**
```env
VITE_API_BASE_URL=http://localhost:5000
```

**Development:**
```bash
npm run dev
```

**Production Build:**
```bash
npm run build
npm run preview
```

### Server Setup

```bash
cd server
npm install
```

**Environment Variables (.env):**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
OPENAI_API_KEY=your_openai_api_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
RESEND_API_KEY=your_resend_api_key
SMTP_EMAIL=your_email
SMTP_PASSWORD=your_email_password
```

**Development:**
```bash
npm run server
```

**Production:**
```bash
npm start
```

## 🚀 Deployment

### Frontend (Vercel)
- Connected Vercel integration via `vercel.json`
- Automatic deployments from main branch
- Environment variables configured in Vercel dashboard

### Backend (Node.js Hosting)
- Deploy to any Node.js hosting (Heroku, Railway, Render, DigitalOcean)
- Ensure MongoDB is accessible from production
- Set all environment variables in production environment

## 📚 Project Structure

```
resume-builder/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── app/           # Redux store & slices
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API service functions
│   │   ├── utils/         # Utility functions
│   │   └── assets/        # Templates & assets
│   ├── vite.config.js     # Vite configuration
│   └── tailwind.config.js # Tailwind configuration
│
└── server/                 # Express backend server
    ├── models/            # Mongoose models
    ├── controllers/       # Route controllers
    ├── routes/            # API routes
    ├── middlewares/       # Custom middleware
    ├── configs/           # Configuration files
    └── server.js          # Entry point

```

## 🎯 Usage Guide

### Creating a Resume
1. Sign up or log in to your account
2. Click "Create New Resume" on the dashboard
3. Select your preferred template
4. Fill in your information using the form sections
5. Customize colors and styling using the color picker
6. Preview your resume in real-time on the right panel
7. Download as PDF or save for later editing

### Switching Templates
- Use the template selector to change designs at any time
- All your data is preserved when switching
- Customize colors for each template

### Using AI Features
- **Job Matcher**: Upload a job description to get matching recommendations
- **AI Suggestions**: Get personalized tips to improve your resume
- **Smart Analysis**: AI analyzes your skills against job requirements

### Analytics
- Navigate to the Analytics page
- View your resume creation trends
- Track which templates you use most
- Monitor total downloads and user engagement

## 🔒 Security Features

- **Password Security**: Bcrypt hashing for passwords
- **JWT Authentication**: Secure token-based authentication
- **CORS Protection**: Configured CORS for safe API access
- **Input Validation**: Server-side validation of all inputs
- **Environment Variables**: Sensitive data stored in .env files
- **Multer Security**: Secure file upload handling

## 🎨 Customization

The application is highly customizable:

### Add New Templates
1. Create new template component in `client/src/components/templates/`
2. Export template in template list
3. Add to template selector options

### Modify Colors
- Color schemes are customizable through the color picker
- Template-specific styling in Tailwind CSS
- Theme variables in Redux store

### Add New Form Fields
1. Create new form component in `client/src/components/`
2. Add to ResumeBuilder page
3. Update resume data structure
4. Sync with backend Resume model

## 📊 Analytics Events Tracked

- Resume creation events
- Template selection and usage
- Resume downloads
- User engagement metrics
- Theme preferences
- Feature usage patterns

## 🔄 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `POST /api/users/reset-password` - Password reset

### Resumes
- `POST /api/resumes` - Create new resume
- `GET /api/resumes/:id` - Get resume by ID
- `PUT /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume
- `GET /api/resumes` - Get all user resumes

### AI Features
- `POST /api/ai/job-match` - Match resume with job description
- `POST /api/ai/suggestions` - Get AI suggestions for resume

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
- Verify MongoDB connection string in .env
- Check network access in MongoDB Atlas
- Ensure MongoDB service is running

### "AI features not working"
- Verify OpenAI API key is set correctly
- Check API key has sufficient quota
- Review API rate limits

### "Images not uploading"
- Verify ImageKit credentials
- Check file size limits
- Ensure proper CORS configuration

### "Frontend can't reach backend"
- Verify `VITE_API_BASE_URL` is correct
- Check backend is running on correct port
- Ensure CORS is enabled on backend

## 📝 License

This product is sold as-is on Gumroad. Please refer to the license agreement included with your purchase.

## 🤝 Support

For support, questions, or custom modifications:
- Review the troubleshooting section above
- Check component documentation in the code
- Examine API route implementations for integration details

## 🎁 What's Included

✅ Complete source code (Frontend + Backend)
✅ All 8+ professional templates
✅ AI integration (OpenAI)
✅ Analytics dashboard
✅ User authentication system
✅ Cloud storage integration
✅ Email services
✅ Image optimization
✅ Dark mode support
✅ Fully responsive design
✅ Production-ready code
✅ Database models
✅ API documentation

## 🚀 Future Enhancement Ideas

- Social login (Google, GitHub)
- More resume templates
- Batch resume creation
- Team collaboration features
- Resume version history
- LinkedIn import/export
- ATS (Applicant Tracking System) compatibility checker
- Cover letter builder
- Interview preparation guide
- Job board integration
- Mobile app (React Native)

## 📈 Performance

- **Fast Loading**: Vite provides near-instant HMR
- **Optimized Images**: ImageKit automatic optimization
- **Efficient State**: Redux for centralized state management
- **Database**: MongoDB indexes for quick queries
- **Caching**: Browser and server-side caching strategies

---

**Version**: 1.0.0  
**Last Updated**: February 2026  
**Status**: Production Ready ✓

Ready to build amazing resumes? Get started today! 🎉
