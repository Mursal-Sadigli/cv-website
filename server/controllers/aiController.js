import Resume from "../models/Resume.js";
import groqApi from '../configs/ai.js';

// controller for enhancing a resume's professional summary
// POST: /api/ai/enhance-pro-sum
export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;
    console.log('Request body:', req.body);
    console.log('User content:', userContent);

    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const response = await groqApi.post('/chat/completions', {
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You are an expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentences also highlighting key skills, experience, and career objectives. Make it compelling and ATS-friendly. Return only the enhanced text, no options or anything else." },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    const enhancedContent = response.data.choices[0].message.content;
    return res.status(200).json({enhancedContent})
  } catch (error) {
    console.error('AI Error:', error.message);
    console.error('Error status:', error.response?.status);
    console.error('Error data:', error.response?.data);
    console.error('Full error:', error);
    return res.status(error.response?.status || 400).json({message: error.response?.data?.error?.message || error.message})
  }
}

// controller for enhancing a resume's job description
// POST: /api/ai/enhanced-job-desc

export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const response = await groqApi.post('/chat/completions', {
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You are an expert in resume writing. Your task is to enhance the job description of a resume. The job description should be only 1-2 sentences also highlighting key responsibilities and achievements. Use action verbs and quantifiable results where possible. Make it ATS-friendly. Return only the enhanced text, no options or anything else." },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    const enhancedContent = response.data.choices[0].message.content;
    return res.status(200).json({enhancedContent})
  } catch (error) {
    console.error('AI Error:', error.message);
    console.error('Error status:', error.response?.status);
    console.error('Error data:', error.response?.data);
    return res.status(error.response?.status || 400).json({message: error.response?.data?.error?.message || error.message})
  }
}

// controller for uploading a resume to the database
// POST: /api/ai/upload-resume

export const uploadResume = async (req, res) => {
  try {
   const {resumeText, title} = req.body;
   const userId = req.userId;

   if(!resumeText || !title){
    return res.status(400).json({message: 'Missing required fields'})
   }

   const systemPrompt = "You are an expert AI Agent to extract data from resume. Extract the data and return it ONLY as valid JSON, with no markdown blocks or additional text."
   const userPrompt = `Extract data from this resume and provide it in this exact JSON format only:

   {
     "professional_summary": "",
     "skills": [],
     "personal_info": {
       "image": "",
       "full_name": "",
       "profession": "",
       "email": "",
       "phone": "",
       "location": "",
       "linkedin": "",
       "website": ""
     },
     "experience": [
       {
         "company": "",
         "position": "",
         "start_date": "",
         "end_date": "",
         "description": "",
         "is_current": false
       }
     ],
     "project": [
       {
         "name": "",
         "type": "",
         "description": ""
       }
     ],
     "education": [
       {
         "institution": "",
         "degree": "",
         "field": "",
         "graduation_date": "",
         "gpa": ""
       }
     ]
   }

Resume text:
${resumeText}`;

    const response = await groqApi.post('/chat/completions', {
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    const extractedData = response.data.choices[0].message.content;
    // Remove markdown code blocks if present
    const cleanedData = extractedData.replace(/```json\n?|\n?```/g, '').trim();
    const parsedData = JSON.parse(cleanedData);
    const newResume = await Resume.create({userId, title, ...parsedData})
    
    res.json({resumeId: newResume._id})
  } catch (error) {
    console.error('Resume upload error:', error.message);
    console.error('Error status:', error.response?.status);
    console.error('Error data:', error.response?.data);
    return res.status(error.response?.status || 400).json({message: error.response?.data?.error?.message || error.message})
  }
}