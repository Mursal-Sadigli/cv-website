import api from '../configs/api';

/**
 * Analytics Service - Server ilə API komunikasiyası
 */

export const analyticsService = {
  /**
   * İstifadəçinin analytics məlumatlarını serverdan al
   */
  async getAnalytics() {
    try {
      const { data } = await api.get('/api/users/analytics');
      return data.analytics;
    } catch (error) {
      console.error('Analytics yüklənərkən xəta:', error);
      throw error;
    }
  },

  /**
   * Analytics məlumatlarını serverə yaz
   */
  async updateAnalytics(analytics) {
    try {
      const { data } = await api.put('/api/users/analytics', { analytics });
      return data.analytics;
    } catch (error) {
      console.error('Analytics saxlanarkən xəta:', error);
      throw error;
    }
  },

  /**
   * Resume yükləndikdə analytics saxla
   */
  async trackResumeDownload(resumeId) {
    try {
      const analytics = await this.getAnalytics();
      analytics.downloadsCount = (analytics.downloadsCount || 0) + 1;
      analytics.lastActivityDate = new Date();
      return await this.updateAnalytics(analytics);
    } catch (error) {
      console.error('Download tracking xətası:', error);
    }
  },

  /**
   * Şablon seçildiyi zaman analytics saxla
   */
  async trackTemplateUsage(templateName) {
    try {
      const analytics = await this.getAnalytics();
      if (!analytics.templatesUsed) {
        analytics.templatesUsed = {};
      }
      analytics.templatesUsed[templateName] = (analytics.templatesUsed[templateName] || 0) + 1;
      analytics.lastActivityDate = new Date();
      return await this.updateAnalytics(analytics);
    } catch (error) {
      console.error('Template usage tracking xətası:', error);
    }
  },

  /**
   * Resume yaradıldığında analytics saxla
   */
  async trackResumeCreated() {
    try {
      const analytics = await this.getAnalytics();
      analytics.resumesCreated = (analytics.resumesCreated || 0) + 1;
      analytics.sessionsCount = (analytics.sessionsCount || 0) + 1;
      analytics.lastActivityDate = new Date();
      return await this.updateAnalytics(analytics);
    } catch (error) {
      console.error('Resume creation tracking xətası:', error);
    }
  },

  /**
   * Vaxt hərəkəti saxla (saniyə)
   */
  async trackTimeSpent(seconds) {
    try {
      const analytics = await this.getAnalytics();
      analytics.totalTimeSpent = (analytics.totalTimeSpent || 0) + seconds;
      analytics.lastActivityDate = new Date();
      return await this.updateAnalytics(analytics);
    } catch (error) {
      console.error('Time tracking xətası:', error);
    }
  },
};

export default analyticsService;
