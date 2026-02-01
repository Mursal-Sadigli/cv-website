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

// controller for extracting keywords from job posting
// POST: /api/ai/extract-keywords

export const extractKeywords = async (req, res) => {
  try {
    const { jobPosting } = req.body;

    console.log('📥 Extract Keywords Request - Received:', { hasJobPosting: !!jobPosting });

    if (!jobPosting || jobPosting.trim().length === 0) {
      return res.status(400).json({ message: "Job posting is required" });
    }

    console.log('🤖 Calling Groq API for keyword extraction...');

    const response = await groqApi.post('/chat/completions', {
      model: "llama-3.1-8b-instant",
      messages: [
        { 
          role: "system", 
          content: "You are an expert in extracting keywords and skills from job postings. Extract the most important keywords, technical skills, soft skills, tools, frameworks, and technologies from the job posting. Return ONLY a JSON array of keywords as strings, with no markdown blocks or additional text. Example: [\"React\", \"Node.js\", \"MongoDB\", \"Team Leadership\"]"
        },
        {
          role: "user",
          content: `Extract keywords and skills from this job posting:\n\n${jobPosting}`,
        },
      ],
    });

    console.log('✓ Groq API Response received');

    const responseText = response.data.choices[0].message.content;
    console.log('Raw response:', responseText.substring(0, 100) + '...');

    // Remove markdown code blocks and clean the text
    let cleanedText = responseText
      .replace(/```json\n?|\n?```/g, '')
      .replace(/```\n?|\n?```/g, '')
      .trim();
    
    console.log('Cleaned text:', cleanedText.substring(0, 100) + '...');

    // Extract JSON array if it's embedded in text
    const jsonMatch = cleanedText.match(/\[\s*[\s\S]*?\s*\]/);
    if (jsonMatch) {
      cleanedText = jsonMatch[0];
      console.log('Extracted JSON array');
    }

    let keywords = JSON.parse(cleanedText);
    
    // Ensure it's an array
    if (!Array.isArray(keywords)) {
      console.warn('⚠️  Response is not an array, converting...');
      keywords = Object.values(keywords || {});
    }

    console.log('✓ Keywords extracted:', keywords.length, 'items');

    return res.status(200).json({ keywords: Array.isArray(keywords) ? keywords : [] });
  } catch (error) {
    console.error('❌ Keyword extraction error:', error.message);
    console.error('Error status:', error.response?.status);
    console.error('Error data:', error.response?.data);
    
    // More informative error message
    const errorMessage = error.response?.data?.error?.message 
      || (error instanceof SyntaxError ? 'Invalid response format from AI' : error.message);
    
    return res.status(error.response?.status || 400).json({ 
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : 'API Error'
    });
  }
}

