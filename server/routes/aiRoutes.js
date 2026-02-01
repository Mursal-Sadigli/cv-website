import express from 'express';
import protect from '../middlewares/authMiddleware.js';
import { enhanceJobDescription, enhanceProfessionalSummary, uploadResume, extractKeywords, analyzeJobMatch, optimizeForATS } from '../controllers/aiController.js';

const aiRouter = express.Router();

aiRouter.post('/enhance-pro-sum', protect, enhanceProfessionalSummary)
aiRouter.post('/enhance-job-desc', protect, enhanceJobDescription)
aiRouter.post('/upload-resume', protect, uploadResume)
aiRouter.post('/extract-keywords', protect, extractKeywords)
aiRouter.post('/job-match', protect, analyzeJobMatch)
aiRouter.post('/ats-optimize', protect, optimizeForATS)

export default aiRouter;