import imagekit from "../configs/imageKit.js";
import Resume from "../models/Resume.js";
import fs from 'fs';

// controller for creating a new resume
// POST: /api/resumes/create
export const createResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;

    // create new resume
    const newResume = await Resume.create({ userId, title });
    // return success message
    return res
      .status(201)
      .json({ message: "Resume created successfully", resume: newResume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// controller for deleting a resume
// DELETE: /api/resumes/delete

export const deleteResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    await Resume.findOneAndDelete({ userId, _id: resumeId });

    // return success message
    return res
      .status(200)
      .json({ message: "Resume deleted successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// get user resume by id
// GET: /api/resume/get

export const getResumeById = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    const resume = await Resume.findOne({ userId, _id: resumeId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    resume.__v = undefined;
    resume.createdAt = undefined;
    resume.updatedAt = undefined;

    return res.status(200).json({ resume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// get resume by id public
// GET: /api/resumes/public
export const getPublicResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const resume = await Resume.findOne({ public: true, _id: resumeId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json({ resume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// controller for updating a resume
// PUT: /api/resume/update

export const updateResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId, resumeData, removeBackground } = req.body;
    const image = req.file;

    console.log("UPDATE RESUME - userId:", userId);
    console.log("UPDATE RESUME - resumeId:", resumeId);
    console.log("UPDATE RESUME - resumeData:", resumeData);

    let resumeDataCopy;
    if(typeof resumeData === 'string'){
      resumeDataCopy = JSON.parse(resumeData)
    }else{
      resumeDataCopy = resumeData
    }

    if (image) {
        const imageBufferData = fs.createReadStream(image.path)

      const bgColor = resumeDataCopy.accent_color ? resumeDataCopy.accent_color.replace('#', '') : 'FFFFFF';
      
      let transformPre = 'w-300,h-300,fo-face,c-crop';
      
      if(removeBackground) {
        transformPre += `,e-bgremove,z-0.6,bg-${bgColor}`;
      }
      
      const response = await imagekit.files.upload({
        file: imageBufferData,
        fileName: "resume.png",
        folder: 'user-resumes',
        transformation: {
            pre: transformPre
        }
      });

      resumeDataCopy.personal_info.image = response.url
    }

    // Update resume with $set operator
    const result = await Resume.updateOne(
      { userId, _id: resumeId },
      { $set: resumeDataCopy }
    );

    console.log("UPDATE RESULT:", result);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // Fetch updated resume
    const resume = await Resume.findOne({ userId, _id: resumeId });
    
    console.log("FETCHED RESUME:", resume);
    
    return res.status(200).json({ message: "Saved successfully", resume });
  } catch (error) {
    console.log("UPDATE ERROR:", error);
    return res.status(400).json({ message: error.message });
  }
};