// controller for job match analysis
// POST: /api/ai/job-match
export const analyzeJobMatch = async (req, res) => {
  try {
    const { jobDescription, resumeText } = req.body;

    if (!jobDescription || !resumeText) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    console.log('📊 Analyzing job match with Groq AI...');

    const response = await groqApi.post('/chat/completions', {
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are an expert recruiter and career advisor with deep knowledge of resume analysis, job matching, and hiring trends. 

Your task is to analyze how well a candidate's resume matches a specific job description. Be thorough, accurate, and provide actionable insights.

Return a JSON response with EXACTLY this structure:
{
  "matchPercentage": number between 0-100 (overall match score),
  "matchedSkills": ["skill1", "skill2", "skill3"] (skills from resume that match job requirements),
  "missingSkills": ["skill1", "skill2"] (important skills from job that candidate lacks),
  "recommendations": [
    "recommendation1 - specific and actionable",
    "recommendation2",
    "recommendation3"
  ],
  "summary": "2-3 sentence overall assessment of fit"
}

RULES:
- Be realistic and fair in your scoring
- Identify both hard skills (technical) and soft skills (communication, leadership)
- Provide 3-5 matched skills and 2-4 missing skills
- Give 3-5 specific, actionable recommendations
- Return ONLY valid JSON, no markdown blocks, no extra text`
        },
        {
          role: "user",
          content: `Please analyze this job match:

JOB DESCRIPTION:
${jobDescription}

CANDIDATE'S RESUME:
${resumeText}

Provide a detailed match analysis in JSON format.`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    let analysisText = response.data.choices[0].message.content;
    
    console.log('✓ Groq AI Response received');
    console.log('Raw response:', analysisText.substring(0, 150) + '...');
    
    // JSON extract et
    let cleanedText = analysisText
      .replace(/```json\n?|\n?```/g, '')
      .replace(/```\n?|\n?```/g, '')
      .trim();
    
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Failed to extract JSON from:', cleanedText);
      throw new Error('Invalid JSON response from Groq AI');
    }

    const analysis = JSON.parse(jsonMatch[0]);
    console.log('✓ Job match analysis complete:', analysis.matchPercentage + '%');
    console.log('Matched skills:', analysis.matchedSkills);
    console.log('Missing skills:', analysis.missingSkills);
    
    return res.status(200).json(analysis);
  } catch (error) {
    console.error('❌ Job match error:', error.message);
    if (error.response?.data) {
      console.error('API Error details:', error.response.data);
    }
    return res.status(error.response?.status || 400).json({
      message: error.message || 'Failed to analyze job match'
    });
  }
}

// controller for ATS optimization
// POST: /api/ai/ats-optimize
export const optimizeForATS = async (req, res) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText) {
      return res.status(400).json({ message: "Missing resume data" });
    }

    console.log('⚙️  Analyzing ATS compatibility with Groq AI...');

    const response = await groqApi.post('/chat/completions', {
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are an ATS (Applicant Tracking System) optimization expert and resume specialist. Your expertise includes:
- ATS compatibility and parsing algorithms
- Resume formatting best practices
- Keyword optimization for ATS systems
- Common ATS issues and solutions

Analyze the provided resume and give detailed recommendations for ATS optimization.

Return a JSON response with EXACTLY this structure:
{
  "atsScore": number between 0-100 (overall ATS compatibility score),
  "issues": [
    "issue1 - specific problem found",
    "issue2",
    "issue3"
  ],
  "improvements": [
    "improvement1 - specific, actionable recommendation",
    "improvement2",
    "improvement3"
  ],
  "keywords": [
    "keyword1 - important industry/technical term",
    "keyword2",
    "keyword3",
    "keyword4"
  ],
  "formatTips": [
    "formatting tip 1",
    "formatting tip 2",
    "formatting tip 3"
  ],
  "summary": "2-3 sentence overall ATS readiness assessment and priority actions"
}

RULES:
- Be specific about what needs to be fixed
- Focus on ATS-critical issues (formatting, keywords, structure)
- Identify missing industry keywords that would improve ranking
- Provide actionable, specific tips
- Score between 0-100 based on ATS compatibility
- Return ONLY valid JSON, no markdown blocks, no extra text`
        },
        {
          role: "user",
          content: `Please perform an ATS optimization analysis on this resume:

${resumeText}

Provide detailed recommendations in JSON format.`
        }
      ],
      temperature: 0.7,
      max_tokens: 1200
    });

    let optimizationText = response.data.choices[0].message.content;
    
    console.log('✓ Groq AI Response received');
    console.log('Raw response:', optimizationText.substring(0, 150) + '...');
    
    // JSON extract et
    let cleanedText = optimizationText
      .replace(/```json\n?|\n?```/g, '')
      .replace(/```\n?|\n?```/g, '')
      .trim();
    
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Failed to extract JSON from:', cleanedText);
      throw new Error('Invalid JSON response from Groq AI');
    }

    const optimization = JSON.parse(jsonMatch[0]);
    console.log('✓ ATS analysis complete. Score:', optimization.atsScore + '%');
    console.log('Issues found:', optimization.issues?.length);
    console.log('Improvements suggested:', optimization.improvements?.length);
    console.log('Keywords identified:', optimization.keywords?.length);
    
    return res.status(200).json(optimization);
  } catch (error) {
    console.error('❌ ATS optimization error:', error.message);
    if (error.response?.data) {
      console.error('API Error details:', error.response.data);
    }
    return res.status(error.response?.status || 400).json({
      message: error.message || 'Failed to optimize for ATS'
    });
  }
}
