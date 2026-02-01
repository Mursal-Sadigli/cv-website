import api from '../configs/api';

/**
 * Job Match Service - İş elanı analizi və ATS optimization
 */

export const jobMatchService = {
  /**
   * İş elanını CV ilə analiz et
   */
  async analyzeJobMatch(jobDescription, resumeText) {
    try {
      const { data } = await api.post('/api/ai/job-match', {
        jobDescription,
        resumeText
      });
      return data;
    } catch (error) {
      console.error('Job match analysis error:', error);
      throw error;
    }
  },

  /**
   * CV-ni ATS optimization üçün analiz et
   */
  async optimizeForATS(resumeText) {
    try {
      const { data } = await api.post('/api/ai/ats-optimize', {
        resumeText
      });
      return data;
    } catch (error) {
      console.error('ATS optimization error:', error);
      throw error;
    }
  },
};

export default jobMatchService;
